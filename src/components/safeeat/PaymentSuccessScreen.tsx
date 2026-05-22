'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { CheckCircle2, Sparkles, Shield, Crown, Zap, ScanLine, Smartphone } from 'lucide-react'
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

const unlockedFeatures = [
  { icon: ScanLine, text: 'Unlimited Scans' },
  { icon: Shield, text: 'Food Combination Checker' },
  { icon: Zap, text: 'Medicine + Food Check' },
  { icon: Crown, text: 'Priority AI Analysis' },
  { icon: Sparkles, text: 'All Premium Features' },
]

export function PaymentSuccessScreen() {
  const { setCurrentScreen, subscriptionPlan } = useAppStore()

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-6 gap-6"
    >
      {/* Success Animation */}
      <motion.div variants={item} className="relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
          className="h-24 w-24 rounded-full bg-safe/10 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.5 }}
            className="h-16 w-16 rounded-full bg-safe/20 flex items-center justify-center"
          >
            <CheckCircle2 className="h-10 w-10 text-safe" />
          </motion.div>
        </motion.div>

        {/* Glow */}
        <div className="absolute inset-0 rounded-full bg-safe/10 blur-xl animate-pulse" />
      </motion.div>

      {/* Welcome Text */}
      <motion.div variants={item} className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome to Premium!</h1>
        <p className="text-sm text-muted-foreground mt-2">
          You now have access to all premium features
        </p>
      </motion.div>

      {/* Google Play Billing Info */}
      <motion.div variants={item} className="w-full">
        <Card className="p-4 border-green-500/20 bg-green-500/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold">Purchased via Google Play</p>
              <p className="text-[10px] text-muted-foreground">
                {subscriptionPlan === 'yearly'
                  ? 'Yearly plan · No ads · Renews automatically'
                  : subscriptionPlan === 'monthly'
                    ? 'Monthly plan · Minimal ads · Renews automatically'
                    : 'Premium plan · Renews automatically'}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Manage in Play Store → Subscriptions
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Unlocked Features */}
      <motion.div variants={item} className="w-full">
        <Card className="p-4 border-safe/20 bg-safe/5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Crown className="h-4 w-4 text-safe" />
            Unlocked Features
          </h3>
          <div className="space-y-2">
            {unlockedFeatures.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg bg-safe/10 flex items-center justify-center shrink-0">
                  <Icon className="h-3.5 w-3.5 text-safe" />
                </div>
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* CTA */}
      <motion.div variants={item} className="w-full">
        <Button
          onClick={() => setCurrentScreen('home')}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-2xl text-base font-bold shadow-lg shadow-primary/25"
          size="lg"
        >
          <ScanLine className="h-5 w-5 mr-2" />
          Start Scanning
        </Button>
      </motion.div>
    </motion.div>
  )
}
