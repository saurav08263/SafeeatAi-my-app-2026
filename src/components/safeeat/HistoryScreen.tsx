'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import type { ScanResult } from '@/lib/store'
import { SafetyScoreCircle } from './SafetyScoreCircle'
import {
  Clock, Trash2, ChevronRight, Shield, Search,
  AlertTriangle, Leaf, CircleCheck, Bookmark, ScanLine,
  MessageCircle, Pill, Heart, Baby, Dumbbell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

const scanTypeIcons: Record<string, typeof ScanLine> = {
  image: ScanLine,
  text: ScanLine,
  combination: MessageCircle,
  expiry: Clock,
  medicine: Pill,
  pregnancy: Heart,
  kids: Baby,
  gym: Dumbbell,
}

const scanTypeLabels: Record<string, string> = {
  image: 'Scan',
  text: 'Scan',
  combination: 'Combo',
  expiry: 'Expiry',
  medicine: 'Medicine',
  pregnancy: 'Pregnancy',
  kids: 'Kids',
  gym: 'Gym',
}

type FilterType = 'all' | 'scan' | 'combo' | 'medicine' | 'saved'

export function HistoryScreen() {
  const { scanHistory, setScanHistory, setCurrentScreen, setSelectedScan, clearHistory } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const res = await fetch('/api/scan?limit=50')
        const data = await res.json()
        if (data.success && data.scans) {
          setScanHistory(data.scans)
        }
      } catch (err) {
        console.error('Failed to fetch scans:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchScans()
  }, [setScanHistory])

  const filteredHistory = scanHistory.filter(scan => {
    const matchesSearch = !searchQuery ||
      scan.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.ingredients.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))

    let matchesFilter = true
    if (activeFilter === 'scan') matchesFilter = scan.scanType === 'image' || scan.scanType === 'text'
    else if (activeFilter === 'combo') matchesFilter = scan.scanType === 'combination'
    else if (activeFilter === 'medicine') matchesFilter = scan.scanType === 'medicine'
    else if (activeFilter === 'saved') matchesFilter = scan.isSaved === true

    return matchesSearch && matchesFilter
  })

  const handleClearHistory = async () => {
    try {
      await fetch('/api/scan', { method: 'DELETE' })
      clearHistory()
      toast.success('History cleared')
    } catch {
      toast.error('Failed to clear history')
    }
  }

  const handleScanClick = (scan: ScanResult) => {
    setSelectedScan(scan)
    setCurrentScreen('results')
  }

  const handleDeleteScan = (scan: ScanResult, e: React.MouseEvent) => {
    e.stopPropagation()
    if (scan.id) {
      fetch(`/api/scan?id=${scan.id}`, { method: 'DELETE' }).catch(() => {})
    }
    setScanHistory(scanHistory.filter(s => s !== scan))
    toast.success('Scan deleted')
  }

  const handleToggleSave = (scan: ScanResult, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = scanHistory.map(s =>
      s === scan ? { ...s, isSaved: !s.isSaved } : s
    )
    setScanHistory(updated)
    toast.success(scan.isSaved ? 'Removed from saved' : 'Saved!')
  }

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'scan', label: 'Scan' },
    { key: 'combo', label: 'Combo' },
    { key: 'medicine', label: 'Medicine' },
    { key: 'saved', label: 'Saved' },
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 px-4 pt-4 pb-6"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Scan History</h1>
          <p className="text-sm text-muted-foreground">{scanHistory.length} scan{scanHistory.length !== 1 ? 's' : ''}</p>
        </div>
        {scanHistory.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-danger hover:text-danger hover:bg-danger/10"
            onClick={handleClearHistory}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </motion.div>

      {/* Search */}
      <motion.div variants={item}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products or ingredients..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Filter Pills */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-1">
        {filters.map(({ key, label }) => (
          <Button
            key={key}
            variant={activeFilter === key ? 'default' : 'outline'}
            size="sm"
            className={cn('shrink-0 text-xs', activeFilter === key ? 'bg-primary text-primary-foreground' : '')}
            onClick={() => setActiveFilter(key)}
          >
            {label}
          </Button>
        ))}
      </motion.div>

      {/* Scan List */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-muted" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded mt-2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredHistory.length === 0 ? (
        <motion.div variants={item} className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="p-4 rounded-2xl glass-card glow-primary">
            <Clock className="h-10 w-10 text-primary/40" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold">
              {searchQuery || activeFilter !== 'all' ? 'No matching scans' : 'No scans yet'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {searchQuery || activeFilter !== 'all' ? 'Try different search terms' : 'Start by scanning a food product'}
            </p>
          </div>
          {!searchQuery && activeFilter === 'all' && (
            <Button onClick={() => setCurrentScreen('scanner')} size="sm" className="btn-premium tap-feedback">
              <ScanLine className="h-4 w-4 mr-1.5" /> Scan your first product
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div variants={item} className="flex flex-col gap-3 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
          <AnimatePresence>
            {filteredHistory.map((scan, index) => {
              const ScanIcon = scanTypeIcons[scan.scanType] || ScanLine
              return (
                <motion.div
                  key={scan.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card
                    className="p-3 cursor-pointer hover:shadow-md transition-all active:scale-[0.98] border-border/50"
                    onClick={() => handleScanClick(scan)}
                  >
                    <div className="flex items-center gap-3">
                      <SafetyScoreCircle
                        score={scan.safetyScore}
                        riskLevel={scan.riskLevel}
                        size={52}
                        strokeWidth={4}
                        showLabel={false}
                        animate={false}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{scan.productName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[9px] px-1.5">
                            <ScanIcon className="h-2.5 w-2.5 mr-0.5" />
                            {scanTypeLabels[scan.scanType] || 'Scan'}
                          </Badge>
                          {scan.isSaved && (
                            <Bookmark className="h-3 w-3 text-primary fill-primary" />
                          )}
                          {scan.createdAt && (
                            <span className="text-[9px] text-muted-foreground">
                              {new Date(scan.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => handleToggleSave(scan, e)}
                        >
                          <Bookmark className={cn('h-3.5 w-3.5', scan.isSaved && 'fill-primary text-primary')} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-danger"
                          onClick={(e) => handleDeleteScan(scan, e)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  )
}
