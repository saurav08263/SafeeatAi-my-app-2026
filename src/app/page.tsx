'use client'

import { useAppStore } from '@/lib/store'
import { BottomNav } from '@/components/safeeat/BottomNav'
import { WelcomeScreen } from '@/components/safeeat/WelcomeScreen'
import { TrialScreen } from '@/components/safeeat/TrialScreen'
import { LoginScreen } from '@/components/safeeat/LoginScreen'
import { SignupScreen } from '@/components/safeeat/SignupScreen'
import { HomeScreen } from '@/components/safeeat/HomeScreen'
import { ScannerScreen } from '@/components/safeeat/ScannerScreen'
import { ResultsScreen } from '@/components/safeeat/ResultsScreen'
import { HistoryScreen } from '@/components/safeeat/HistoryScreen'
import { ProfileScreen } from '@/components/safeeat/ProfileScreen'
import { PremiumScreen } from '@/components/safeeat/PremiumScreen'
import { CombinationScreen } from '@/components/safeeat/CombinationScreen'
import { ExpiryScreen } from '@/components/safeeat/ExpiryScreen'
import { MedicineScreen } from '@/components/safeeat/MedicineScreen'
import { PregnancyScreen } from '@/components/safeeat/PregnancyScreen'
import { KidsScreen } from '@/components/safeeat/KidsScreen'
import { GymScreen } from '@/components/safeeat/GymScreen'
import { ChatScreen } from '@/components/safeeat/ChatScreen'
import { PaywallScreen } from '@/components/safeeat/PaywallScreen'
import { PaymentSuccessScreen } from '@/components/safeeat/PaymentSuccessScreen'
import { NotificationsScreen } from '@/components/safeeat/NotificationsScreen'
import { HelpScreen } from '@/components/safeeat/HelpScreen'
import { AboutScreen } from '@/components/safeeat/AboutScreen'
import { ReferScreen } from '@/components/safeeat/ReferScreen'
import { PrivacyPolicyScreen } from '@/components/safeeat/PrivacyPolicyScreen'
import { TermsScreen } from '@/components/safeeat/TermsScreen'
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { SplashScreen } from '@/components/safeeat/SplashScreen'
import { Wifi, Battery, Signal } from 'lucide-react'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

// Screens that should NOT show bottom navigation
const NO_NAV_SCREENS = new Set([
  'splash', 'welcome', 'trial', 'login', 'signup',
  'payment-success', 'paywall'
])

// Fake time for status bar
function getCurrentTime() {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function StatusBar() {
  const [time, setTime] = useState(getCurrentTime())

  useEffect(() => {
    const interval = setInterval(() => setTime(getCurrentTime()), 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="status-bar flex items-center justify-between px-6 py-1.5 text-foreground/80 shrink-0">
      <span className="text-xs font-semibold tabular-nums min-w-[50px]">{time}</span>
      <div className="flex items-center gap-1.5">
        <Signal className="h-3 w-3" />
        <Wifi className="h-3 w-3" />
        <Battery className="h-4 w-3.5" />
      </div>
    </div>
  )
}

function ScreenRenderer() {
  const { currentScreen } = useAppStore()

  const screenMap: Record<string, React.ReactNode> = {
    welcome: <WelcomeScreen />,
    trial: <TrialScreen />,
    login: <LoginScreen />,
    signup: <SignupScreen />,
    home: <HomeScreen />,
    scanner: <ScannerScreen />,
    results: <ResultsScreen />,
    history: <HistoryScreen />,
    profile: <ProfileScreen />,
    premium: <PremiumScreen />,
    combination: <CombinationScreen />,
    expiry: <ExpiryScreen />,
    medicine: <MedicineScreen />,
    pregnancy: <PregnancyScreen />,
    kids: <KidsScreen />,
    gym: <GymScreen />,
    chat: <ChatScreen />,
    paywall: <PaywallScreen />,
    'payment-success': <PaymentSuccessScreen />,
    notifications: <NotificationsScreen />,
    help: <HelpScreen />,
    about: <AboutScreen />,
    refer: <ReferScreen />,
    privacy: <PrivacyPolicyScreen />,
    terms: <TermsScreen />,
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentScreen}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="flex-1 min-h-0"
      >
        {screenMap[currentScreen] || <HomeScreen />}
      </motion.div>
    </AnimatePresence>
  )
}

export default function SafeEatApp() {
  const { setProfile, setScanHistory, currentScreen, setCurrentScreen, hasSeenOnboarding, setHasSeenOnboarding } = useAppStore()
  const [showSplash, setShowSplash] = useState(true)

  // Load initial data
  useEffect(() => {
    const initData = async () => {
      try {
        const profileRes = await fetch('/api/profile')
        const profileData = await profileRes.json()
        if (profileData.success) {
          setProfile(profileData.profile)
        }

        const scansRes = await fetch('/api/scans?limit=50')
        const scansData = await scansRes.json()
        if (scansData.success) {
          setScanHistory(scansData.scans)
        }
      } catch (err) {
        console.error('Failed to load initial data:', err)
      }
    }
    initData()
  }, [setProfile, setScanHistory])

  // Navigate after splash
  useEffect(() => {
    if (!showSplash) {
      if (hasSeenOnboarding) {
        setCurrentScreen('home')
      } else {
        setCurrentScreen('welcome')
        setHasSeenOnboarding(true)
      }
    }
  }, [showSplash, hasSeenOnboarding, setCurrentScreen, setHasSeenOnboarding])

  const showNav = !NO_NAV_SCREENS.has(currentScreen) && !showSplash

  return (
    <>
      {showSplash ? (
        <SplashScreen
          onComplete={() => setShowSplash(false)}
          duration={2000}
        />
      ) : (
        <div className="app-shell">
          {/* Premium Dark Status Bar */}
          <StatusBar />

          {/* Main Content — scrollable */}
          <div className="app-content">
            <ScreenRenderer />
          </div>

          {/* Bottom Tab Bar — frosted glass */}
          {showNav && <BottomNav />}

          {/* Home indicator spacer (iOS style) */}
          {showNav && <div className="home-indicator shrink-0" />}
        </div>
      )}

      {/* PWA Install Prompt — Android & iOS */}
      <PWAInstallPrompt />
    </>
  )
}
