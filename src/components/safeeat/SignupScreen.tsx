'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'

import {
  Shield,
  Loader2,
  Chrome
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { toast } from 'sonner'
import { useState } from 'react'

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth"

import { initFirebase } from "@/lib/firebase"

export function SignupScreen() {

  const { setCurrentScreen, signup } = useAppStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // EMAIL SIGNUP
  const handleSignup = async (e: React.FormEvent) => {

    e.preventDefault()

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)

    try {

      const { auth } = await initFirebase()

      if (!auth) {
        toast.error("Firebase not initialized")
        return
      }

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )

      const user = userCredential.user

      const userProfile = {
        id: user.uid,
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

      signup(userProfile)

      toast.success('Account created!')

      setCurrentScreen('home')

    } catch (error: any) {

      console.log(error)

      toast.error(error.message)

    } finally {

      setIsLoading(false)

    }

  }

  // GOOGLE SIGNUP
  const handleGoogleSignup = async () => {

    try {

      setIsLoading(true)

      const provider = new GoogleAuthProvider()

      const { auth } = await initFirebase()

      if (!auth) {
        toast.error("Firebase not initialized")
        return
      }

      const result =
        await signInWithPopup(auth, provider)

      const user = result.user

      signup({
        id: user.uid,
        name: user.displayName || "Google User",
        email: user.email || "",
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

      toast.success("Google Signup Success")

      setCurrentScreen("home")

    } catch (error: any) {

      console.log(error)

      if (
        error.code !== "auth/cancelled-popup-request"
      ) {
        toast.error(error.message)
      }

    } finally {

      setIsLoading(false)

    }

  }

  return (

    <motion.div
      className="flex flex-col gap-4 px-4 pt-6 pb-6"
    >

      {/* HEADER */}

      <div className="text-center mb-2">

        <div className="inline-flex h-14 w-14 rounded-2xl bg-primary/10 items-center justify-center mb-3">
          <Shield className="h-7 w-7 text-primary" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight">
          Create Account
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Start your food safety journey
        </p>

      </div>

      {/* EMAIL SIGNUP */}

      <Card className="p-4 border-border/50">

        <form
          onSubmit={handleSignup}
          className="space-y-4"
        >

          <div className="space-y-2">

            <Label>Full Name</Label>

            <Input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>

          <div className="space-y-2">

            <Label>Email</Label>

            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>

          <div className="space-y-2">

            <Label>Password</Label>

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >

            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Account'
            )}

          </Button>

        </form>

      </Card>

      {/* GOOGLE SIGNUP */}

      <div className="flex gap-3 mt-2">

        <Button
          variant="outline"
          className="flex-1 h-11 rounded-xl"
          disabled={isLoading}
          onClick={handleGoogleSignup}
        >

          <Chrome className="h-4 w-4 mr-2" />

          Continue with Google

        </Button>

      </div>

      {/* LOGIN LINK */}

      <p className="text-center text-sm text-muted-foreground mt-2">

        Already have an account?{' '}

        <button
          onClick={() => setCurrentScreen('login')}
          className="text-primary font-semibold hover:underline"
        >
          Login
        </button>

      </p>

    </motion.div>

  )

}