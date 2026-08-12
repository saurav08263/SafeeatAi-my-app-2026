'use client'

import { motion, type Variants } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Crown, Check, Shield, X, Zap, EyeOff, Smartphone, ChevronRight, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { getPricing } from '@/lib/pricing'

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item: Variants = {
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

export function PaywallScreen() {
 


  const { setCurrentScreen, navigateBack, profile, setProfile, setSubscriptionPlan, setShowAds } = useAppStore()

const pricing = getPricing(profile?.country || "IN")

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: `${pricing.currency}${pricing.monthly}`,
    period: '/month',
    badge: 'POPULAR',
    badgeColor: 'bg-primary text-primary-foreground',
    borderColor: 'border-primary/40 ring-1 ring-primary/20',
    features: [
      'Unlimited scans',
      'All premium features',
      'Minimal ads included'
    ],
    hasAds: true,
    btnClass: 'bg-primary hover:bg-primary/90 text-primary-foreground',
    productId: 'com.safeeat.premium.monthly',
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: `${pricing.currency}${pricing.yearly}`,
    period: '/year',
    badge: 'SAVE 44%',
    badgeColor: 'bg-safe text-safe-foreground',
    borderColor: 'border-safe/40 ring-1 ring-safe/20',
    features: [
      'Everything in Monthly',
      '🚫 Zero ads — ever',
      'Priority 24/7 support',
      'Export reports (PDF)'
    ],
    hasAds: false,
    btnClass: 'bg-safe hover:bg-safe/90 text-safe-foreground',
    productId: 'com.safeeat.premium.yearly',
  },
]

  const handleSubscribe = async (plan: any) => {
  try {
    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  plan: plan.id,
  amount: plan.id === "monthly" ? pricing.monthly : pricing.yearly,
  currency: "INR",
}),
    })

   const data = await res.json()

const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: data.order.amount,
  currency: data.order.currency,
  order_id: data.order.id,
      name: "SafeEat AI",
      description: `${plan.name} Subscription`,

      handler: async function (response: any) {

        await fetch("/api/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
  ...response,
  plan: plan.id,
  amount:
    plan.id === "monthly"
      ? pricing.monthly
      : pricing.yearly,
  currency: "INR",
}),
        })

        setSubscriptionPlan(plan.id)
        setShowAds(plan.hasAds)

        setProfile({
          ...profile!,
          isPremium: true,
        })

        setCurrentScreen("payment-success")
      },
    }

    const razor = new (window as any).Razorpay(options)

    razor.open()

  } catch (e) {
    console.log(e)
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
                    <div className="mt-1 space-y-1">
  <p className="text-[10px] font-semibold text-safe">
    Save ₹789/year
  </p>

  <p className="text-[10px] text-safe/90">
    Save 44% with Annual Plan
  </p>

  <p className="text-[10px] font-medium text-primary">
    Best Value – Save ₹789 (44%)
  </p>

  <p className="text-[10px] text-muted-foreground">
    ₹149/month or ₹999/year (Save ₹789)
  </p>
</div>
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
                onClick={() => handleSubscribe(plan)}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Subscribe — {plan.price}{plan.period}
              </Button>
            </Card>
          </motion.div>
        ))}

      

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

    </>
  )
}

