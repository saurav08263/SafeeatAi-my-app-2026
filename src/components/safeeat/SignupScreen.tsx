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

export function SignupScreen() {
  const { setCurrentScreen, signup } = useAppStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    setIsLoading(true)
    try {
      const userProfile = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        allergies: [],
        dietaryRestrictions: [],
        healthGoals: [],
        isPremium: false,
        isTrialUsed: false,
        scanCount: 0,
        authProvider: 'email',
        country: 'IN',
        notificationEnabled: true,
      }

      // Try to create profile on server
      try {
        await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userProfile),
        })
      } catch {
        // Continue even if server is unavailable
      }

      signup(userProfile)
      toast.success('Account created!')
      setCurrentScreen('trial')
    } catch {
      toast.error('Signup failed. Please try again.')
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
        <h1 className="text-2xl font-bold tracking-tight">Create Account</h1>
        <p className="text-sm text-muted-foreground mt-1">Start your food safety journey</p>
      </motion.div>

      {/* Signup Form */}
      <motion.div variants={item}>
        <Card className="p-4 border-border/50">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-medium">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-xs font-medium">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-xs font-medium">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="Create a strong password"
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
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating account...</>
              ) : (
                'Create Account'
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

      {/* Social Signup */}
      <motion.div variants={item} className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 h-11 rounded-xl"
          onClick={() => {
            signup({
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
            setCurrentScreen('trial')
          }}
        >
          <Chrome className="h-4 w-4 mr-2" />
          Google
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-11 rounded-xl"
          onClick={() => {
            signup({
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
            setCurrentScreen('trial')
          }}
        >
          <Smartphone className="h-4 w-4 mr-2" />
          Apple
        </Button>
      </motion.div>

      {/* Login link */}
      <motion.div variants={item} className="text-center pt-2">
        <p className="text-xs text-muted-foreground">
          Already have an account?{' '}
          <button
            onClick={() => setCurrentScreen('login')}
            className="text-primary font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </motion.div>
    </motion.div>
  )
}
