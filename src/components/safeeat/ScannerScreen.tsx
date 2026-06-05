'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import {
  Camera, Upload, Type, X, Sparkles, Info, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
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

type InputMode = 'upload' | 'camera' | 'text'

export function ScannerScreen() {
  const { setCurrentScreen, setScanResult, setIsScanning, profile, addToHistory, manualText, setManualText } = useAppStore()
  const [inputMode, setInputMode] = useState<InputMode>('upload')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be under 10MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleAnalyze = async () => {
    if (inputMode === 'text' && !manualText.trim()) {
      toast.error('Please enter ingredient list or product info')
      return
    }
    if ((inputMode === 'camera' || inputMode === 'upload') && !imagePreview) {
      toast.error('Please capture or upload an image first')
      return
    }

    setIsAnalyzing(true)
    setIsScanning(true)

    try {
      const data = await fetchWithRetry<{ success: boolean; result: ScanResult; error?: string; isPending?: boolean }>('/api/analyze', {
        method: 'POST',
        body: JSON.stringify({
          imageData: imagePreview || undefined,
          text: inputMode === 'text' ? manualText : undefined,
          scanType: inputMode === 'text' ? 'text' : 'image',
          userAllergies: profile?.allergies || [],
          dietaryRestrictions: profile?.dietaryRestrictions || [],
        }),
      })

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed')
      }

      const result: ScanResult = {
        ...data.result,
        imageData: imagePreview || undefined,
        scanType: inputMode === 'text' ? 'text' : 'image',
        createdAt: new Date().toISOString(),
      }

      setScanResult(result)
      addToHistory(result)

      // Save to database in background
      fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      }).catch(() => {})

      toast.success('Analysis complete!')
      setCurrentScreen('results')
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to analyze. Please try again.')
    } finally {
      setIsAnalyzing(false)
      setIsScanning(false)
    }
  }

  const clearImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 px-4 pt-4 pb-6"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-xl font-bold tracking-tight">Scan Food</h1>
        <p className="text-sm text-muted-foreground">Upload a food label or type ingredients</p>
      </motion.div>

      {/* Input Mode Tabs */}
      <motion.div variants={item} className="flex gap-2">
        {([
          { mode: 'upload' as InputMode, icon: Upload, label: 'Upload' },
          { mode: 'camera' as InputMode, icon: Camera, label: 'Camera' },
          { mode: 'text' as InputMode, icon: Type, label: 'Type' },
        ]).map(({ mode, icon: Icon, label }) => (
          <Button
            key={mode}
            variant={inputMode === mode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setInputMode(mode)}
            className={inputMode === mode ? 'bg-primary text-primary-foreground' : ''}
          >
            <Icon className="h-4 w-4 mr-1.5" />
            {label}
          </Button>
        ))}
      </motion.div>

      {/* Upload/Camera Area */}
      {(inputMode === 'upload' || inputMode === 'camera') && (
        <motion.div variants={item}>
          {imagePreview ? (
            <Card className="relative overflow-hidden border-primary/30">
              <img
                src={imagePreview}
                alt="Food label preview"
                className="w-full h-56 object-cover"
              />
              <div className="absolute top-2 right-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white"
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-2 left-2">
                <Badge className="bg-primary/90 text-primary-foreground text-[10px]">
                  <Sparkles className="h-3 w-3 mr-1" /> Ready to analyze
                </Badge>
              </div>
            </Card>
          ) : (
            <Card
              className="border-dashed border-2 border-primary/30 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="p-4 rounded-2xl bg-primary/10">
                  {inputMode === 'camera' ? (
                    <Camera className="h-8 w-8 text-primary" />
                  ) : (
                    <Upload className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">
                    {inputMode === 'camera' ? 'Take a photo' : 'Upload food label'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    JPG, PNG, WebP &bull; Max 10MB
                  </p>
                </div>
              </div>
            </Card>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture={inputMode === 'camera' ? 'environment' : undefined}
            onChange={handleImageUpload}
            className="hidden"
          />
        </motion.div>
      )}

      {/* Text Input Area */}
      {inputMode === 'text' && (
        <motion.div variants={item}>
          <Card className="p-4 border-primary/20">
            <Textarea
              placeholder="Paste ingredient list or product info here...&#10;&#10;Example: Ingredients: Wheat flour, Sugar, Palm oil, Sodium bicarbonate, Artificial flavor (BHA, BHT), Red 40, Soy lecithin..."
              className="min-h-[180px] resize-none border-0 focus-visible:ring-0 p-0 text-sm"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
              <span className="text-[10px] text-muted-foreground">
                {manualText.length} characters
              </span>
              {manualText && (
                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setManualText('')}>
                  Clear
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Analyze Button */}
      <motion.div variants={item}>
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || (inputMode === 'text' ? !manualText.trim() : !imagePreview)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-2xl text-base font-semibold shadow-lg shadow-primary/25"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Analyze Food Safety
            </>
          )}
        </Button>
      </motion.div>

      {/* Tips */}
      <motion.div variants={item}>
        <div className="glass-card p-4">
          <div className="flex items-start gap-2">
            <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
              <Info className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs font-semibold">Tips for best results</p>
              <ul className="text-[10px] text-muted-foreground mt-1 space-y-0.5">
                <li>&bull; Capture the full ingredient list clearly</li>
                <li>&bull; Include nutrition facts if visible</li>
                <li>&bull; Ensure good lighting and minimal glare</li>
                <li>&bull; Set your allergies in Profile for personalized alerts</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analyzing Overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4"
          >
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">Analyzing your food...</p>
              <p className="text-sm text-muted-foreground mt-1">AI is scanning for harmful ingredients</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
