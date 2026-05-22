'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Crown, Check, Shield, X, Zap, EyeOff, Smartphone, ChevronRight, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

const lockedFeatures = [
  'Unlimited Scans',
  'Medicine + Food Check',
  'Pregnancy Safe Food',
  'Kids Safe Food',
  'Gym Diet Checker',
  'Priority AI Analysis',
]

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '₹299',
    period: '/month',
    badge: 'POPULAR',
    badgeColor: 'bg-primary text-primary-foreground',
    borderColor: 'border-primary/40 ring-1 ring-primary/20',
    features: ['Unlimited scans', 'All premium features', 'Minimal ads included'],
    hasAds: true,
    btnClass: 'bg-primary hover:bg-primary/90 text-primary-foreground',
    productId: 'com.safeeat.premium.monthly',
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '₹1,999',
    period: '/year',
    badge: 'SAVE 44%',
    badgeColor: 'bg-safe text-safe-foreground',
    borderColor: 'border-safe/40 ring-1 ring-safe/20',
    features: ['Everything in Monthly', '🚫 Zero ads — ever', 'Priority 24/7 support', 'Export reports (PDF)'],
    hasAds: false,
    btnClass: 'bg-safe hover:bg-safe/90 text-safe-foreground',
    productId: 'com.safeeat.premium.yearly',
  },
]

// ─── Google Play Purchase Dialog (Bottom Sheet) ───────────────────────────
function GooglePlayPurchaseDialog({
  plan,
  onClose,
  onPurchase,
  purchasing,
}: {
  plan: typeof plans[number]
  onClose: () => void
  onPurchase: () => void
  purchasing: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-lg rounded-t-3xl bg-background border-t border-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-muted-foreground/20" />
        </div>

        <div className="px-6 pb-8 pt-2">
          {/* Google Play Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Google Play Billing</h3>
              <p className="text-xs text-muted-foreground">Secure in-app purchase</p>
            </div>
          </div>

          {/* Purchase details */}
          <div className="rounded-2xl bg-muted/40 border border-border/50 p-4 mb-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Crown className={cn('h-5 w-5', plan.id === 'yearly' ? 'text-safe' : 'text-primary')} />
                <span className="font-semibold">SafeEat AI Premium</span>
              </div>
              <Badge variant="outline" className="text-[10px]">{plan.name}</Badge>
            </div>
            <div className="space-y-1.5">
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check className={cn('h-3 w-3', plan.id === 'yearly' ? 'text-safe' : 'text-primary')} />
                  <span className="text-xs">{f}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-bold">{plan.price}</span>
                <span className="text-xs text-muted-foreground">{plan.period}</span>
              </div>
            </div>
          </div>

          {/* Security info */}
          <div className="flex items-center gap-3 mb-5 px-1">
            <Shield className="h-4 w-4 text-green-600 shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Payment handled securely by Google Play. Cancel anytime from Play Store subscriptions.
            </p>
          </div>

          {/* Buy button */}
          <Button
            className={cn('w-full py-5 rounded-2xl font-bold text-base shadow-lg', plan.btnClass)}
            onClick={onPurchase}
            disabled={purchasing}
          >
            {purchasing ? (
              <><Zap className="h-5 w-5 mr-2 animate-pulse" /> Processing via Google Play...</>
            ) : (
              <><Smartphone className="h-5 w-5 mr-2" /> Buy — {plan.price}{plan.period}</>
            )}
          </Button>

          {/* Cancel */}
          <button
            onClick={onClose}
            className="w-full mt-3 text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function PaywallScreen() {
  const { setCurrentScreen, navigateBack, profile, setProfile, setSubscriptionPlan, setShowAds } = useAppStore()
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[number] | null>(null)
  const [purchasing, setPurchasing] = useState(false)

  const handleSubscribe = async () => {
    if (!selectedPlan) return

    setPurchasing(true)
    try {
      // Simulate Google Play Billing purchase flow
      await new Promise(resolve => setTimeout(resolve, 2500))

      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan.id,
          provider: 'google_play',
          productId: selectedPlan.productId,
          amount: selectedPlan.id === 'monthly' ? 299 : 1999,
          currency: 'INR',
        }),
      })

      const data = await res.json()
      if (data.success) {
        setSubscriptionPlan(selectedPlan.id)
        setShowAds(selectedPlan.hasAds)
        setProfile({
          ...profile!,
          isPremium: true,
        })
        setSelectedPlan(null)
        setCurrentScreen('payment-success')
      }
    } catch {
      setSelectedPlan(null)
    } finally {
      setPurchasing(false)
    }
  }

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4 px-4 pt-4 pb-6"
      >
        {/* Close Button */}
        <motion.div variants={item} className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={navigateBack}>
            <X className="h-5 w-5" />
          </Button>
          <Badge variant="outline" className="text-[10px]">
            <Crown className="h-3 w-3 mr-1" /> Subscription Required
          </Badge>
        </motion.div>

        {/* Header */}
        <motion.div variants={item} className="text-center">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-primary/10 items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Your 2-Day Free Trial Has Ended</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Subscribe now to continue protecting your health
          </p>
        </motion.div>

        {/* Locked Features */}
        <motion.div variants={item}>
          <Card className="p-4 border-border/50">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-warn" />
              Locked Features
            </h3>
            <div className="space-y-2">
              {lockedFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Minus className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Emotional selling line */}
        <motion.div variants={item}>
          <Card className="p-4 bg-gradient-to-r from-danger/5 via-danger/10 to-warn/5 border-danger/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-danger/10">
                <Shield className="h-5 w-5 text-danger" />
              </div>
              <p className="text-sm font-bold text-danger">
                One Hospital Bill Costs More Than One Year Premium
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Plan Cards */}
        {plans.map((plan) => (
          <motion.div key={plan.id} variants={item}>
            <Card className={cn('relative overflow-hidden p-4', plan.borderColor)}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{plan.name}</h3>
                    <Badge className={cn('text-[10px]', plan.badgeColor)}>{plan.badge}</Badge>
                  </div>
                  <div className="flex items-baseline gap-0.5 mt-1">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="text-xs text-muted-foreground">{plan.period}</span>
                  </div>
                  {plan.id === 'yearly' && (
                    <p className="text-[10px] text-safe font-semibold mt-0.5">≈ ₹167/mo</p>
                  )}
                </div>
                <div className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-full',
                  plan.hasAds ? 'bg-warn/10' : 'bg-safe/10'
                )}>
                  {plan.hasAds ? (
                    <><EyeOff className="h-3 w-3 text-warn" /><span className="text-[10px] font-medium text-warn">Some ads</span></>
                  ) : (
                    <><Shield className="h-3 w-3 text-safe" /><span className="text-[10px] font-medium text-safe">No ads</span></>
                  )}
                </div>
              </div>
              <div className="space-y-1.5 mb-3">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <Check className={cn('h-3 w-3', plan.id === 'yearly' ? 'text-safe' : 'text-primary')} />
                    <span className="text-xs">{f}</span>
                  </div>
                ))}
              </div>
              <Button
                className={cn('w-full py-4 rounded-xl font-semibold', plan.btnClass)}
                onClick={() => setSelectedPlan(plan)}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Subscribe — {plan.price}{plan.period}
              </Button>
            </Card>
          </motion.div>
        ))}

        {/* Google Play Billing badge */}
        <motion.div variants={item}>
          <Card className="p-4 bg-muted/30 border-border/30">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold">Secured by Google Play Billing</p>
                <p className="text-[10px] text-muted-foreground">Manage subscriptions via Play Store anytime</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Close */}
        <motion.div variants={item} className="text-center pt-2">
          <button
            onClick={navigateBack}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Maybe later
          </button>
        </motion.div>
      </motion.div>

      {/* Google Play Purchase Dialog */}
      <AnimatePresence>
        {selectedPlan && (
          <GooglePlayPurchaseDialog
            plan={selectedPlan}
            onClose={() => setSelectedPlan(null)}
            onPurchase={handleSubscribe}
            purchasing={purchasing}
          />
        )}
      </AnimatePresence>
    </>
  )
}
