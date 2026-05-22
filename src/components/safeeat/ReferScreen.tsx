'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import {
  ChevronLeft, Gift, Copy, Share2, MessageCircle,
  Link2, Check, Users, IndianRupee, Clock, Star,
  Sparkles, Crown
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

const REFERRAL_CODE = 'SAFEAT2026'

const howItWorks = [
  {
    step: 1,
    icon: Share2,
    title: 'Share Your Link',
    description: 'Send your referral link or code to friends & family',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    step: 2,
    icon: Users,
    title: 'Friend Signs Up',
    description: 'They download SafeEat AI and create an account',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    step: 3,
    icon: Gift,
    title: 'Friend Gets 7 Days Free',
    description: 'Your friend enjoys a full 7-day premium trial',
    color: 'text-warn',
    bgColor: 'bg-warn/10',
  },
  {
    step: 4,
    icon: IndianRupee,
    title: 'You Earn ₹100',
    description: 'Cashback credited directly to your wallet',
    color: 'text-safe',
    bgColor: 'bg-safe/10',
  },
]

const referralStats = [
  { label: 'Total Referrals', value: '12', icon: Users, color: 'text-primary' },
  { label: 'Rewards Earned', value: '₹1,200', icon: IndianRupee, color: 'text-safe' },
  { label: 'Pending', value: '3', icon: Clock, color: 'text-warn' },
]

export function ReferScreen() {
  const { navigateBack } = useAppStore()
  const [copied, setCopied] = useState(false)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(REFERRAL_CODE)
    setCopied(true)
    toast.success('Referral code copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🛡️ Stay safe with SafeEat AI!\n\nUse my referral code ${REFERRAL_CODE} and get 7 days of Premium FREE!\n\nDownload now: https://safeeat.ai/download`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
    toast.success('Opening WhatsApp...')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://safeeat.ai/ref/${REFERRAL_CODE}`)
    toast.success('Referral link copied!')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SafeEat AI — Food Safety Scanner',
        text: `Use my referral code ${REFERRAL_CODE} and get 7 days of Premium FREE!`,
        url: `https://safeeat.ai/ref/${REFERRAL_CODE}`,
      }).catch(() => {})
    } else {
      handleCopyLink()
    }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 px-4 pt-4 pb-6"
    >
      {/* ━━━ Header ━━━ */}
      <motion.div variants={item} className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" onClick={navigateBack}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Refer &amp; Earn</h1>
          <p className="text-xs text-muted-foreground">Share the safety, earn rewards</p>
        </div>
        <Badge className="ml-auto chip-glass chip-primary border-primary/30 text-primary gap-1">
          <Sparkles className="h-3 w-3" />
          Premium
        </Badge>
      </motion.div>

      {/* ━━━ Hero — Referral Reward ━━━ */}
      <motion.div variants={item}>
        <div className="glass-card-elevated glow-primary relative overflow-hidden p-6">
          {/* Ambient glow circles */}
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full bg-primary/5 blur-2xl animate-pulse" />

          <div className="relative z-10 flex flex-col items-center gap-4 text-center">
            {/* Crown icon with glow */}
            <div className="relative">
              <div className="p-4 rounded-2xl gradient-primary shadow-lg shadow-primary/25 animate-float">
                <Crown className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 p-1 rounded-full bg-warn shadow-lg shadow-warn/30">
                <Star className="h-3 w-3 text-warn-foreground fill-warn-foreground" />
              </div>
            </div>

            {/* Reward text */}
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">
                <span className="premium-gradient-text">Give 7 Days Free</span>
              </h2>
              <h2 className="text-2xl font-extrabold tracking-tight mt-1">
                <span className="premium-gradient-text">Get ₹100 Cashback</span>
              </h2>
            </div>

            <p className="text-xs text-muted-foreground max-w-[280px] leading-relaxed">
              Share SafeEat AI with friends. They get 7 days of Premium free, you earn ₹100 cashback for every successful referral!
            </p>

            {/* Sparkle decorations */}
            <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1 text-safe">
                <Gift className="h-3 w-3" /> Friend Gets Free Trial
              </span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1 text-primary">
                <IndianRupee className="h-3 w-3" /> You Earn Cashback
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ━━━ Referral Code ━━━ */}
      <motion.div variants={item}>
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your Referral Code
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-14 rounded-xl bg-background/60 border border-primary/20 flex items-center justify-center gap-2 glow-primary">
              <span className="text-xl font-extrabold tracking-[0.25em] premium-gradient-text">
                {REFERRAL_CODE}
              </span>
            </div>
            <Button
              className={cn(
                'h-14 w-14 rounded-xl flex items-center justify-center transition-all duration-200',
                copied
                  ? 'bg-safe text-safe-foreground shadow-lg shadow-safe/30'
                  : 'btn-premium tap-feedback'
              )}
              onClick={handleCopyCode}
            >
              {copied ? (
                <Check className="h-5 w-5" />
              ) : (
                <Copy className="h-5 w-5 text-primary-foreground" />
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ━━━ Share Buttons ━━━ */}
      <motion.div variants={item}>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Share2 className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Share Via
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              className="tap-feedback flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/15 transition-colors"
            >
              <div className="h-10 w-10 rounded-xl bg-[#25D366]/15 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-[#25D366]" />
              </div>
              <span className="text-[10px] font-semibold text-[#25D366]">WhatsApp</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="tap-feedback flex flex-col items-center gap-2 p-4 rounded-2xl bg-primary/8 border border-primary/15 hover:bg-primary/12 transition-colors"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/12 flex items-center justify-center">
                <Link2 className="h-5 w-5 text-primary" />
              </div>
              <span className="text-[10px] font-semibold text-primary">Copy Link</span>
            </button>

            {/* More Share */}
            <button
              onClick={handleShare}
              className="tap-feedback flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted/40 border border-border/30 hover:bg-muted/60 transition-colors"
            >
              <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center">
                <Share2 className="h-5 w-5 text-foreground" />
              </div>
              <span className="text-[10px] font-semibold text-foreground">Share</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ━━━ How It Works ━━━ */}
      <motion.div variants={item}>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="section-header">How It Works</span>
        </div>
      </motion.div>

      <div className="flex flex-col gap-3">
        {howItWorks.map((step, index) => (
          <motion.div key={step.step} variants={item}>
            <div className="glass-card p-4 flex items-start gap-4">
              {/* Step number line */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center', step.bgColor)}>
                  <step.icon className={cn('h-5 w-5', step.color)} />
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="w-px h-4 bg-border/40" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Step {step.step}
                  </span>
                  {step.step === 4 && (
                    <Badge className="chip-glass chip-safe text-[9px] gap-0.5 py-0 px-1.5">
                      <IndianRupee className="h-2.5 w-2.5" /> Reward
                    </Badge>
                  )}
                </div>
                <h3 className="text-sm font-bold mt-0.5">{step.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ━━━ Your Referrals — Stats ━━━ */}
      <motion.div variants={item}>
        <div className="flex items-center gap-2 mb-1">
          <Users className="h-4 w-4 text-primary" />
          <span className="section-header">Your Referrals</span>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="glass-card-elevated glow-primary p-5">
          <div className="grid grid-cols-3 gap-3">
            {referralStats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-background/40 border border-border/20"
              >
                <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center bg-muted/60')}>
                  <stat.icon className={cn('h-4 w-4', stat.color)} />
                </div>
                <span className={cn('text-lg font-extrabold', stat.color)}>
                  {stat.value}
                </span>
                <span className="text-[10px] text-muted-foreground text-center leading-tight font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Progress bar feel */}
          <div className="mt-4 pt-3 border-t border-border/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-muted-foreground">Next reward at 15 referrals</span>
              <span className="text-[10px] font-bold text-primary">12/15</span>
            </div>
            <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
              <div
                className="h-full rounded-full gradient-primary transition-all duration-1000 ease-out"
                style={{ width: '80%' }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ━━━ CTA — Refer Now ━━━ */}
      <motion.div variants={item}>
        <button
          onClick={handleShare}
          className="btn-premium tap-feedback w-full py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2"
        >
          <Gift className="h-5 w-5" />
          Invite Friends Now
        </button>
      </motion.div>

      {/* ━━━ Terms ━━━ */}
      <motion.div variants={item} className="px-1">
        <p className="text-[10px] text-muted-foreground/60 leading-relaxed text-center">
          Referral rewards are credited when your friend completes their 7-day free trial and subscribes to any paid plan.
          ₹100 cashback is credited to your SafeEat wallet within 48 hours. Referral codes cannot be combined with other offers.
          SafeEat AI reserves the right to modify or end the referral program at any time.
        </p>
      </motion.div>

      {/* Bottom spacer */}
      <div className="h-2" />
    </motion.div>
  )
}
