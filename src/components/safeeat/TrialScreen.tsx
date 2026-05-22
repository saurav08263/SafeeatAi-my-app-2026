'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Check, Zap, Shield, Crown, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

const features = [
  { icon: ScanLine, text: 'Unlimited scans' },
  { icon: Shield, text: 'Food combination checker' },
  { icon: Heart, text: 'Medicine + Food check' },
  { icon: Baby, text: 'Pregnancy checker' },
  { icon: Shield, text: 'Kids safe food' },
  { icon: Zap, text: 'No ads' },
  { icon: Crown, text: 'Priority AI' },
]

import { ScanLine, Heart, Baby } from 'lucide-react'

export function TrialScreen() {
  const { setCurrentScreen, setTrialState } = useAppStore()

  const handleStartTrial = () => {
    setTrialState(2, true)
    setCurrentScreen('signup')
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 px-4 pt-6 pb-6"
    >
      {/* Header */}
      <motion.div variants={item} className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Limited Time Offer</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Try All Premium Features<br />
          <span className="text-primary">Free for 2 Days</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          No credit card required. Cancel anytime.
        </p>
      </motion.div>

      {/* Countdown Card */}
      <motion.div variants={item}>
        <Card className="p-6 bg-gradient-to-br from-primary/5 via-card to-safe/5 border-primary/20">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary tabular-nums">2</div>
              <div className="text-xs font-semibold text-primary/70 mt-1">DAYS</div>
            </div>
            <div className="text-3xl text-primary/30 font-light">:</div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary tabular-nums">00</div>
              <div className="text-xs font-semibold text-primary/70 mt-1">HOURS</div>
            </div>
            <div className="text-3xl text-primary/30 font-light">:</div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary tabular-nums">00</div>
              <div className="text-xs font-semibold text-primary/70 mt-1">MINS</div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Feature List */}
      <motion.div variants={item}>
        <Card className="p-4 border-border/50">
          <div className="space-y-3">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-safe/10 flex items-center justify-center shrink-0">
                  <Check className="h-4 w-4 text-safe" />
                </div>
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* CTA */}
      <motion.div variants={item}>
        <Button
          onClick={handleStartTrial}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-2xl text-base font-bold shadow-lg shadow-primary/25"
          size="lg"
        >
          <Zap className="h-5 w-5 mr-2" />
          Start Free Trial
        </Button>
      </motion.div>

      {/* Skip */}
      <motion.div variants={item} className="text-center">
        <button
          onClick={() => setCurrentScreen('signup')}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Maybe later
        </button>
      </motion.div>
    </motion.div>
  )
}
