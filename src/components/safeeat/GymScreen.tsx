'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Sparkles, ChevronLeft, Loader2, Lock, Dumbbell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { fetchWithRetry } from '@/lib/fetch-ai'
import type { ScanResult } from '@/lib/store'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

export function GymScreen() {
  const { setCurrentScreen, navigateBack, setScanResult, addToHistory, profile, setShowPaywall } = useAppStore()
  const [food1, setFood1] = useState('')
  const [food2, setFood2] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const isPremium = profile?.isPremium

  const handleAnalyze = async () => {
    if (!food1.trim() || !food2.trim()) {
      toast.error('Please enter both food items')
      return
    }
    if (!isPremium) {
      setShowPaywall(true)
      setCurrentScreen('paywall')
      return
    }

    setIsAnalyzing(true)
    try {
      const data = await fetchWithRetry<{ success: boolean; result: any; error?: string; isPending?: boolean }>('/api/analyze', {
        method: 'POST',
        body: JSON.stringify({
          text: `Gym diet compatibility check: ${food1.trim()} + ${food2.trim()}`,
          scanType: 'gym',
          comboItems: [food1.trim(), food2.trim()],
          userAllergies: profile?.allergies || [],
          dietaryRestrictions: profile?.dietaryRestrictions || [],
        }),
      })
      if (!data.success) throw new Error(data.error || 'Analysis failed')

      const result: ScanResult = {
        ...data.result,
        scanType: 'gym',
        comboItems: [food1.trim(), food2.trim()],
        createdAt: new Date().toISOString(),
      }

      setScanResult(result)
      addToHistory(result)

      fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      }).catch(() => {})

      toast.success('Gym diet checked!')
      setCurrentScreen('results')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to check diet')
    } finally {
      setIsAnalyzing(false)
    }
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
        <div className="flex-1">
          <h1 className="text-xl font-bold tracking-tight">Gym Diet Check</h1>
          <p className="text-sm text-muted-foreground">Check food combos for gym diet</p>
        </div>
        {!isPremium && <Lock className="h-4 w-4 text-warn" />}
      </motion.div>

      {!isPremium && (
        <motion.div variants={item}>
          <Card className="p-4 bg-warn/5 border-warn/20">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-warn" />
              <p className="text-xs font-medium text-warn">Premium feature - Subscribe to unlock</p>
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div variants={item}>
        <Card className="p-4 border-border/50 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Food 1</Label>
            <Input
              placeholder="e.g., Chicken breast"
              value={food1}
              onChange={(e) => setFood1(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Dumbbell className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium">Food 2</Label>
            <Input
              placeholder="e.g., Protein shake"
              value={food2}
              onChange={(e) => setFood2(e.target.value)}
              className="h-11"
            />
          </div>
        </Card>
      </motion.div>

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
            <><Sparkles className="h-5 w-5 mr-2" /> Check for Gym</>
          )}
        </Button>
      </motion.div>
    </motion.div>
  )
}
