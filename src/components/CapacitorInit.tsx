'use client'

import { useEffect } from 'react'

/**
 * Capacitor initialization component.
 * Loads Capacitor plugins and configures native behavior when running inside the Android app.
 * Must be rendered inside the app layout to ensure native features work on first load.
 */
export function CapacitorInit() {
  useEffect(() => {
    async function initCapacitor() {
      try {
        const { Capacitor } = await import('@capacitor/core')

        // Only run native initialization when actually on a native platform
        if (!Capacitor.isNativePlatform()) return

        console.log('[Capacitor] Running on native platform:', Capacitor.getPlatform())

        // Initialize StatusBar
        try {
          const { StatusBar, Style } = await import('@capacitor/status-bar')
          await StatusBar.setStyle({ style: Style.Dark })
          await StatusBar.setBackgroundColor({ color: '#0a1f0e' })
          console.log('[Capacitor] StatusBar configured')
        } catch {
          console.log('[Capacitor] StatusBar plugin not available')
        }

        // Initialize SplashScreen - hide after app loads
        try {
          const { SplashScreen } = await import('@capacitor/splash-screen')
          await SplashScreen.hide({ fadeOutDuration: 300 })
          console.log('[Capacitor] SplashScreen hidden')
        } catch {
          console.log('[Capacitor] SplashScreen plugin not available')
        }

        // Initialize Network listener
        try {
          const { Network } = await import('@capacitor/network')
          const status = await Network.getStatus()
          console.log('[Capacitor] Network status:', status.connectionType, status.connected)

          Network.addListener('networkStatusChange', (status) => {
            console.log('[Capacitor] Network changed:', status.connectionType, status.connected)
          })
        } catch {
          console.log('[Capacitor] Network plugin not available')
        }

        // Configure keyboard behavior for Android
        if (Capacitor.getPlatform() === 'android') {
          try {
            const { Capacitor } = await import('@capacitor/core')
            // Set up Android-specific back button handling
            document.addEventListener('backbutton', (e: Event) => {
              // Prevent default back button behavior
              e.preventDefault()
              // The app's state management handles navigation
              // Dispatch a custom event that the app can listen to
              window.dispatchEvent(new CustomEvent('capacitor-backbutton'))
            }, false)
            console.log('[Capacitor] Android back button handler registered')
          } catch {
            console.log('[Capacitor] Android back button setup failed')
          }
        }

        console.log('[Capacitor] Native initialization complete')
      } catch {
        // Running on web — Capacitor not available, this is expected
        console.log('[Capacitor] Not running in native environment')
      }
    }

    initCapacitor()
  }, [])

  return null
}
