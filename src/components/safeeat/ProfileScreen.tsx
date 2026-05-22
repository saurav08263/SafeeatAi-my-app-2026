'use client'

import { motion } from 'framer-motion'
import { useAppStore, ALLERGY_OPTIONS, DIETARY_OPTIONS, HEALTH_GOALS } from '@/lib/store'
import {
  User, Leaf, Heart, ChevronRight,
  Edit3, Check, Crown, AlertTriangle, LogOut, FileText,
  CreditCard, Bell, HelpCircle, Info,
  Star, Sun, Moon
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

// User testimonials
const testimonials = [
  { name: 'Priya M.', city: 'Mumbai', text: 'Saved my child from a harmful food allergy!', rating: 5 },
  { name: 'Raj K.', city: 'Delhi', text: 'Best food safety app! Check every product now.', rating: 5 },
  { name: 'Anita S.', city: 'Bangalore', text: 'Pregnancy food checker is a lifesaver 🙏', rating: 5 },
  { name: 'Vikram P.', city: 'Chennai', text: 'Detected expired medicine interaction. Wow!', rating: 5 },
  { name: 'Sneha R.', city: 'Pune', text: 'Gym diet feature helped me eat right 💪', rating: 4 },
  { name: 'Amit T.', city: 'Hyderabad', text: 'Scan karke check karta hoon ab har cheez!', rating: 5 },
]

export function ProfileScreen() {
  const { profile, setProfile, setCurrentScreen, logout } = useAppStore()
  const { theme, setTheme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(profile?.name || 'User')
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(profile?.allergies || [])
  const [selectedDietary, setSelectedDietary] = useState<string[]>(profile?.dietaryRestrictions || [])
  const [selectedGoals, setSelectedGoals] = useState<string[]>(profile?.healthGoals || [])
  const [isSaving, setIsSaving] = useState(false)
  const [isThemeAnimating, setIsThemeAnimating] = useState(false)

  const handleThemeToggle = (newTheme: string) => {
    if (isThemeAnimating) return
    setIsThemeAnimating(true)
    // Add transition class for smooth theme change
    document.documentElement.classList.add('theme-transitioning')
    setTheme(newTheme)
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning')
      setIsThemeAnimating(false)
    }, 400)
  }
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile')
        const data = await res.json()
        if (data.success && data.profile) {
          setProfile(data.profile)
          setEditName(data.profile.name)
          setSelectedAllergies(data.profile.allergies || [])
          setSelectedDietary(data.profile.dietaryRestrictions || [])
          setSelectedGoals(data.profile.healthGoals || [])
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      }
    }
    fetchProfile()
  }, [setProfile])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          allergies: selectedAllergies,
          dietaryRestrictions: selectedDietary,
          healthGoals: selectedGoals,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setProfile(data.profile)
        setIsEditing(false)
        toast.success('Profile saved!')
      }
    } catch {
      toast.error('Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleItem = (item: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item])
  }

  const menuItems = [
    { icon: FileText, label: 'My Reports', screen: 'history' as const },
    { icon: CreditCard, label: 'Payment History', screen: 'premium' as const },
    { icon: Bell, label: 'Notification Settings', screen: 'notifications' as const },
    { icon: HelpCircle, label: 'Help & Support', screen: 'help' as const },
    { icon: Info, label: 'About', screen: 'about' as const },
    { icon: Star, label: 'Refer & Earn', screen: 'refer' as const },
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 px-4 pt-4 pb-6"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground">Your health &amp; safety settings</p>
        </div>
        <Button
          variant={isEditing ? 'default' : 'outline'}
          size="sm"
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={isSaving}
          className={isEditing ? 'bg-primary text-primary-foreground' : ''}
        >
          {isSaving ? 'Saving...' : isEditing ? (
            <><Check className="h-4 w-4 mr-1" /> Save</>
          ) : (
            <><Edit3 className="h-4 w-4 mr-1" /> Edit</>
          )}
        </Button>
      </motion.div>

      {/* Profile Card */}
      <motion.div variants={item}>
        <div className="glass-card-elevated p-4 glow-primary">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <User className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-8 text-sm font-semibold"
                  placeholder="Your name"
                />
              ) : (
                <p className="font-bold text-base">{profile?.name || 'User'}</p>
              )}
              <p className="text-xs text-muted-foreground">{profile?.email || 'user@safeeat.ai'}</p>
              {profile?.phone && (
                <p className="text-xs text-muted-foreground">{profile.phone}</p>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                {profile?.isPremium ? (
                  <Badge className="bg-safe/15 text-safe border-safe/25 text-[10px] font-bold gap-1 px-2.5 premium-badge-glow">
                    <Crown className="h-3 w-3" /> Premium
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px]">Free Plan</Badge>
                )}
                <span className="text-[10px] text-muted-foreground">
                  {profile?.scanCount || 0} scans
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Subscription Status */}
      <motion.div variants={item}>
        <div className={cn(
          'glass-card p-4',
          profile?.isPremium && 'border-safe/30 glow-safe'
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              'h-10 w-10 rounded-xl flex items-center justify-center',
              profile?.isPremium ? 'gradient-safe shadow-md shadow-safe/20' : 'bg-muted/50'
            )}>
              <Crown className={cn('h-5 w-5', profile?.isPremium ? 'text-safe-foreground' : 'text-muted-foreground')} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">
                {profile?.isPremium ? 'Premium Active' : 'Free Plan'}
              </p>
              <p className="text-xs text-muted-foreground">
                {profile?.isPremium ? 'All features unlocked' : 'Upgrade for full access'}
              </p>
            </div>
            {!profile?.isPremium && (
              <Button size="sm" onClick={() => setCurrentScreen('premium')} className="btn-premium tap-feedback">
                Upgrade
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ━━━ Dark / Light Mode Toggle ━━━ */}
      <motion.div variants={item}>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-primary/10 shrink-0">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Appearance</p>
              <p className="text-xs text-muted-foreground">
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </p>
            </div>
            <button
              onClick={() => handleThemeToggle(theme === 'dark' ? 'light' : 'dark')}
              className="tap-feedback relative h-8 w-14 rounded-full transition-colors duration-300"
              style={{
                background: theme === 'dark'
                  ? 'oklch(0.25 0.02 145)'
                  : 'oklch(0.88 0.01 145)',
              }}
            >
              <div
                className="absolute top-1 h-6 w-6 rounded-full transition-all duration-300 flex items-center justify-center shadow-md"
                style={{
                  left: theme === 'dark' ? '30px' : '4px',
                  background: theme === 'dark'
                    ? 'oklch(0.55 0.22 145)'
                    : 'oklch(0.98 0.005 145)',
                }}
              >
                {theme === 'dark' ? (
                  <Moon className="h-3.5 w-3.5 text-primary-foreground" />
                ) : (
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                )}
              </div>
            </button>
          </div>
          {/* Quick theme pills */}
          <div className="flex gap-2 mt-3 pt-3 border-t border-border/20">
            <button
              onClick={() => handleThemeToggle('dark')}
              className={cn(
                'tap-feedback flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all',
                theme === 'dark'
                  ? 'bg-primary/15 text-primary border border-primary/25'
                  : 'bg-muted/40 text-muted-foreground border border-transparent'
              )}
            >
              <Moon className="h-3.5 w-3.5" />
              Dark
            </button>
            <button
              onClick={() => handleThemeToggle('light')}
              className={cn(
                'tap-feedback flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all',
                theme === 'light'
                  ? 'bg-primary/15 text-primary border border-primary/25'
                  : 'bg-muted/40 text-muted-foreground border border-transparent'
              )}
            >
              <Sun className="h-3.5 w-3.5" />
              Light
            </button>
          </div>
        </div>
      </motion.div>

      {/* Menu Items */}
      <motion.div variants={item}>
        <div className="glass-card overflow-hidden divide-y divide-border/10">
          {menuItems.map(({ icon: Icon, label, screen }) => (
            <button
              key={label}
              className="tap-feedback w-full flex items-center gap-3 p-3.5 text-left active:bg-muted/20 transition-colors"
              onClick={() => setCurrentScreen(screen)}
            >
              <div className="h-8 w-8 rounded-xl bg-muted/30 flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium flex-1">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
            </button>
          ))}
        </div>
      </motion.div>

      {/* ━━━ What Users Say ━━━ */}
      <motion.div variants={item}>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-danger" />
              What Users Say
            </h3>
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />
              ))}
              <span className="text-[10px] font-semibold text-muted-foreground ml-1">4.8/5</span>
            </div>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory premium-scroll">
            {testimonials.map((review, i) => (
              <div
                key={i}
                className="shrink-0 w-[200px] snap-start rounded-xl glass-card-subtle p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn(
                    'h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white',
                    i % 3 === 0 ? 'gradient-primary' : i % 3 === 1 ? 'gradient-safe' : 'bg-violet-500'
                  )}>
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold leading-none">{review.name}</p>
                    <p className="text-[9px] text-muted-foreground">{review.city}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">&ldquo;{review.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Allergies */}
      <motion.div variants={item}>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-lg gradient-danger flex items-center justify-center shadow-md shadow-danger/20">
              <AlertTriangle className="h-3.5 w-3.5 text-danger-foreground" />
            </div>
            <h3 className="text-sm font-bold">My Allergies</h3>
            {selectedAllergies.length > 0 && (
              <Badge className="bg-danger/10 text-danger border-danger/20 text-[10px] ml-auto">
                {selectedAllergies.length} selected
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ALLERGY_OPTIONS.map((allergy) => {
              const isSelected = selectedAllergies.includes(allergy)
              return (
                <button
                  key={allergy}
                  onClick={() => isEditing && toggleItem(allergy, selectedAllergies, setSelectedAllergies)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all touch-action-manipulation ${
                    isSelected
                      ? 'bg-danger/10 text-danger border border-danger/30'
                      : 'bg-muted/30 text-muted-foreground border border-border/20'
                  } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {isSelected && <Check className="h-2.5 w-2.5" />}
                  {allergy}
                </button>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Dietary Restrictions */}
      <motion.div variants={item}>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center shadow-md shadow-primary/20">
              <Leaf className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <h3 className="text-sm font-bold">Dietary Restrictions</h3>
            {selectedDietary.length > 0 && (
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] ml-auto">
                {selectedDietary.length} selected
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {DIETARY_OPTIONS.map((diet) => {
              const isSelected = selectedDietary.includes(diet)
              return (
                <button
                  key={diet}
                  onClick={() => isEditing && toggleItem(diet, selectedDietary, setSelectedDietary)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all touch-action-manipulation ${
                    isSelected
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'bg-muted/30 text-muted-foreground border border-border/20'
                  } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {isSelected && <Check className="h-2.5 w-2.5" />}
                  {diet}
                </button>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Health Goals */}
      <motion.div variants={item}>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-lg gradient-safe flex items-center justify-center shadow-md shadow-safe/20">
              <Heart className="h-3.5 w-3.5 text-safe-foreground" />
            </div>
            <h3 className="text-sm font-bold">Health Goals</h3>
            {selectedGoals.length > 0 && (
              <Badge className="bg-safe/10 text-safe border-safe/20 text-[10px] ml-auto">
                {selectedGoals.length} selected
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {HEALTH_GOALS.map((goal) => {
              const isSelected = selectedGoals.includes(goal)
              return (
                <button
                  key={goal}
                  onClick={() => isEditing && toggleItem(goal, selectedGoals, setSelectedGoals)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all touch-action-manipulation ${
                    isSelected
                      ? 'bg-safe/10 text-safe border border-safe/30'
                      : 'bg-muted/30 text-muted-foreground border border-border/20'
                  } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {isSelected && <Check className="h-2.5 w-2.5" />}
                  {goal}
                </button>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Logout */}
      <motion.div variants={item}>
        <Button
          variant="outline"
          className="w-full py-5 rounded-xl text-danger hover:text-danger hover:bg-danger/5 border-danger/20"
          onClick={() => {
            logout()
            setCurrentScreen('welcome')
            toast.success('Logged out successfully')
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </motion.div>

      {/* App Version */}
      <motion.div variants={item} className="text-center">
        <span className="text-[11px] text-muted-foreground/40">v2.0.0</span>
      </motion.div>

      {/* Premium Upsell */}
      {!profile?.isPremium && (
        <motion.div variants={item}>
          <button
            className="tap-feedback w-full glass-card-elevated p-4 active:scale-[0.98] transition-transform glow-primary"
            onClick={() => setCurrentScreen('premium')}
          >
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
                <Crown className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold">Upgrade to Premium</p>
                <p className="text-xs text-muted-foreground">Unlimited scans &amp; priority analysis</p>
              </div>
              <ChevronRight className="h-5 w-5 text-primary shrink-0" />
            </div>
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}
