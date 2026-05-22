'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScanLine } from 'lucide-react'
import Image from 'next/image'

interface SplashScreenProps {
  onComplete: () => void
  duration?: number // ms before auto-navigate
}

// ── Animated background particles ────────────────────────────
function FloatingParticle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-primary/20"
      style={{ left: x, top: y, width: size, height: size }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0.3, 0],
        scale: [0, 1, 1.2, 0],
        y: [0, -20, -40],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: 1.5,
        ease: 'easeOut',
      }}
    />
  )
}

// ── Orbiting ring around logo ────────────────────────────────
function OrbitRing({ size, duration, delay, opacity }: { size: number; duration: number; delay: number; opacity: number }) {
  return (
    <motion.div
      className="absolute rounded-full border border-primary"
      style={{
        width: size,
        height: size,
        left: '50%',
        top: '50%',
        marginLeft: -size / 2,
        marginTop: -size / 2,
        opacity,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1, 1],
        opacity: [0, opacity, 0],
        rotate: 360,
      }}
      transition={{
        scale: { duration: 0.8, delay, ease: 'easeOut' },
        opacity: { duration: 2, delay, ease: 'easeOut' },
        rotate: { duration, repeat: Infinity, ease: 'linear' },
      }}
    />
  )
}

// ── Main Splash Screen ───────────────────────────────────────
export function SplashScreen({ onComplete, duration = 2000 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter')

  useEffect(() => {
    // Phase 1: Enter animations (0-500ms)
    const enterTimer = setTimeout(() => setPhase('hold'), 500)

    // Phase 2: Hold - wait then trigger exit
    const exitTimer = setTimeout(() => setPhase('exit'), duration - 600)

    // Phase 3: Exit animation then complete
    const completeTimer = setTimeout(() => {
      setIsVisible(false)
      onComplete()
    }, duration)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(exitTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete, duration])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* ── Layered green glow effects ── */}
          {/* Large central glow */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 400,
              height: 400,
              background: 'radial-gradient(circle, oklch(0.55 0.2 145 / 0.15) 0%, oklch(0.55 0.2 145 / 0.05) 40%, transparent 70%)',
              left: '50%',
              top: '40%',
              marginLeft: -200,
              marginTop: -200,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.2, 1],
              opacity: [0, 1, 0.8],
            }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />

          {/* Secondary glow - slightly offset */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 250,
              height: 250,
              background: 'radial-gradient(circle, oklch(0.55 0.2 145 / 0.12) 0%, transparent 70%)',
              left: '50%',
              top: '42%',
              marginLeft: -125,
              marginTop: -80,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.3, 1.1],
              opacity: [0, 0.8, 0.5],
            }}
            transition={{ duration: 1.8, delay: 0.3, ease: 'easeOut' }}
          />

          {/* Pulsing outer glow */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 500,
              height: 500,
              background: 'radial-gradient(circle, oklch(0.55 0.2 145 / 0.06) 0%, transparent 60%)',
              left: '50%',
              top: '40%',
              marginLeft: -250,
              marginTop: -250,
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* ── Floating particles ── */}
          <FloatingParticle delay={0.5} x="20%" y="30%" size={4} />
          <FloatingParticle delay={0.8} x="75%" y="25%" size={3} />
          <FloatingParticle delay={1.2} x="15%" y="60%" size={5} />
          <FloatingParticle delay={0.3} x="80%" y="55%" size={3} />
          <FloatingParticle delay={1.0} x="35%" y="70%" size={4} />
          <FloatingParticle delay={0.7} x="65%" y="75%" size={3} />
          <FloatingParticle delay={1.5} x="50%" y="20%" size={2} />
          <FloatingParticle delay={0.9} x="90%" y="40%" size={3} />

          {/* ── Logo Section ── */}
          <motion.div
            className="relative mb-10"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.15 }}
          >
            {/* Orbit rings */}
            <OrbitRing size={140} duration={8} delay={0.4} opacity={0.15} />
            <OrbitRing size={170} duration={12} delay={0.6} opacity={0.08} />
            <OrbitRing size={200} duration={16} delay={0.8} opacity={0.04} />

            {/* Main logo container — user's custom logo */}
            <div className="relative">
              <motion.div
                className="h-32 w-32 rounded-[1.75rem] flex items-center justify-center overflow-hidden bg-white"
                style={{ boxShadow: '0 0 60px oklch(0.55 0.2 145 / 0.35), 0 0 120px oklch(0.55 0.2 145 / 0.15)' }}
                animate={{
                  boxShadow: [
                    '0 0 60px oklch(0.55 0.2 145 / 0.35), 0 0 120px oklch(0.55 0.2 145 / 0.15)',
                    '0 0 80px oklch(0.55 0.2 145 / 0.45), 0 0 140px oklch(0.55 0.2 145 / 0.2)',
                    '0 0 60px oklch(0.55 0.2 145 / 0.35), 0 0 120px oklch(0.55 0.2 145 / 0.15)',
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-full h-full"
                >
                  <Image
                    src="/logo.png"
                    alt="SafeEat AI Logo"
                    width={128}
                    height={128}
                    className="w-full h-full object-contain"
                    priority
                  />
                </motion.div>
              </motion.div>

              {/* Inner ring */}
              <motion.div
                className="absolute -inset-3 rounded-[2rem] border border-primary/25"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
              />

              {/* Outer ring */}
              <motion.div
                className="absolute -inset-7 rounded-[2.5rem] border border-primary/10"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </motion.div>

          {/* ── Title & Tagline ── */}
          <motion.div
            className="text-center relative z-10"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: 'easeOut' }}
          >
            {/* App name */}
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              Safe
              <span
                className="bg-gradient-to-r from-primary to-safe bg-clip-text text-transparent"
              >
                Eat
              </span>
              {' '}AI
            </h1>

            {/* Tagline */}
            <motion.p
              className="text-base text-foreground/70 mt-3 font-semibold tracking-wide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              Scan. Check. Eat Safe.
            </motion.p>

            {/* Subtext */}
            <motion.p
              className="text-xs text-muted-foreground mt-1.5 font-medium tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              AI Food Safety Checker
            </motion.p>
          </motion.div>

          {/* ── Loading indicator ── */}
          <motion.div
            className="mt-14 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-primary"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-primary"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-primary"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
            />
          </motion.div>

          {/* ── Progress bar ── */}
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 w-32 h-0.5 rounded-full overflow-hidden"
            style={{ background: 'oklch(0.25 0.02 140)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary via-safe to-primary"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ delay: 1.4, duration: duration / 1000 - 1.4, ease: 'linear' }}
            />
          </motion.div>

          {/* ── Bottom trust badge ── */}
          <motion.div
            className="absolute bottom-6 flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: 'oklch(0.15 0.02 145 / 0.6)', border: '1px solid oklch(0.55 0.2 145 / 0.1)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.5, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <ScanLine className="h-3.5 w-3.5 text-primary" />
            <p className="text-[10px] text-muted-foreground font-medium tracking-wide">
              Medical-grade AI Analysis
            </p>
          </motion.div>

          {/* ── Exit animation overlay ── */}
          {phase === 'exit' && (
            <motion.div
              className="absolute inset-0"
              style={{ background: 'oklch(0.55 0.2 145 / 0.05)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
