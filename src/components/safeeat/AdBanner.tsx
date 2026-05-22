'use client'

import { useAppStore } from '@/lib/store'
import { X, Volume2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

// Simulated ad content — in production, replace with Google AdMob / Meta Audience Network
const AD_SAMPLES = [
  {
    brand: 'Organic Farms',
    text: 'Fresh organic vegetables delivered to your door',
    cta: 'Shop Now',
    color: 'bg-safe/5 border-safe/10',
  },
  {
    brand: 'HealthPlus',
    text: 'Premium vitamins & supplements — 20% off first order',
    cta: 'Get Offer',
    color: 'bg-primary/5 border-primary/10',
  },
  {
    brand: 'FitMeal',
    text: 'Healthy meal plans starting ₹149/day',
    cta: 'Try Free',
    color: 'bg-warn/5 border-warn/10',
  },
]

export function AdBanner() {
  const { profile, subscriptionPlan, isTrialActive } = useAppStore()
  const [dismissed, setDismissed] = useState(false)

  // Only show ads to monthly subscribers (not yearly, not free, not trial)
  const shouldShowAds = profile?.isPremium && subscriptionPlan === 'monthly' && !isTrialActive

  if (!shouldShowAds || dismissed) return null

  const ad = AD_SAMPLES[Math.floor(Math.random() * AD_SAMPLES.length)]

  return (
    <div className={cn(
      'mx-4 mb-2 rounded-xl border p-3 flex items-center gap-3',
      ad.color
    )}>
      <div className="flex items-center gap-1 shrink-0">
        <Volume2 className="h-3 w-3 text-muted-foreground" />
        <span className="text-[8px] text-muted-foreground font-semibold uppercase tracking-wider">Ad</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold truncate">{ad.brand}</p>
        <p className="text-[10px] text-muted-foreground truncate">{ad.text}</p>
      </div>
      <button className="shrink-0 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-semibold tap-feedback">
        {ad.cta}
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 p-1 rounded-full hover:bg-muted/50 transition-colors"
        aria-label="Dismiss ad"
      >
        <X className="h-3 w-3 text-muted-foreground" />
      </button>
    </div>
  )
}
