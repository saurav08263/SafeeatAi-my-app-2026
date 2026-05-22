'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Sparkles, ChevronLeft, Loader2, Camera, Upload, X, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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

export function ExpiryScreen() {
  const { setCurrentScreen, navigateBack, setScanResult, addToHistory, profile } = useAppStore()
  const [inputMode, setInputMode] = useState<'image' | 'manual'>('manual')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [expiryDate, setExpiryDate] = useState('')
  const [productName, setProductName] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleCheckExpiry = async () => {
    if (inputMode === 'manual' && !expiryDate.trim()) {
      toast.error('Please enter an expiry date')
      return
    }
    if (inputMode === 'image' && !imagePreview) {
      toast.error('Please upload an image of the food packaging')
      return
    }

    setIsAnalyzing(true)
    try {
      const data = await fetchWithRetry<{ success: boolean; result: any; error?: string; isPending?: boolean }>('/api/analyze', {
        method: 'POST',
        body: JSON.stringify({
          imageData: imagePreview || undefined,
          text: inputMode === 'manual' ? `Check expiry for ${productName || 'food product'} with expiry date: ${expiryDate}` : undefined,
          scanType: 'expiry',
          userAllergies: profile?.allergies || [],
          dietaryRestrictions: profile?.dietaryRestrictions || [],
        }),
      })
      if (!data.success) throw new Error(data.error || 'Analysis failed')

      const result: ScanResult = {
        ...data.result,
        productName: data.result.productName || productName || 'Food Product',
        scanType: 'expiry',
        createdAt: new Date().toISOString(),
      }

      setScanResult(result)
      addToHistory(result)

      fetch('/api/scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      }).catch(() => {})

      toast.success('Expiry checked!')
      setCurrentScreen('results')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to check expiry')
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
        <div>
          <h1 className="text-xl font-bold tracking-tight">Expiry Checker</h1>
          <p className="text-sm text-muted-foreground">Check if food is safe to consume</p>
        </div>
      </motion.div>

      {/* Input Mode Tabs */}
      <motion.div variants={item} className="flex gap-2">
        <Button
          variant={inputMode === 'manual' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setInputMode('manual')}
          className={inputMode === 'manual' ? 'bg-primary text-primary-foreground' : ''}
        >
          <Clock className="h-4 w-4 mr-1.5" />
          Enter Date
        </Button>
        <Button
          variant={inputMode === 'image' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setInputMode('image')}
          className={inputMode === 'image' ? 'bg-primary text-primary-foreground' : ''}
        >
          <Upload className="h-4 w-4 mr-1.5" />
          Upload Image
        </Button>
      </motion.div>

      {/* Manual Input */}
      {inputMode === 'manual' && (
        <motion.div variants={item}>
          <Card className="p-4 border-border/50 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium">Product Name (optional)</Label>
              <Input
                placeholder="e.g., Amul Milk"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium">Expiry Date</Label>
              <Input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="h-11"
              />
            </div>
          </Card>
        </motion.div>
      )}

      {/* Image Upload */}
      {inputMode === 'image' && (
        <motion.div variants={item}>
          {imagePreview ? (
            <Card className="relative overflow-hidden border-primary/30">
              <img src={imagePreview} alt="Food packaging" className="w-full h-48 object-cover" />
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white"
                onClick={() => setImagePreview(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ) : (
            <Card
              className="border-dashed border-2 border-primary/30 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="p-4 rounded-2xl bg-primary/10">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm font-medium">Upload food packaging image</p>
                <p className="text-xs text-muted-foreground">Show the expiry date clearly</p>
              </div>
            </Card>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="hidden"
          />
        </motion.div>
      )}

      {/* Check Button */}
      <motion.div variants={item}>
        <Button
          onClick={handleCheckExpiry}
          disabled={isAnalyzing || (inputMode === 'manual' ? !expiryDate.trim() : !imagePreview)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-2xl text-base font-semibold shadow-lg shadow-primary/25"
          size="lg"
        >
          {isAnalyzing ? (
            <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Checking...</>
          ) : (
            <><Sparkles className="h-5 w-5 mr-2" /> Check Expiry</>
          )}
        </Button>
      </motion.div>
    </motion.div>
  )
}
