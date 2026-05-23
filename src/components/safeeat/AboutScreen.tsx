'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import {
  ChevronLeft, Shield, ScanLine, Sparkles, Heart, Baby,
  Dumbbell, Pill, Globe, Star, Mail, ExternalLink, Crown,
  Users, Award
} from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

const keyFeatures = [
  { icon: ScanLine, label: 'Scan Food', desc: 'Instant ingredient analysis', color: 'text-primary' },
  { icon: Sparkles, label: 'AI Doctor', desc: 'Smart health recommendations', color: 'text-primary' },
  { icon: Heart, label: 'Combo Check', desc: 'Food combination safety', color: 'text-warn' },
  { icon: Pill, label: 'Medicine Check', desc: 'Drug interaction alerts', color: 'text-danger' },
  { icon: Baby, label: 'Pregnancy Safe', desc: 'Safe food for expecting moms', color: 'text-pink-400' },
  { icon: Shield, label: 'Kids Safe', desc: 'Child-friendly food checker', color: 'text-safe' },
  { icon: Dumbbell, label: 'Gym Diet', desc: 'Fitness nutrition guide', color: 'text-primary' },
]

export function AboutScreen() {
  const { navigateBack, setCurrentScreen } = useAppStore()

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 px-4 pt-4 pb-6"
    >
      {/* ━━━ Header ━━━ */}
      <motion.div variants={item} className="flex items-center gap-3">
        <button
          onClick={navigateBack}
          className="h-9 w-9 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors tap-feedback"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">About SafeEat AI</h1>
          <p className="text-xs text-muted-foreground">Your AI food safety companion</p>
        </div>
      </motion.div>

      {/* ━━━ App Logo & Name ━━━ */}
      <motion.div variants={item}>
        <div className="glass-card-elevated p-6 flex flex-col items-center gap-4 glow-primary">
          <div className="h-20 w-20 rounded-2xl overflow-hidden bg-white shadow-2xl shadow-primary/30 mx-auto">
            <Image src="/logo.png" alt="SafeEat AI" width={80} height={80} className="w-full h-full object-contain" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-extrabold premium-gradient-text">SafeEat AI</h2>
            <p className="text-xs text-muted-foreground mt-1">AI-Powered Food Safety Scanner</p>
          </div>
          <Badge className="premium-badge-glow bg-primary/10 text-primary border-primary/20 text-[11px] px-3 py-1">
            v2.0.0 (Build 2026.05)
          </Badge>
        </div>
      </motion.div>

      {/* ━━━ Mission Section ━━━ */}
      <motion.div variants={item}>
        <div className="glass-card p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 rounded-xl gradient-primary">
              <Globe className="h-4 w-4 text-primary-foreground" />
            </div>
            <h3 className="text-sm font-bold">Our Mission</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            SafeEat AI is on a mission to make food safety accessible to everyone. We harness cutting-edge artificial intelligence to help you instantly identify harmful ingredients, allergens, and unsafe food combinations — protecting you and your loved ones from hidden health risks in everyday food products.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2">
            From scanning packaged food labels to checking medicine interactions, SafeEat AI is your trusted health companion that fits right in your pocket.
          </p>
        </div>
      </motion.div>

      {/* ━━━ Key Features ━━━ */}
      <motion.div variants={item}>
        <div className="glass-card p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 rounded-xl bg-warn/10">
              <Award className="h-4 w-4 text-warn" />
            </div>
            <h3 className="text-sm font-bold">Key Features</h3>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {keyFeatures.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/20"
                >
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                    <Icon className={`h-4 w-4 ${feature.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">{feature.label}</p>
                    <p className="text-[11px] text-muted-foreground">{feature.desc}</p>
                  </div>
                  <Shield className="h-3.5 w-3.5 text-safe/50 shrink-0" />
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* ━━━ Team / Company Info ━━━ */}
      <motion.div variants={item}>
        <div className="glass-card p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-bold">Our Team</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Built by a passionate team of AI researchers, nutritionists, and mobile engineers at{' '}
            <span className="font-semibold text-foreground">DoctorPulse AI</span>. We combine deep expertise in
            food science, machine learning, and healthcare to deliver the most accurate food safety analysis available on mobile.
          </p>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/20">
            <Crown className="h-4 w-4 text-primary" />
            <span className="text-[11px] font-medium text-muted-foreground">Trusted by 50,000+ users across India</span>
          </div>
        </div>
      </motion.div>

      {/* ━━━ Contact ━━━ */}
      <motion.div variants={item}>
        <a
          href="mailto:doctorpulseai24@gmail.com?subject=SafeEat%20AI%20Support"
          className="glass-card p-4 flex items-center gap-3 tap-feedback block"
        >
          <div className="p-2 rounded-xl bg-primary/10 shrink-0">
            <Mail className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold">Contact Us</p>
            <p className="text-[11px] text-primary truncate">doctorpulseai24@gmail.com</p>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
        </a>
      </motion.div>

      {/* ━━━ Social Proof ━━━ */}
      <motion.div variants={item}>
        <div className="glass-card p-5 text-center">
          <p className="text-sm font-semibold tracking-wide">
            World's Smartest Food Safety App
          </p>
        </div>
      </motion.div>

      {/* ━━━ Google Play Rating Badge ━━━ */}
      <motion.div variants={item}>
        <div className="glass-card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-safe/10 shrink-0">
              <Star className="h-5 w-5 text-safe fill-safe" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold">Rated on Google Play</p>
              <div className="flex items-center gap-1 mt-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i <= 4 ? 'text-amber-400 fill-amber-400' : 'text-amber-400/40 fill-amber-400/40'}`}
                  />
                ))}
                <span className="text-[11px] font-semibold text-amber-400 ml-1">4.7</span>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] border-safe/30 text-safe">
              10K+ Downloads
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* ━━━ Legal Links ━━━ */}
      <motion.div variants={item}>
        <div className="glass-card divide-y divide-border/20">
          <button
            onClick={() => setCurrentScreen('terms')}
            className="w-full flex items-center gap-3 p-4 hover:bg-muted/20 transition-colors tap-feedback"
          >
            <div className="p-2 rounded-xl bg-muted/40 shrink-0">
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs font-semibold">Terms & Conditions</p>
              <p className="text-[11px] text-muted-foreground">Our terms of service</p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </button>
          <button
            onClick={() => setCurrentScreen('privacy')}
            className="w-full flex items-center gap-3 p-4 hover:bg-muted/20 transition-colors tap-feedback"
          >
            <div className="p-2 rounded-xl bg-muted/40 shrink-0">
              <Globe className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs font-semibold">Privacy Policy</p>
              <p className="text-[11px] text-muted-foreground">How we protect your data</p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </button>
        </div>
      </motion.div>

      {/* ━━━ Footer ━━━ */}
      <motion.div variants={item} className="text-center pt-2">
        <p className="text-[11px] text-muted-foreground/50">
          &copy; 2025 DoctorPulse AI. All rights reserved.
        </p>
      </motion.div>
    </motion.div>
  )
}
