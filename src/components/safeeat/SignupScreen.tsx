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
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth"

import { initFirebase } from "@/lib/firebase"

export function SignupScreen() {

  const { setCurrentScreen, signup } = useAppStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')

  const [confirmationResult, setConfirmationResult] =
    useState<any>(null)

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

  // SEND OTP
  const sendOTP = async () => {

    if (!phone) {
      toast.error("Enter phone number")
      return
    }

    try {

      const { auth } = await initFirebase()

      if (!auth) {
        toast.error("Firebase not initialized")
        return
      }

      // CREATE ONLY ONCE
      if (!(window as any).recaptchaVerifier) {

        ;(window as any).recaptchaVerifier =
          new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            {
              size: "normal"
            }
          )

      }

      const recaptcha =
        (window as any).recaptchaVerifier

      // INDIA FORMAT
      const formattedPhone =
        `+91${phone}`

      const confirmation =
        await signInWithPhoneNumber(
          auth,
          formattedPhone,
          recaptcha
        )

      setConfirmationResult(confirmation)

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

    if (!confirmationResult) {
      toast.error("Send OTP first")
      return
    }

    try {

      const result =
        await confirmationResult.confirm(otp)

      const user = result.user

      signup({
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

      toast.success("Mobile Signup Success")

      setCurrentScreen("home")

    } catch (error: any) {

      console.log(error)

      toast.error(error.message)

    }

  }

  return (

    <motion.div className="flex flex-col gap-4 px-4 pt-6 pb-6">

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
          onClick={async () => {

            const provider =
              new GoogleAuthProvider()

            try {

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

              signup({
                id: user.uid,
                name:
                  user.displayName ||
                  "Google User",

                email:
                  user.email || "",

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

              toast.success(
                "Google Signup Success"
              )

              setCurrentScreen("home")

            } catch (error: any) {

              console.log(error)

              toast.error(error.message)

            }

          }}
        >

          <Chrome className="h-4 w-4 mr-2" />

          Google

        </Button>

      </div>

      {/* MOBILE OTP */}

      <Card className="p-4 border-border/50 mt-2">

        <div className="space-y-4">

          <div className="space-y-2">

            <Label>Mobile Number</Label>

            <Input
              type="tel"
              placeholder="9876543210"
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

            <Label>Enter OTP</Label>

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

        </div>

      </Card>

    </motion.div>

  )

}