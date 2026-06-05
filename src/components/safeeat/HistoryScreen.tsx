'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Search, Clock, Trash2, ScanLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

type FilterType = 'all' | 'scan' | 'combo' | 'medicine' | 'saved'

export function HistoryScreen() {
  const store = useAppStore()

console.log("FULL STORE =", store)

const scanHistory = Array.isArray(store?.scanHistory)
  ? store.scanHistory
  : []

const setScanHistory = store?.setScanHistory
const setCurrentScreen = store?.setCurrentScreen
const setSelectedScan = store?.setSelectedScan
const clearHistory = store?.clearHistory
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter] = useState<FilterType>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const res = await fetch('/api/scan?limit=50')
        const data = await res.json()

        console.log("API DATA =", data)
        console.log("SCAN ARRAY =", data.scan)

        console.log('SCANS DATA =', data)

        if (data.success) {
  setScanHistory(
    Array.isArray(data.scan)
      ? data.scan
      : []
  )
}
        
        else {
          setScanHistory([])
        }
      } catch (err) {
        console.error('Failed to fetch scans:', err)
        setScanHistory([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchScans()
  }, [setScanHistory])

  const filteredHistory = (scanHistory || []).filter((scan: any) => {
    const matchesSearch =
      !searchQuery ||
      (scan?.productName || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

    let matchesFilter = true

    if (activeFilter === 'saved') {
      matchesFilter = scan?.isSaved === true
    }

    return matchesSearch && matchesFilter
  })

  const handleClearHistory = async () => {
    try {
      await fetch('/api/scan', {
        method: 'DELETE',
      })

      clearHistory()
      toast.success('History cleared')
    } catch {
      toast.error('Failed to clear history')
    }
  }

  const handleDeleteScan = async (
    scan: any,
    e: React.MouseEvent
  ) => {
    e.stopPropagation()

    try {
      if (scan?.id) {
        await fetch(`/api/scan?id=${scan.id}`, {
          method: 'DELETE',
        })
      }

      setScanHistory(
        (scanHistory || []).filter(
          (s: any) => s.id !== scan.id
        )
      )

      toast.success('Scan deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  const handleScanClick = (scan: any) => {
    setSelectedScan(scan)
    setCurrentScreen('results')
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <p>Loading history...</p>
      </div>
    )
  }

  return (
    <motion.div
      className="flex flex-col gap-4 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">
            Scan History
          </h1>

          <p className="text-sm text-muted-foreground">
            {filteredHistory.length} scans
          </p>
        </div>

        {filteredHistory.length > 0 && (
          <Button
            variant="outline"
            onClick={handleClearHistory}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

        <Input
          className="pl-10"
          placeholder="Search scans..."
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(e.target.value)
          }
        />
      </div>

      {filteredHistory.length === 0 ? (
        <Card className="p-8 text-center">
          <Clock className="h-10 w-10 mx-auto mb-3 opacity-50" />

          <p>No scans found</p>

          <Button
            className="mt-4"
            onClick={() =>
              setCurrentScreen('scanner')
            }
          >
            <ScanLine className="h-4 w-4 mr-2" />
            Scan Product
          </Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredHistory.map(
            (scan: any, index: number) => (
              <Card
                key={scan?.id || index}
                className="p-4 cursor-pointer"
                onClick={() =>
                  handleScanClick(scan)
                }
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {scan?.productName ||
                        'Unknown Product'}
                    </h3>

                    <p className="text-xs text-muted-foreground">
                      {scan?.createdAt
                        ? new Date(
                            scan.createdAt
                          ).toLocaleDateString()
                        : ''}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) =>
                      handleDeleteScan(
                        scan,
                        e
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )
          )}
        </div>
      )}
    </motion.div>
  )
}