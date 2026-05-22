'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import {
  Crown, Check, Zap, Shield, ScanLine, Star,
  Sparkles, ChevronLeft, X, Lock, EyeOff, Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

const plans = [
  {
    id: 'free',
    name: 'Free Trial',
    price: 0,
    currency: '',
    period: '',
    subtitle: '2 Days Free',
    features: [
      'All premium features for 2 days',
      'Unlimited scans during trial',
      'Food combination checker',
      'Basic AI analysis',
    ],
    limitations: [
      'Ends after 2 days',
      'Must subscribe to continue',
    ],
    cta: 'Start Free Trial',
    popular: false,
    color: 'muted',
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: 299,
    currency: '₹',
    period: '/month',
    subtitle: 'Some ads included',
    productId: 'com.safeeat.premium.monthly',
    features: [
      'Unlimited scans',
      'Food combination checker',
      'Medicine + Food check',
      'Pregnancy & Kids safe',
      'Gym diet checker',
      'Priority AI analysis',
      'Chat AI assistant',
    ],
    limitations: [
      'Contains some ads',
    ],
    cta: 'Subscribe Monthly',
    popular: true,
    color: 'primary',
    badge: 'POPULAR',
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 1999,
    currency: '₹',
    period: '/year',
    subtitle: 'No ads — Best experience',
    monthlyEquivalent: '₹167/mo',
    productId: 'com.safeeat.premium.yearly',
    features: [
      'Everything in Monthly',
      '🚫 Zero ads — ever',
      'Priority 24/7 support',
      'Export reports (PDF)',
      'Early access to new features',
      'Family sharing (up to 3)',
    ],
    limitations: [],
    cta: 'Subscribe Yearly',
    popular: false,
    color: 'safe',
    badge: 'BEST VALUE — SAVE 44%',
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
              {plan.features.slice(0, 4).map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check className={cn('h-3 w-3', plan.id === 'yearly' ? 'text-safe' : 'text-primary')} />
                  <span className="text-xs">{f}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <div className="flex items-baseline gap-0.5">
                {plan.currency && <span className="text-sm text-muted-foreground">{plan.currency}</span>}
                <span className="text-xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-xs text-muted-foreground">{plan.period}</span>}
              </div>
            </div>
          </div>

          {/* Security info */}
          <div className="flex items-center gap-3 mb-5 px-1">
            <Shield className="h-4 w-4 text-green-600 shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Payment handled securely by Google Play. Cancel anytime from Play Store → Subscriptions.
            </p>
          </div>

          {/* Buy button */}
          <Button
            className={cn(
              'w-full py-5 rounded-2xl font-bold text-base shadow-lg',
              plan.id === 'monthly'
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/25'
                : 'bg-safe hover:bg-safe/90 text-safe-foreground shadow-safe/25'
            )}
            onClick={onPurchase}
            disabled={purchasing}
          >
            {purchasing ? (
              <><Zap className="h-5 w-5 mr-2 animate-pulse" /> Processing via Google Play...</>
            ) : (
              <><Smartphone className="h-5 w-5 mr-2" /> Buy — {plan.currency}{plan.price}{plan.period}</>
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

export function PremiumScreen() {
  const { profile, setProfile, setSubscriptionPlan, setShowAds, navigateBack, setCurrentScreen } = useAppStore()
  const [subscribing, setSubscribing] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[number] | null>(null)

  const handleSubscribe = async () => {
    if (!selectedPlan || selectedPlan.id === 'free' || profile?.isPremium) return

    setSubscribing(selectedPlan.id)
    try {
      // Simulate Google Play Billing purchase
      await new Promise(resolve => setTimeout(resolve, 2500))

      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan.id,
          provider: 'google_play',
          productId: selectedPlan.productId,
          amount: selectedPlan.price,
          currency: 'INR',
        }),
      })

      const data = await res.json()
      if (data.success) {
        setSubscriptionPlan(selectedPlan.id)
        setShowAds(selectedPlan.id === 'monthly')
        setProfile({
          ...profile!,
          isPremium: true,
        })
        toast.success(selectedPlan.id === 'yearly'
          ? '🎉 Welcome to Yearly Premium — No Ads!'
          : '🎉 Welcome to Monthly Premium!')
        setSelectedPlan(null)
        setCurrentScreen('payment-success')
      }
    } catch {
      toast.error('Payment failed. Please try again.')
      setSelectedPlan(null)
    } finally {
      setSubscribing(null)
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
        {/* Header */}
        <motion.div variants={item} className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={navigateBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Choose Your Plan</h1>
            <p className="text-sm text-muted-foreground">2-day free trial, then subscribe</p>
          </div>
        </motion.div>

        {/* Emotional selling line */}
        <motion.div variants={item}>
          <Card className="p-4 bg-gradient-to-r from-danger/5 via-danger/10 to-warn/5 border-danger/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-danger/10">
                <Shield className="h-5 w-5 text-danger" />
              </div>
              <div>
                <p className="text-sm font-bold text-danger">One Hospital Bill Costs More Than One Year Premium</p>
                <p className="text-xs text-muted-foreground mt-0.5">Prevent food poisoning before it happens</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Premium Hero */}
        <motion.div variants={item}>
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-safe/10 p-6">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-12 translate-x-12" />
            <div className="relative z-10 flex flex-col items-center gap-3 text-center">
              <div className="p-3 rounded-2xl bg-primary/10">
                <Crown className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-lg font-bold">SafeEat AI Premium</h2>
              <p className="text-xs text-muted-foreground max-w-[260px]">
                AI-powered food safety analysis with medical-grade accuracy
              </p>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-primary font-medium">
                  <Zap className="h-3 w-3" /> Faster
                </span>
                <span className="flex items-center gap-1 text-safe font-medium">
                  <Shield className="h-3 w-3" /> Smarter
                </span>
                <span className="flex items-center gap-1 text-warn font-medium">
                  <Star className="h-3 w-3" /> Better
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Ad comparison card */}
        <motion.div variants={item}>
          <Card className="p-4 border-border/50">
            <div className="flex items-center gap-4">
              <div className="flex-1 text-center p-3 rounded-xl bg-warn/5 border border-warn/10">
                <p className="text-xs font-bold text-warn mb-1">Monthly</p>
                <p className="text-[10px] text-muted-foreground">Some ads included</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <EyeOff className="h-3 w-3 text-warn/50" />
                  <span className="text-[10px] text-warn/60">Minimal ads</span>
                </div>
              </div>
              <div className="text-lg text-muted-foreground/30">vs</div>
              <div className="flex-1 text-center p-3 rounded-xl bg-safe/5 border border-safe/10">
                <p className="text-xs font-bold text-safe mb-1">Yearly</p>
                <p className="text-[10px] text-muted-foreground">Zero ads forever</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Shield className="h-3 w-3 text-safe" />
                  <span className="text-[10px] text-safe font-semibold">Ad-free</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Plan Cards */}
        {plans.map((plan) => (
          <motion.div key={plan.id} variants={item}>
            <Card className={cn(
              'relative overflow-hidden',
              plan.id === 'monthly' ? 'border-primary/40 ring-1 ring-primary/20' :
              plan.id === 'yearly' ? 'border-safe/40 ring-1 ring-safe/20' :
              'border-border/50'
            )}>
              {plan.badge && (
                <div className={cn(
                  'absolute top-0 right-0 text-[10px] font-bold px-3 py-1 rounded-bl-lg',
                  plan.id === 'monthly' ? 'bg-primary text-primary-foreground' :
                  'bg-safe text-safe-foreground'
                )}>
                  {plan.badge}
                </div>
              )}
              <div className="p-4">
                <div className="flex items-end gap-2 mb-1">
                  <div>
                    <h3 className="font-bold text-base">{plan.name}</h3>
                    <p className="text-[10px] text-muted-foreground">{plan.subtitle}</p>
                    <div className="flex items-baseline gap-0.5 mt-1">
                      {plan.price > 0 && <span className="text-sm text-muted-foreground">{plan.currency}</span>}
                      <span className="text-3xl font-bold">
                        {plan.price === 0 ? 'Free' : plan.price}
                      </span>
                      {plan.period && <span className="text-xs text-muted-foreground">{plan.period}</span>}
                    </div>
                    {plan.monthlyEquivalent && (
                      <p className="text-[10px] text-safe font-semibold mt-0.5">
                        ≈ {plan.monthlyEquivalent} — Save 44%!
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 my-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check className={cn(
                        'h-3.5 w-3.5 shrink-0 mt-0.5',
                        plan.id === 'yearly' ? 'text-safe' : 'text-primary'
                      )} />
                      <span className="text-xs">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation) => (
                    <div key={limitation} className="flex items-start gap-2 opacity-50">
                      <X className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-xs text-muted-foreground">{limitation}</span>
                    </div>
                  ))}
                </div>

                {plan.id === 'free' ? (
                  <Button variant="outline" className="w-full py-4 rounded-xl" disabled>
                    {profile?.isPremium ? 'Already Subscribed' : '2-Day Trial Active'}
                  </Button>
                ) : (
                  <Button
                    className={cn(
                      'w-full py-4 rounded-xl font-semibold',
                      plan.id === 'monthly'
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                        : 'bg-safe hover:bg-safe/90 text-safe-foreground'
                    )}
                    disabled={subscribing === plan.id || profile?.isPremium}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    {subscribing === plan.id ? (
                      <><Sparkles className="h-4 w-4 mr-1.5 animate-spin" /> Processing...</>
                    ) : profile?.isPremium ? (
                      'Already Subscribed'
                    ) : (
                      <>
                        <Smartphone className="h-4 w-4 mr-1.5" />
                        Subscribe — {plan.currency}{plan.price}{plan.period}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Google Play Billing trust badge */}
        <motion.div variants={item}>
          <Card className="p-4 bg-muted/30 border-border/30">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold">Secured by Google Play Billing</p>
                <p className="text-[10px] text-muted-foreground">Cancel anytime from Play Store → Subscriptions</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Google Play Purchase Dialog */}
      <AnimatePresence>
        {selectedPlan && (
          <GooglePlayPurchaseDialog
            plan={selectedPlan}
            onClose={() => setSelectedPlan(null)}
            onPurchase={handleSubscribe}
            purchasing={subscribing === selectedPlan.id}
          />
        )}
      </AnimatePresence>
    </>
  )
}
