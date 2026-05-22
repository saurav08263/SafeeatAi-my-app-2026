'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Shield, Chrome, Smartphone, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { useState } from 'react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

export function LoginScreen() {
  const { setCurrentScreen, login } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    setIsLoading(true)
    try {
      // Try to fetch profile from API
      const res = await fetch('/api/profile')
      const data = await res.json()
      if (data.success && data.profile) {
        login(data.profile)
      } else {
        // Mock login
        login({
          id: 'user-1',
          name: email.split('@')[0] || 'User',
          email,
          allergies: [],
          dietaryRestrictions: [],
          healthGoals: [],
          isPremium: false,
          isTrialUsed: false,
          scanCount: 0,
          authProvider: 'email',
          country: 'IN',
          notificationEnabled: true,
        })
      }
      toast.success('Welcome back!')
      setCurrentScreen('home')
    } catch {
      // Mock login on error
      login({
        id: 'user-1',
        name: email.split('@')[0] || 'User',
        email,
        allergies: [],
        dietaryRestrictions: [],
        healthGoals: [],
        isPremium: false,
        isTrialUsed: false,
        scanCount: 0,
        authProvider: 'email',
        country: 'IN',
        notificationEnabled: true,
      })
      toast.success('Welcome back!')
      setCurrentScreen('home')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 px-4 pt-6 pb-6"
    >
      {/* Header */}
      <motion.div variants={item} className="text-center mb-2">
        <div className="inline-flex h-14 w-14 rounded-2xl bg-primary/10 items-center justify-center mb-3">
          <Shield className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
        <p className="text-sm text-muted-foreground mt-1">Login to your SafeEat AI account</p>
      </motion.div>

      {/* Login Form */}
      <motion.div variants={item}>
        <Card className="p-4 border-border/50">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 rounded-xl text-sm font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Logging in...</>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </Card>
      </motion.div>

      {/* Divider */}
      <motion.div variants={item} className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or continue with</span>
        <Separator className="flex-1" />
      </motion.div>

      {/* Social Login */}
      <motion.div variants={item} className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 h-11 rounded-xl"
          onClick={() => {
            login({
              id: 'user-google',
              name: 'Google User',
              email: 'user@gmail.com',
              allergies: [],
              dietaryRestrictions: [],
              healthGoals: [],
              isPremium: false,
              isTrialUsed: false,
              scanCount: 0,
              authProvider: 'google',
              country: 'IN',
              notificationEnabled: true,
            })
            setCurrentScreen('home')
          }}
        >
          <Chrome className="h-4 w-4 mr-2" />
          Google
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-11 rounded-xl"
          onClick={() => {
            login({
              id: 'user-apple',
              name: 'Apple User',
              email: 'user@icloud.com',
              allergies: [],
              dietaryRestrictions: [],
              healthGoals: [],
              isPremium: false,
              isTrialUsed: false,
              scanCount: 0,
              authProvider: 'apple',
              country: 'IN',
              notificationEnabled: true,
            })
            setCurrentScreen('home')
          }}
        >
          <Smartphone className="h-4 w-4 mr-2" />
          Apple
        </Button>
      </motion.div>

      {/* Links */}
      <motion.div variants={item} className="flex flex-col items-center gap-3 pt-2">
        <button className="text-xs text-primary font-medium hover:underline">
          Forgot Password?
        </button>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => setCurrentScreen('signup')}
            className="text-primary font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </motion.div>
    </motion.div>
  )
}
