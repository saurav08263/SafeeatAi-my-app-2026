'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('SW registered:', reg.scope)

            // Check for updates periodically
            setInterval(() => {
              reg.update()
            }, 60 * 60 * 1000) // every hour

            // Listen for updates
            reg.addEventListener('updatefound', () => {
              const newWorker = reg.installing
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'activated') {
                    // New version available - could show a toast
                    console.log('New SW version activated')
                  }
                })
              }
            })
          })
          .catch((err) => {
            console.log('SW registration failed:', err)
          })
      })
    }
  }, [])

  return null
}
