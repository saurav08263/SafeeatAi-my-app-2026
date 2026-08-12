'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import Select from "react-select"
import countryList from "react-select-country-list"
import { useMemo } from "react"
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
  const countries = useMemo(() => countryList().getData(), [])

type CountryOption = {
  value: string
  label: string
}

const [country, setCountry] = useState<CountryOption | null>(null)

  // EMAIL SIGNUP
  const handleSignup = async (e: React.FormEvent) => {

    e.preventDefault()

    if (
  !name.trim() ||
  !email.trim() ||
  !password.trim() ||
  !country
) {
  toast.error("Please select your country")
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
        country: country?.value || "",
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

  if (!country) {
    toast.error("Please select your country")
    return
  }

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
        country: country?.value || "",
        notificationEnabled: true,
      })

      toast.success("Google Signup Success")

      setCurrentScreen("home")

    } catch (error: any) {

      console.log(error)

      toast.error(error.message)

    } finally {

      setIsLoading(false)

    }

  }

  return (

    <motion.div
      className="flex flex-col gap-4 px-4 pt-6 pb-6"
    >

      <div className="text-center mb-2">

        <div className="inline-flex h-14 w-14 rounded-2xl bg-primary/10 items-center justify-center mb-3">
          <Shield className="h-7 w-7 text-primary" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight">
          CREATE ACCOUNT 
        </h1>

      </div>

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

  <div className="bg-red-500 text-white p-3 rounded">
    COUNTRY TEST
  </div>

  <Select
    options={countries}
    value={country}
    onChange={(value: any) => setCountry(value)}
    isSearchable
    placeholder="Search your country..."
    styles={{
      control: (base) => ({
        ...base,
        backgroundColor: "#0b0b0b",
        borderColor: "#333",
        color: "#fff",
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: "#fff",
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? "#dbeafe" : "#fff",
        color: "#000",
      }),
      singleValue: (base) => ({
        ...base,
        color: "#fff",
      }),
      input: (base) => ({
        ...base,
        color: "#fff",
      }),
      placeholder: (base) => ({
        ...base,
        color: "#888",
      }),
    }}
  />

</div>

<div className="space-y-2">

  <Label>Password</Label>

  <Input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
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
              'CREATE ACCOUNT '
            )}

          </Button>

        </form>

      </Card>

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

    </motion.div>

  )

}
