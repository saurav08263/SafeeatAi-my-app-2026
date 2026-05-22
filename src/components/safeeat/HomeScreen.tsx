'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import {
  ScanLine, TrendingUp, Crown,
  AlertTriangle, ChevronRight, Sparkles, Zap,
  Leaf,
  Shield, Star, Users, Globe, Award, Sun, Moon,
  Camera, MessageCircle, Shuffle, ShieldCheck, Pill, Heart, Dumbbell, Baby,
  type LucideIcon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { AdBanner } from './AdBanner'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 340, damping: 28 } },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ULTRA-PREMIUM Quick Action Cards
// Apple-level flagship design · Glassmorphism · Glow · Floating icons
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
type QuickAction = {
  title: string
  subtitle: string
  label: string
  image: string
  screen: 'scanner' | 'chat' | 'combination' | 'expiry' | 'medicine' | 'pregnancy' | 'gym' | 'kids'
  isPremium: boolean
  icon: LucideIcon
  accent: string
  accentLight: string
  borderGlow: string
}

const quickActions: QuickAction[] = [
  {
    title: 'Scan Food',
    subtitle: 'Camera & Label',
    label: 'AI Scan',
    image: '/images/scan-food.jpg',
    screen: 'scanner',
    isPremium: false,
    icon: Camera,
    accent: 'from-blue-500 to-cyan-400',
    accentLight: 'from-blue-400/20 to-cyan-300/20',
    borderGlow: 'luxury-glow-blue',
  },
  {
    title: 'Ask AI',
    subtitle: 'Food Questions',
    label: 'Chat',
    image: '/images/ask-ai.jpg',
    screen: 'chat',
    isPremium: false,
    icon: MessageCircle,
    accent: 'from-violet-500 to-purple-400',
    accentLight: 'from-violet-400/20 to-purple-300/20',
    borderGlow: 'luxury-glow-violet',
  },
  {
    title: 'Combos',
    subtitle: 'Safe Pairings',
    label: 'Match',
    image: '/images/food-combinations.jpg',
    screen: 'combination',
    isPremium: false,
    icon: Shuffle,
    accent: 'from-emerald-500 to-teal-400',
    accentLight: 'from-emerald-400/20 to-teal-300/20',
    borderGlow: 'luxury-glow-emerald',
  },
  {
    title: 'Expiry',
    subtitle: 'Still Safe?',
    label: 'Check',
    image: '/images/expiry-check.jpg',
    screen: 'expiry',
    isPremium: false,
    icon: ShieldCheck,
    accent: 'from-teal-500 to-cyan-400',
    accentLight: 'from-teal-400/20 to-cyan-300/20',
    borderGlow: 'luxury-glow-teal',
  },
  {
    title: 'Medicine',
    subtitle: 'Drug + Food',
    label: 'PRO',
    image: '/images/medicine-food.jpg',
    screen: 'medicine',
    isPremium: true,
    icon: Pill,
    accent: 'from-rose-500 to-red-400',
    accentLight: 'from-rose-400/20 to-red-300/20',
    borderGlow: 'luxury-glow-rose',
  },
  {
    title: 'Pregnancy',
    subtitle: 'Mom & Baby',
    label: 'PRO',
    image: '/images/pregnancy-food.jpg',
    screen: 'pregnancy',
    isPremium: true,
    icon: Heart,
    accent: 'from-pink-400 to-rose-300',
    accentLight: 'from-pink-400/20 to-rose-300/20',
    borderGlow: 'luxury-glow-pink',
  },
  {
    title: 'Gym Diet',
    subtitle: 'Workout Fuel',
    label: 'PRO',
    image: '/images/gym-diet.jpg',
    screen: 'gym',
    isPremium: true,
    icon: Dumbbell,
    accent: 'from-orange-500 to-amber-400',
    accentLight: 'from-orange-400/20 to-amber-300/20',
    borderGlow: 'luxury-glow-orange',
  },
  {
    title: 'Kids Safe',
    subtitle: 'Child Nutrition',
    label: 'PRO',
    image: '/images/kids-safe.jpg',
    screen: 'kids',
    isPremium: true,
    icon: Baby,
    accent: 'from-sky-400 to-blue-300',
    accentLight: 'from-sky-400/20 to-blue-300/20',
    borderGlow: 'luxury-glow-sky',
  },
]

const featuredCombos = [
  { name: 'Paneer + Spinach', items: ['Paneer', 'Spinach'], image: '/images/paneer-spinach.jpg', safety: 'safe' as const, aiVerdict: 'Iron + Calcium Power' },
  { name: 'Dal + Rice', items: ['Dal', 'Rice'], image: '/images/dal-rice.jpg', safety: 'safe' as const, aiVerdict: 'Complete Protein' },
  { name: 'Curd + Onion', items: ['Curd', 'Onion'], image: '/images/curd-onion.jpg', safety: 'caution' as const, aiVerdict: 'Digestion Booster' },
]

const trendingCombos = [
  { name: 'Chicken + Milk', items: ['Chicken', 'Milk'], image: '/images/chicken-milk.jpg', safety: 'avoid' as const, trend: 'Trending Now' },
  { name: 'Banana + Milk', items: ['Banana', 'Milk'], image: '/images/banana-milk.jpg', safety: 'caution' as const, trend: 'Most Checked' },
]

const popularChecks = [
  { name: 'Chicken + Milk', items: ['Chicken', 'Milk'], image: '/images/chicken-milk.jpg', safety: 'avoid' as const, checkCount: '12.5K' },
  { name: 'Fish + Curd', items: ['Fish', 'Curd'], image: '/images/fish-curd.jpg', safety: 'avoid' as const, checkCount: '9.8K' },
  { name: 'Banana + Milk', items: ['Banana', 'Milk'], image: '/images/banana-milk.jpg', safety: 'caution' as const, checkCount: '8.2K' },
  { name: 'Egg + Cheese', items: ['Egg', 'Cheese'], image: '/images/egg-cheese.jpg', safety: 'caution' as const, checkCount: '7.1K' },
  { name: 'Fruit + Milk', items: ['Fruit', 'Milk'], image: '/images/fruit-milk.jpg', safety: 'caution' as const, checkCount: '6.4K' },
]

const trustStats = [
  { value: '2L+', label: 'Users', icon: Users },
  { value: '4.8', label: 'Rating', icon: Star },
  { value: '50K+', label: 'Daily Scans', icon: Shield },
]

const liveActivities = [
  { user: 'Priya', action: 'scanned Maggi Noodles', time: '2 min ago', safe: true },
  { user: 'Rahul', action: 'checked Milk + Fish combo', time: '5 min ago', safe: false },
  { user: 'Sneha', action: 'verified pregnancy food', time: '8 min ago', safe: true },
]

function getSafetyConfig(safety: 'safe' | 'caution' | 'avoid') {
  switch (safety) {
    case 'safe': return { safety, dot: 'bg-emerald-400', text: 'Safe', border: 'border-emerald-400/30', bg: 'bg-emerald-500/20' }
    case 'caution': return { safety, dot: 'bg-amber-400', text: 'Caution', border: 'border-amber-400/30', bg: 'bg-amber-500/20' }
    case 'avoid': return { safety, dot: 'bg-red-400', text: 'Avoid', border: 'border-red-400/30', bg: 'bg-red-500/20' }
  }
}

export function HomeScreen() {
  const { setCurrentScreen, profile, scanHistory, subscriptionPlan } = useAppStore()
  const { theme, setTheme } = useTheme()

  const handleThemeToggle = () => {
    document.documentElement.classList.add('theme-transitioning')
    setTheme(theme === 'dark' ? 'light' : 'dark')
    setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 400)
  }

  const totalScans = profile?.scanCount || scanHistory.length
  const safeScans = scanHistory.filter(s => s.riskLevel === 'low').length
  const warnScans = scanHistory.filter(s => s.riskLevel === 'medium' || s.riskLevel === 'high').length

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4 px-4 pt-1 pb-6">

      {/* ━━━ HEADER — Luxury Premium ━━━ */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="luxury-logo-frame h-10 w-10 rounded-2xl overflow-hidden">
              <Image src="/logo.png" alt="SafeEat AI" width={40} height={40} className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-medium leading-tight">
                {getGreeting()}, {profile?.name || 'User'} 👋
              </p>
              <h1 className="text-[17px] font-extrabold tracking-tight leading-tight">
                Safe<span className="premium-gradient-text">Eat</span> AI
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={handleThemeToggle} className="tap-feedback h-8 w-8 rounded-xl bg-white/[0.06] backdrop-blur-md border border-white/[0.08] flex items-center justify-center transition-all">
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-primary" />}
            </button>
            {profile?.isPremium ? (
              <Badge className="bg-safe/15 text-safe border-safe/25 text-[8px] font-bold gap-0.5 px-2 py-0 premium-badge-glow">
                <Crown className="h-2.5 w-2.5" /> PRO
              </Badge>
            ) : (
              <button onClick={() => setCurrentScreen('premium')} className="tap-feedback btn-premium flex items-center gap-1 px-3 py-1.5 text-[9px] font-bold">
                <Crown className="h-2.5 w-2.5" /> Upgrade
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ━━━ TRUST BAR — Frosted Glass ━━━ */}
      <motion.div variants={item}>
        <div className="glass-card p-2.5">
          <div className="flex items-center justify-around">
            {trustStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="flex items-center gap-1.5">
                  <div className="h-7 w-7 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-sm shadow-primary/25">
                    <Icon className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold tabular-nums leading-none">{stat.value}</p>
                    <p className="text-[7px] text-muted-foreground font-medium leading-tight">{stat.label}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* ━━━ LIVE TICKER ━━━ */}
      <motion.div variants={item}>
        <div className="glass-card-subtle flex items-center gap-2 px-2.5 py-1.5">
          <div className="flex items-center gap-1 shrink-0">
            <div className="h-1.5 w-1.5 rounded-full bg-safe animate-pulse glow-safe" />
            <span className="text-[7px] font-bold text-safe uppercase tracking-wider">Live</span>
          </div>
          <div className="flex-1 min-w-0">
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 3 }}>
              <p className="text-[10px] text-muted-foreground truncate">
                <span className="font-semibold text-foreground">{liveActivities[0].user}</span> {liveActivities[0].action} · <span className="text-[8px]">{liveActivities[0].time}</span> {liveActivities[0].safe ? '✅' : '⚠️'}
              </p>
            </motion.div>
          </div>
          <span className="text-[7px] text-muted-foreground shrink-0">+{Math.floor(Math.random() * 200 + 100)} online</span>
        </div>
      </motion.div>

      {/* ━━━ QUICK STATS — Glass Pills ━━━ */}
      <motion.div variants={item} className="flex gap-2">
        {[
          { count: totalScans, label: 'Scans', Icon: TrendingUp, gradient: 'gradient-primary', glow: 'glow-primary', color: '' },
          { count: safeScans, label: 'Safe', Icon: Leaf, gradient: 'gradient-safe', glow: 'glow-safe', color: 'text-safe' },
          { count: warnScans, label: 'Warn', Icon: AlertTriangle, gradient: 'gradient-warn', glow: 'glow-warn', color: 'text-warn' },
        ].map(({ count, label, Icon, gradient, glow, color }) => (
          <div key={label} className={`flex-1 glass-card flex items-center gap-2 p-2.5 tap-feedback ${glow}`} onClick={() => label === 'Scans' && setCurrentScreen('history')}>
            <div className={`h-7 w-7 rounded-xl ${gradient} flex items-center justify-center shadow-sm shadow-primary/20`}>
              <Icon className="h-3 w-3 text-primary-foreground" />
            </div>
            <div>
              <p className={`text-sm font-bold tabular-nums leading-none ${color}`}>{count}</p>
              <p className="text-[8px] text-muted-foreground font-medium">{label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          QUICK ACTIONS — Ultra-Premium Luxury Cards
          28px corners · Floating icons · Glassmorphism · Border glow
          Animated AI badge · Mini labels · Bottom blur gradient
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-bold tracking-tight">Quick Actions</h3>
            <div className="luxury-ai-badge flex items-center gap-1 px-2 py-0.5 rounded-full">
              <Sparkles className="h-2.5 w-2.5 text-white animate-ai-pulse" />
              <span className="text-[7px] font-bold text-white uppercase tracking-widest">AI</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 18, scale: 0.93 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.05, type: 'spring', stiffness: 280, damping: 22 }}
                className={cn(
                  'luxury-card group relative overflow-hidden rounded-[28px] h-[178px] active:scale-[0.96] transition-all duration-300',
                  action.borderGlow
                )}
                onClick={() => setCurrentScreen(action.screen)}
              >
                {/* ── Cinematic Background ── */}
                <Image
                  src={action.image}
                  alt={action.title}
                  fill
                  className="object-cover object-center transition-transform duration-600 group-active:scale-[1.04] clean-card-img"
                  sizes="(max-width: 420px) 47vw, 180px"
                  quality={92}
                />

                {/* ── Bottom blur gradient for readability ── */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/5" />
                {/* ── Frosted glass overlay ── */}
                <div className="absolute inset-0 backdrop-blur-[0.5px]" />
                {/* ── Accent color tint ── */}
                <div className={cn('absolute inset-0 bg-gradient-to-t opacity-30', `from-${action.accent.split(' ')[0].replace('from-', '')}/30 via-transparent to-transparent`)} />
                {/* ── Dynamic lighting refraction ── */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-white/[0.01]" />

                {/* ── Luxury animated border ── */}
                <div className="absolute inset-0 rounded-[28px] border border-white/[0.08] group-active:border-white/[0.18] transition-colors duration-300" />
                {/* ── Top light reflection ── */}
                <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                {/* ── Bottom inner glow ── */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                {/* ── Floating Premium Icon — top-left ── */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <div className="relative">
                    <div className={cn(
                      'h-9 w-9 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg backdrop-blur-xl luxury-icon-float',
                      action.accent
                    )}>
                      <Icon className="h-4 w-4 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" strokeWidth={2.2} />
                    </div>
                    {/* Icon glow ring */}
                    <div className={cn(
                      'absolute -inset-1.5 rounded-3xl bg-gradient-to-br opacity-0 group-active:opacity-50 blur-md transition-opacity duration-300',
                      action.accent
                    )} />
                  </div>
                </div>

                {/* ── Animated AI / PRO Badge — top-right ── */}
                <div className="absolute top-2.5 right-2.5 z-10">
                  {action.isPremium && !profile?.isPremium ? (
                    <div className="luxury-crown-badge h-6 w-6 rounded-full flex items-center justify-center">
                      <Crown className="h-2.5 w-2.5 text-amber-300" />
                    </div>
                  ) : (
                    <div className="luxury-ai-badge-sm flex items-center gap-0.5 px-1.5 py-0.5 rounded-full">
                      <Sparkles className="h-2 w-2 text-white animate-ai-pulse" />
                      <span className="text-[6px] font-bold text-white uppercase tracking-widest">AI</span>
                    </div>
                  )}
                </div>

                {/* ── Bottom section — Premium typography + mini label ── */}
                <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                  {/* Mini luxury label tag */}
                  <div className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r backdrop-blur-xl border border-white/[0.08] mb-1.5',
                    action.accentLight
                  )}>
                    <span className="text-[7px] font-bold text-white/90 uppercase tracking-widest">{action.label}</span>
                  </div>
                  <p className="text-[14px] font-extrabold text-white leading-[1.1] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] tracking-tight">
                    {action.title}
                  </p>
                  <p className="text-[10px] text-white/65 font-semibold leading-tight mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                    {action.subtitle}
                  </p>
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FEATURED COMBOS — Premium Horizontal Scroll
          Luxury cards with frosted glass + floating badges
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-bold tracking-tight">Featured Combos</h3>
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-safe/15 border border-safe/25">
              <Sparkles className="h-2 w-2 text-safe" />
              <span className="text-[6px] font-bold text-safe uppercase tracking-widest">Verified</span>
            </div>
          </div>
          <button className="text-[11px] text-primary font-semibold tap-feedback flex items-center gap-0.5" onClick={() => setCurrentScreen('combination')}>
            See All <ChevronRight className="h-2.5 w-2.5" />
          </button>
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory premium-scroll">
          {featuredCombos.map((combo) => {
            const safetyCfg = getSafetyConfig(combo.safety)
            return (
              <button key={combo.name} className="clean-card group relative overflow-hidden rounded-[20px] shrink-0 w-[148px] h-[188px] active:scale-[0.97] transition-all duration-200 snap-start" onClick={() => setCurrentScreen('combination')}>
                <Image src={combo.image} alt={combo.name} fill className="object-cover transition-transform duration-400 group-active:scale-[1.03] clean-card-img" sizes="148px" quality={88} />
                <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-2 left-2 z-10">
                  <div className={cn('flex items-center gap-1 px-1.5 py-0.5 rounded-full backdrop-blur-xl border text-[7px] font-bold text-white', safetyCfg.bg, safetyCfg.border)}>
                    <div className={cn('h-1 w-1 rounded-full', safetyCfg.dot)} /> {safetyCfg.text}
                  </div>
                </div>
                <div className="absolute top-2 right-2 z-10">
                  <div className="luxury-ai-badge-sm flex items-center gap-0.5 px-1.5 py-0.5 rounded-full">
                    <Sparkles className="h-1.5 w-1.5 text-white animate-ai-pulse" />
                    <span className="text-[5px] font-bold text-white uppercase tracking-widest">AI</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2.5 z-10">
                  <p className="text-[11px] font-bold text-white leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">{combo.name}</p>
                  <p className="text-[8px] text-white/65 font-medium mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{combo.aiVerdict}</p>
                </div>
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          TRENDING NOW — Compact Premium Cards
          120-135px · Rounded 20px · Luxury overlay · Floating badges
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-bold tracking-tight">Trending Now</h3>
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-warn/15 border border-warn/25">
              <Zap className="h-2 w-2 text-warn" />
              <span className="text-[6px] font-bold text-warn uppercase tracking-widest">Hot</span>
            </div>
          </div>
          <button className="text-[11px] text-primary font-semibold tap-feedback flex items-center gap-0.5" onClick={() => setCurrentScreen('combination')}>
            See All <ChevronRight className="h-2.5 w-2.5" />
          </button>
        </div>
        <div className="flex flex-col gap-2.5">
          {trendingCombos.map((combo) => {
            const safetyCfg = getSafetyConfig(combo.safety)
            return (
              <button key={combo.name} className="luxury-trending-card group relative overflow-hidden rounded-[20px] w-full h-[128px] active:scale-[0.98] transition-all duration-200" onClick={() => setCurrentScreen('combination')}>
                <Image src={combo.image} alt={combo.name} fill className="object-cover transition-transform duration-400 group-active:scale-[1.03] clean-card-img" sizes="(max-width: 420px) 100vw, 360px" quality={88} />
                {/* Dark cinematic overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/20 to-black/5" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {/* Trend badge */}
                <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 backdrop-blur-xl border border-amber-400/25">
                  <Zap className="h-2 w-2 text-amber-300" />
                  <span className="text-[7px] font-bold text-amber-200">{combo.trend}</span>
                </div>
                {/* AI badge */}
                <div className="absolute top-2.5 right-2.5 z-10">
                  <div className="luxury-ai-badge-sm flex items-center gap-0.5 px-1.5 py-0.5 rounded-full">
                    <Sparkles className="h-1.5 w-1.5 text-white animate-ai-pulse" />
                    <span className="text-[5px] font-bold text-white uppercase tracking-widest">AI</span>
                  </div>
                </div>
                {/* Safety badge */}
                <div className="absolute bottom-2.5 right-2.5 z-10">
                  <div className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full backdrop-blur-xl border text-[7px] font-bold text-white', safetyCfg.bg, safetyCfg.border)}>
                    <div className={cn('h-1 w-1 rounded-full', safetyCfg.dot)} /> {safetyCfg.text}
                  </div>
                </div>
                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                  <p className="text-[13px] font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">{combo.name}</p>
                  <p className="text-[9px] text-white/60 font-medium mt-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">{combo.items.join(' + ')} combo</p>
                </div>
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          POPULAR CHECKS — Premium Image-Backed Cards
          Food photography thumbnails · Safety badges · AI labels
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-bold tracking-tight">Popular Checks</h3>
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-primary/15 border border-primary/25">
              <Sparkles className="h-2 w-2 text-primary" />
              <span className="text-[6px] font-bold text-primary uppercase tracking-widest">Top</span>
            </div>
          </div>
          <button className="text-[11px] text-primary font-semibold tap-feedback flex items-center gap-0.5" onClick={() => setCurrentScreen('combination')}>
            See All <ChevronRight className="h-2.5 w-2.5" />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {popularChecks.map((combo, i) => {
            const safetyCfg = getSafetyConfig(combo.safety)
            return (
              <motion.button
                key={combo.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 280, damping: 24 }}
                className="glass-card group flex items-center gap-3 p-2.5 active:scale-[0.98] transition-all duration-200"
                onClick={() => setCurrentScreen('combination')}
              >
                {/* ── Food Image Thumbnail ── */}
                <div className="relative h-11 w-11 rounded-2xl overflow-hidden shrink-0 border border-white/[0.08] shadow-md">
                  <Image
                    src={combo.image}
                    alt={combo.name}
                    fill
                    className="object-cover transition-transform duration-300 group-active:scale-110 clean-card-img"
                    sizes="44px"
                    quality={85}
                  />
                  {/* Subtle glass overlay on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* ── Text Content ── */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[12px] font-bold truncate leading-tight">{combo.name}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[9px] text-muted-foreground font-medium">{combo.items.join(' + ')}</p>
                    <span className="text-[7px] text-muted-foreground/40">·</span>
                    <span className="text-[8px] text-muted-foreground/60 font-medium">{combo.checkCount} checks</span>
                  </div>
                </div>

                {/* ── Safety Badge ── */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className={cn(
                    'flex items-center gap-1 px-2 py-0.5 rounded-full backdrop-blur-xl border text-[8px] font-bold',
                    safetyCfg.bg, safetyCfg.border
                  )}>
                    <div className={cn('h-1.5 w-1.5 rounded-full', safetyCfg.dot)} />
                    <span className={safetyCfg.safety === 'avoid' ? 'text-red-300' : safetyCfg.safety === 'caution' ? 'text-amber-300' : 'text-emerald-300'}>
                      {safetyCfg.text}
                    </span>
                  </div>
                  <ChevronRight className="h-3 w-3 text-muted-foreground/25" />
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* ━━━ Trust Badges ━━━ */}
      <motion.div variants={item}>
        <div className="glass-card p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Award className="h-3.5 w-3.5 text-primary" />
            <h3 className="text-[11px] font-bold">Trusted & Certified</h3>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { icon: Shield, label: 'FDA Compliant', color: 'text-primary' },
              { icon: Globe, label: '180+ Countries', color: 'text-safe' },
              { icon: Shield, label: 'Lives Saved', color: 'text-danger' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <Icon className={cn('h-3.5 w-3.5', color)} />
                <span className="text-[7px] font-semibold text-center leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Premium Upgrade */}
      {!profile?.isPremium && (
        <motion.div variants={item}>
          <button className="tap-feedback w-full glass-card-elevated p-3 active:scale-[0.98] transition-transform glow-primary" onClick={() => setCurrentScreen('premium')}>
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-md shadow-primary/25">
                <Crown className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[11px] font-bold">Upgrade to Premium</p>
                <p className="text-[9px] text-muted-foreground">Unlimited scans · Priority AI · All features</p>
              </div>
              <ChevronRight className="h-4 w-4 text-primary shrink-0" />
            </div>
          </button>
        </motion.div>
      )}

      <AdBanner />

      {/* Scan Shortcut */}
      <motion.div variants={item}>
        <button className="tap-feedback w-full glass-card p-3 flex items-center gap-2.5 active:scale-[0.98] transition-transform glow-primary" onClick={() => setCurrentScreen('scanner')}>
          <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center shadow-md shadow-primary/30 animate-pulse-glow">
            <ScanLine className="w-5 h-5 text-primary-foreground" strokeWidth={2.2} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[11px] font-bold">Scan Your Food Now</p>
            <p className="text-[9px] text-muted-foreground">Tap to check if your food is safe to eat</p>
          </div>
          <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center border border-primary/25">
            <ChevronRight className="h-3 w-3 text-primary" />
          </div>
        </button>
      </motion.div>

      {/* Bottom tagline */}
      <motion.div variants={item}>
        <div className="flex items-center justify-center py-1">
          <span className="text-[9px] text-primary/70 font-semibold tracking-wide">World's Smartest Food Safety App</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}
