'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import {
  Shield,
  Chrome,
  Smartphone,
  Loader2
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { toast } from 'sonner'
import { useState } from 'react'

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth"

import { initFirebase } from "@/lib/firebase"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  },
}

export function LoginScreen() {

  const { setCurrentScreen, login } = useAppStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')

  const [confirmationResult, setConfirmationResult] =
    useState<any>(null)

  // EMAIL LOGIN

  const handleLogin = async (
    e: React.FormEvent
  ) => {

    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill all fields")
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
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        )

      const user = userCredential.user

      login({
        id: user.uid,
        name: user.displayName || "User",
        email: user.email || "",
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

      toast.success("Login Success")

      setCurrentScreen("home")

    } catch (error: any) {

      console.log(error)

      toast.error(error.message)

    } finally {

      setIsLoading(false)

    }

  }

  // GOOGLE LOGIN

  const handleGoogleLogin = async () => {

    try {

      const provider =
        new GoogleAuthProvider()

      const { auth } =
        await initFirebase()

      if (!auth) {
        toast.error("Firebase not initialized")
        return
      }

      const result =
        await signInWithPopup(
          auth,
          provider
        )

      const user = result.user

      login({
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

      toast.success("Google Login Success")

      setCurrentScreen("home")

    } catch (error: any) {

      console.log(error)

      toast.error(error.message)

    }

  }

  // SEND OTP

  const sendOTP = async () => {

    if (!phone) {
      toast.error("Enter phone number")
      return
    }

    try {

      const { auth } =
        await initFirebase()

      if (!auth) {
        toast.error("Firebase not initialized")
        return
      }

      const recaptcha =
        new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {}
        )

      const confirmation =
        await signInWithPhoneNumber(
          auth,
          phone,
          recaptcha
        )

      setConfirmationResult(
        confirmation
      )

      toast.success("OTP Sent")

    } catch (error: any) {

      console.log(error)

      toast.error(error.message)

    }

  }

  // VERIFY OTP

  const verifyOTP = async () => {

    if (!otp) {
      toast.error("Enter OTP")
      return
    }

    try {

      const result =
        await confirmationResult.confirm(
          otp
        )

      const user = result.user

      login({
        id: user.uid,
        name: "Mobile User",
        email: user.phoneNumber || "",
        allergies: [],
        dietaryRestrictions: [],
        healthGoals: [],
        isPremium: false,
        isTrialUsed: false,
        scanCount: 0,
        authProvider: 'phone',
        country: 'IN',
        notificationEnabled: true,
      })

      toast.success(
        "Mobile Login Success"
      )

      setCurrentScreen("home")

    } catch (error: any) {

      console.log(error)

      toast.error(error.message)

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

      <motion.div
        variants={item}
        className="text-center mb-2"
      >

        <div className="inline-flex h-14 w-14 rounded-2xl bg-primary/10 items-center justify-center mb-3">

          <Shield className="h-7 w-7 text-primary" />

        </div>

        <h1 className="text-2xl font-bold tracking-tight">
          Welcome Back
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Login to your SafeEat AI account
        </p>

      </motion.div>

      {/* EMAIL LOGIN */}

      <motion.div variants={item}>

        <Card className="p-4 border-border/50">

          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >

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
                placeholder="Enter password"
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
                  Logging in...
                </>
              ) : (
                'Login'
              )}

            </Button>

          </form>

        </Card>

      </motion.div>

      {/* DIVIDER */}

      <motion.div
        variants={item}
        className="flex items-center gap-3"
      >

        <Separator className="flex-1" />

        <span className="text-xs text-muted-foreground">
          or continue with
        </span>

        <Separator className="flex-1" />

      </motion.div>

      {/* GOOGLE LOGIN */}

      <motion.div
        variants={item}
        className="flex gap-3"
      >

        <Button
          variant="outline"
          className="flex-1 h-11 rounded-xl"
          onClick={handleGoogleLogin}
        >

          <Chrome className="h-4 w-4 mr-2" />
          Google

        </Button>

        <Button
          variant="outline"
          className="flex-1 h-11 rounded-xl"
        >

          <Smartphone className="h-4 w-4 mr-2" />
          Mobile OTP

        </Button>

      </motion.div>

      {/* MOBILE OTP */}

      <Card className="p-4 border-border/50 mt-2 space-y-4">

        <div className="space-y-2">

          <Label>Mobile Number</Label>

          <Input
            type="text"
            placeholder="+919876543210"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />

        </div>

        <Button
          className="w-full"
          onClick={sendOTP}
        >
          Send OTP
        </Button>

        <div className="space-y-2">

          <Label>OTP</Label>

          <Input
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
          />

        </div>

        <Button
          className="w-full"
          onClick={verifyOTP}
        >
          Verify OTP
        </Button>

        <div id="recaptcha-container"></div>

      </Card>

      {/* LINKS */}

      <motion.div
        variants={item}
        className="flex flex-col items-center gap-3 pt-2"
      >

        <button
          className="text-xs text-primary font-medium hover:underline"
          onClick={async () => {

            if (!email) {
              toast.error(
                "Enter your email first"
              )
              return
            }

            try {

              const { auth } =
                await initFirebase()

              if (!auth) {
                toast.error(
                  "Firebase not initialized"
                )
                return
              }

              await sendPasswordResetEmail(
                auth,
                email
              )

              toast.success(
                "Password reset email sent"
              )

            } catch (error: any) {

              toast.error(error.message)

            }

          }}
        >

          Forgot Password?

        </button>

        <p className="text-xs text-muted-foreground">

          Don&apos;t have an account?{' '}

          <button
            onClick={() =>
              setCurrentScreen(
                'signup'
              )
            }
            className="text-primary font-semibold hover:underline"
          >

            Sign Up

          </button>

        </p>

      </motion.div>

    </motion.div>

  )

}