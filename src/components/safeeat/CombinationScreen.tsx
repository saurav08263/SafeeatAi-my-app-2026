'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, POPULAR_COMBOS } from '@/lib/store'
import { Sparkles, ChevronLeft, Loader2, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import type { ScanResult } from '@/lib/store'
import { fetchWithRetry } from '@/lib/fetch-ai'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

export function CombinationScreen() {
  const { setCurrentScreen, navigateBack, setScanResult, addToHistory, profile } = useAppStore()
  const [food1, setFood1] = useState('')
  const [food2, setFood2] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!food1.trim() || !food2.trim()) {
      toast.error('Please enter both food items')
      return
    }

    setIsAnalyzing(true)
    try {
      const data = await fetchWithRetry<{ success: boolean; result: ScanResult; error?: string; isPending?: boolean }>('/api/analyze', {
        method: 'POST',
        body: JSON.stringify({
          text: `Food combination check: ${food1.trim()} + ${food2.trim()}`,
          scanType: 'combination',
          comboItems: [food1.trim(), food2.trim()],
          userAllergies: profile?.allergies || [],
          dietaryRestrictions: profile?.dietaryRestrictions || [],
        }),
      })

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed')
      }

      const result: ScanResult = {
        ...data.result,
        scanType: 'combination',
        comboItems: [food1.trim(), food2.trim()],
        createdAt: new Date().toISOString(),
      }

      setScanResult(result)
      addToHistory(result)

      fetch('/api/scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      }).catch(() => {})

      toast.success('Combination checked!')
      setCurrentScreen('results')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to check combination')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleComboSelect = (items: string[]) => {
    setFood1(items[0])
    setFood2(items[1])
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 px-4 pt-4 pb-6"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={navigateBack}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Food Combination</h1>
          <p className="text-sm text-muted-foreground">Check if two foods are safe together</p>
        </div>
      </motion.div>

      {/* Input Fields */}
      <motion.div variants={item}>
        <Card className="p-4 border-border/50 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Food Item 1</Label>
            <Input
              placeholder="e.g., Chicken"
              value={food1}
              onChange={(e) => setFood1(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">+</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium">Food Item 2</Label>
            <Input
              placeholder="e.g., Milk"
              value={food2}
              onChange={(e) => setFood2(e.target.value)}
              className="h-11"
            />
          </div>
        </Card>
      </motion.div>

      {/* Check Button */}
      <motion.div variants={item}>
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !food1.trim() || !food2.trim()}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-2xl text-base font-semibold shadow-lg shadow-primary/25"
          size="lg"
        >
          {isAnalyzing ? (
            <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Checking...</>
          ) : (
            <><Sparkles className="h-5 w-5 mr-2" /> Check Safety</>
          )}
        </Button>
      </motion.div>

      {/* Popular Combinations */}
      <motion.div variants={item}>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Popular Combinations
        </h3>
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto custom-scrollbar">
          {POPULAR_COMBOS.map((combo) => (
            <Card
              key={combo.name}
              className="p-3 border-border/50 hover:border-primary/20 transition-colors cursor-pointer active:scale-[0.98]"
              onClick={() => handleComboSelect(combo.items)}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-xs">+</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{combo.name}</p>
                </div>
                <Badge variant="outline" className="text-[9px] shrink-0">
                  {combo.items.join(' + ')}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
