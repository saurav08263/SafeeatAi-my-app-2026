'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import type { ScanResult } from '@/lib/store'
import { SafetyScoreCircle } from './SafetyScoreCircle'
import {
  ChevronLeft, AlertTriangle, Shield, Leaf, Info,
  ChevronDown, ChevronUp, Share2, Bookmark, MessageCircle,
  ScanLine, CircleCheck, CircleAlert, CircleX, CheckCircle2, XCircle, Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

function CombinationResult({ result }: { result: ScanResult }) {
  const comboResult = (result as Record<string, unknown>).combinationResult as string | undefined
  const status = comboResult?.toUpperCase()
  const isSafe = status === 'YES'
  const isWarning = status === 'WARNING'
  const isDanger = status === 'NO'

  return (
    <Card className={cn(
      'p-6 text-center border-2',
      isSafe && 'border-safe/40 bg-safe/5',
      isWarning && 'border-warn/40 bg-warn/5',
      isDanger && 'border-danger/40 bg-danger/5'
    )}>
      <div className="flex flex-col items-center gap-3">
        {isSafe && <CheckCircle2 className="h-16 w-16 text-safe" />}
        {isWarning && <AlertTriangle className="h-16 w-16 text-warn" />}
        {isDanger && <XCircle className="h-16 w-16 text-danger" />}
        {!isSafe && !isWarning && !isDanger && <AlertTriangle className="h-16 w-16 text-warn" />}

        <h2 className={cn(
          'text-2xl font-bold',
          isSafe && 'text-safe',
          isWarning && 'text-warn',
          isDanger && 'text-danger',
          !isSafe && !isWarning && !isDanger && 'text-warn'
        )}>
          {isSafe ? 'SAFE' : isDanger ? 'NOT SAFE' : isWarning ? 'CAUTION' : 'CHECK'}
        </h2>

        {result.comboItems && (
          <p className="text-sm text-muted-foreground">
            {result.comboItems.join(' + ')}
          </p>
        )}
      </div>
    </Card>
  )
}

function ExpiryResult({ result }: { result: ScanResult }) {
  const expiryStatus = (result as Record<string, unknown>).expiryStatus as string | undefined
  const isExpired = expiryStatus === 'expired'
  const isNearExpiry = expiryStatus === 'near_expiry'
  const isSafe = expiryStatus === 'safe'

  return (
    <Card className={cn(
      'p-6 text-center border-2',
      isSafe && 'border-safe/40 bg-safe/5',
      isNearExpiry && 'border-warn/40 bg-warn/5',
      isExpired && 'border-danger/40 bg-danger/5'
    )}>
      <div className="flex flex-col items-center gap-3">
        {isExpired && <XCircle className="h-16 w-16 text-danger" />}
        {isNearExpiry && <Clock className="h-16 w-16 text-warn" />}
        {isSafe && <CheckCircle2 className="h-16 w-16 text-safe" />}
        {!isExpired && !isNearExpiry && !isSafe && <Clock className="h-16 w-16 text-warn" />}

        <h2 className={cn(
          'text-2xl font-bold',
          isSafe && 'text-safe',
          isNearExpiry && 'text-warn',
          isExpired && 'text-danger'
        )}>
          {isExpired ? 'EXPIRED' : isNearExpiry ? 'NEAR EXPIRY' : isSafe ? 'SAFE' : 'CHECK DATE'}
        </h2>
      </div>
    </Card>
  )
}

export function ResultsScreen() {
  const { scanResult, selectedScan, setCurrentScreen, navigateBack, addToHistory } = useAppStore()
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    ingredients: true,
    warnings: true,
    allergens: true,
    nutrition: false,
  })

  const result = scanResult || selectedScan

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <Shield className="h-12 w-12 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">No scan results yet</p>
        <Button onClick={() => setCurrentScreen('scanner')} variant="outline">
          Scan a food product
        </Button>
      </div>
    )
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const safetyColorMap = {
    safe: { icon: CircleCheck, color: 'text-safe', bg: 'bg-safe/10', border: 'border-safe/20' },
    caution: { icon: CircleAlert, color: 'text-warn', bg: 'bg-warn/10', border: 'border-warn/20' },
    avoid: { icon: CircleX, color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20' },
  }

  const handleSaveReport = () => {
    const savedResult = { ...result, isSaved: true }
    addToHistory(savedResult)
    toast.success('Report saved!')
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
          <h1 className="text-lg font-bold">Analysis Results</h1>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.success('Results shared!')}>
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSaveReport}>
          <Bookmark className={cn('h-4 w-4', result.isSaved && 'fill-primary text-primary')} />
        </Button>
      </motion.div>

      {/* Combination Result */}
      {result.scanType === 'combination' && (
        <motion.div variants={item}>
          <CombinationResult result={result} />
        </motion.div>
      )}

      {/* Expiry Result */}
      {result.scanType === 'expiry' && (
        <motion.div variants={item}>
          <ExpiryResult result={result} />
        </motion.div>
      )}

      {/* Safety Score Hero */}
      <motion.div variants={item}>
        <Card className="p-6 border-border/50">
          <div className="flex flex-col items-center gap-4">
            <SafetyScoreCircle
              score={result.safetyScore}
              riskLevel={result.riskLevel}
              size={140}
              strokeWidth={8}
            />
            <div className="text-center">
              <h2 className="text-lg font-bold">{result.productName}</h2>
              <Badge
                variant="outline"
                className={`mt-2 ${
                  result.riskLevel === 'low' ? 'border-safe/30 text-safe' :
                  result.riskLevel === 'medium' ? 'border-warn/30 text-warn' :
                  result.riskLevel === 'high' ? 'border-orange-500/30 text-orange-500' :
                  'border-danger/30 text-danger'
                }`}
              >
                {result.riskLevel === 'low' ? '✓ Generally Safe' :
                 result.riskLevel === 'medium' ? '⚠ Consume with Caution' :
                 result.riskLevel === 'high' ? '⚠ Health Risk Detected' :
                 '✕ Dangerous - Avoid'}
              </Badge>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* AI Summary */}
      {result.aiAnalysis && (
        <motion.div variants={item}>
          <Card className="p-4 bg-primary/5 border-primary/15">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-primary mb-1">AI Safety Summary</p>
                <p className="text-xs text-foreground/80 leading-relaxed">{result.aiAnalysis}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Allergen Alerts */}
      {result.allergenAlerts.length > 0 && (
        <motion.div variants={item}>
          <Card className="overflow-hidden border-danger/20">
            <button
              className="w-full flex items-center justify-between p-4 bg-danger/5"
              onClick={() => toggleSection('allergens')}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-danger" />
                <span className="text-sm font-semibold text-danger">
                  Allergen Alerts ({result.allergenAlerts.length})
                </span>
              </div>
              {expandedSections.allergens ? (
                <ChevronUp className="h-4 w-4 text-danger" />
              ) : (
                <ChevronDown className="h-4 w-4 text-danger" />
              )}
            </button>
            {expandedSections.allergens && (
              <div className="p-4 space-y-2">
                {result.allergenAlerts.map((alert, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-danger/5">
                    <Badge
                      variant="outline"
                      className={`text-[10px] shrink-0 ${
                        alert.severity === 'dangerous' ? 'border-danger/30 text-danger' :
                        alert.severity === 'high' ? 'border-orange-500/30 text-orange-500' :
                        alert.severity === 'medium' ? 'border-warn/30 text-warn' :
                        'border-safe/30 text-safe'
                      }`}
                    >
                      {alert.severity}
                    </Badge>
                    <div>
                      <p className="text-xs font-semibold">{alert.name}</p>
                      <p className="text-[10px] text-muted-foreground">{alert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <motion.div variants={item}>
          <Card className="overflow-hidden border-warn/20">
            <button
              className="w-full flex items-center justify-between p-4 bg-warn/5"
              onClick={() => toggleSection('warnings')}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warn" />
                <span className="text-sm font-semibold text-warn">
                  Warnings ({result.warnings.length})
                </span>
              </div>
              {expandedSections.warnings ? (
                <ChevronUp className="h-4 w-4 text-warn" />
              ) : (
                <ChevronDown className="h-4 w-4 text-warn" />
              )}
            </button>
            {expandedSections.warnings && (
              <div className="p-4 space-y-1.5">
                {result.warnings.map((warning, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-warn shrink-0 mt-1.5" />
                    <p className="text-xs text-foreground/80">{warning}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Ingredients Breakdown */}
      
      {result.ingredients.length > 0 && (
        <motion.div variants={item}>
          <Card className="overflow-hidden border-border/50">
            <button
              className="w-full flex items-center justify-between p-4"
              onClick={() => toggleSection('ingredients')}
            >
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">
                  Ingredients ({result.ingredients.length})
                </span>
              </div>
              {expandedSections.ingredients ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {expandedSections.ingredients && (
              <div className="px-4 pb-4 space-y-2">
                {result.ingredients.map((ingredient, i) => {
                 const style = safetyColorMap[ingredient.safety] || safetyColorMap.safe
                  const Icon = style.icon
                  return (
                    <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg ${style.bg} border ${style.border}`}>
                      <Icon className={`h-4 w-4 ${style.color} shrink-0 mt-0.5`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold">{ingredient.name}</p>
                          <Badge variant="outline" className="text-[9px] h-4">
                            {ingredient.category}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{ingredient.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Nutrition Summary */}
      {result.nutritionSummary && Object.keys(result.nutritionSummary).length > 0 && (
        <motion.div variants={item}>
          <Card className="overflow-hidden border-border/50">
            <button
              className="w-full flex items-center justify-between p-4"
              onClick={() => toggleSection('nutrition')}
            >
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Nutrition Summary</span>
              </div>
              {expandedSections.nutrition ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {expandedSections.nutrition && (
              <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                {Object.entries(result.nutritionSummary).map(([key, value]) => (
                  <div key={key} className="p-2.5 rounded-lg bg-muted/50">
                    <p className="text-[10px] text-muted-foreground capitalize">{key}</p>
                    <p className="text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div variants={item} className="flex flex-col gap-3">
        <Button
          onClick={() => setCurrentScreen('scanner')}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 rounded-2xl font-semibold shadow-lg shadow-primary/25"
          size="lg"
        >
          <ScanLine className="h-4 w-4 mr-2" />
          Scan Again
        </Button>
        <Button
          onClick={() => setCurrentScreen('chat')}
          variant="outline"
          className="w-full py-5 rounded-2xl font-semibold"
          size="lg"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask Another Question
        </Button>
      </motion.div>
    </motion.div>
  )
}
