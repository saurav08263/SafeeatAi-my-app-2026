'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Sparkles, ChevronLeft, Loader2, Lock, Heart } from 'lucide-react'
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

export function PregnancyScreen() {
  const { setCurrentScreen, navigateBack, setScanResult, addToHistory, profile, setShowPaywall } = useAppStore()
  const [food, setFood] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const isPremium = profile?.isPremium

  const handleAnalyze = async () => {
    if (!food.trim()) {
      toast.error('Please enter a food item')
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
          text: `Pregnancy safety check for food: ${food.trim()}`,
          scanType: 'pregnancy',
          userAllergies: profile?.allergies || [],
          dietaryRestrictions: profile?.dietaryRestrictions || [],
        }),
      })
      if (!data.success) throw new Error(data.error || 'Analysis failed')

      const result: ScanResult = {
        ...data.result,
        scanType: 'pregnancy',
        createdAt: new Date().toISOString(),
      }

      setScanResult(result)
      addToHistory(result)

      fetch('/api/scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      }).catch(() => {})

      toast.success('Pregnancy safety checked!')
      setCurrentScreen('results')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to check safety')
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
          <h1 className="text-xl font-bold tracking-tight">Pregnancy Check</h1>
          <p className="text-sm text-muted-foreground">Is this food safe during pregnancy?</p>
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
            <Label className="text-xs font-medium">Food Item</Label>
            <Input
              placeholder="e.g., Papaya, Pineapple, Raw Fish"
              value={food}
              onChange={(e) => setFood(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5">
            <Heart className="h-4 w-4 text-primary shrink-0" />
            <p className="text-[10px] text-muted-foreground">We check against common pregnancy food safety guidelines</p>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !food.trim()}
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
    </motion.div>
  )
}
