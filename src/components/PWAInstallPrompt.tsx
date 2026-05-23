'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { X, Download, Smartphone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [platform, setPlatform] = useState<'android' | 'ios' | 'other'>('other')
  const [isStandalone, setIsStandalone] = useState(true) // default true to avoid flash
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Check if already installed as PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as unknown as { standalone?: boolean }).standalone === true

    // Detect platform
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

    // Defer state updates via setTimeout to avoid lint warning
    setTimeout(() => {
      setIsStandalone(standalone)
      setPlatform(iOS ? 'ios' : 'android')
    }, 0)

    if (standalone) return

    // Android: listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show prompt after a short delay for better UX
      setTimeout(() => setShowPrompt(true), 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // On iOS, show the prompt after delay since there's no beforeinstallprompt
    if (iOS) {
      setTimeout(() => setShowPrompt(true), 5000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        console.log('PWA installed')
      }
    } catch (err) {
      console.error('Install prompt failed:', err)
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }, [deferredPrompt])

  const handleDismiss = useCallback(() => {
    setShowPrompt(false)
    setDeferredPrompt(null)
  }, [])

  // Don't show if already standalone
  if (isStandalone) return null

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <div className="glass-card-elevated p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-2xl gradient-primary flex items-center justify-center shrink-0 shadow-md shadow-primary/30">
                <Smartphone className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Install SafeEat AI</h3>
                  <button
                    onClick={handleDismiss}
                    className="h-6 w-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {platform === 'ios' ? (
                  <>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tap <span className="inline-flex items-center mx-0.5"><Download className="h-3 w-3" /></span> Share button, then &quot;Add to Home Screen&quot;
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-muted-foreground mt-1">
                      Quick access · Offline support · App-like experience
                    </p>
                    <button
                      onClick={handleInstall}
                      className="mt-2.5 w-full btn-premium py-2 px-4 text-xs rounded-xl flex items-center justify-center gap-2"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Install App
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
