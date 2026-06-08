'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { ScanLine, Heart, Sparkles, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

export function WelcomeScreen() {
  const { setCurrentScreen } = useAppStore()

  return (
<div className="relative min-h-[100dvh] flex flex-col bg-background">      {/* Green glow effects */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-40 left-10 w-40 h-40 bg-primary/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-safe/10 rounded-full blur-[80px]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10"
      >
        {/* Logo */}
        <motion.div variants={item} className="mb-8">
          <div className="relative">
            <div className="h-24 w-24 rounded-3xl overflow-hidden shadow-2xl shadow-primary/40 bg-white">
              <Image
                src="/logo.png"
                alt="SafeEat AI Logo"
                width={96}
                height={96}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="absolute -inset-3 rounded-[2rem] border border-primary/20 animate-pulse" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div variants={item} className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight">
            Know What&apos;s Safe<br />
            <span className="text-primary">Before You Eat</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-[280px] mx-auto leading-relaxed">
            Prevent food poisoning with AI-powered food safety checking
          </p>
        </motion.div>

        {/* Feature Icons */}
        <motion.div variants={item} className="flex items-center gap-6 mb-10">
          {[
            { icon: ScanLine, label: 'Scan Food', color: 'text-primary' },
            { icon: Heart, label: 'Check Combos', color: 'text-safe' },
            { icon: Sparkles, label: 'AI Doctor', color: 'text-warn' },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className={`h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={item} className="w-full max-w-sm space-y-4">
          <Button
            onClick={() => setCurrentScreen('trial')}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-2xl text-base font-bold shadow-lg shadow-primary/40 animate-pulse-glow relative overflow-hidden"
            size="lg"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5" />
              Start 2 Days Free Trial
            </span>
          </Button>

          <button
            onClick={() => setCurrentScreen('login')}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            Already have an account?{' '}
            <span className="text-primary font-semibold">Login</span>
          </button>
        </motion.div>

        {/* Bottom trust line */}
        <motion.div variants={item} className="mt-8 flex items-center gap-2 text-muted-foreground">
          <ShieldCheck className="h-3 w-3" />
          <span className="text-[10px]">Medical-grade AI analysis</span>
        </motion.div>
      </motion.div>
    </div>
  )
}
