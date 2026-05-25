'use client'

import { useEffect, useState, useCallback } from 'react'

// Capacitor plugin types
interface CapacitorPlugin {
  addEventListener?: (eventName: string, handler: (...args: any[]) => void) => void
  removeEventListener?: (eventName: string, handler: (...args: any[]) => void) => void
}

interface NetworkStatus {
  connected: boolean
  connectionType: string
}

interface CapacitorPlatform {
  isNative: boolean
  platform: 'web' | 'android' | 'ios'
}

// Lazy-loaded plugin references
let _network: any = null
let _haptics: any = null
let _splashScreen: any = null
let _statusBar: any = null
let _camera: any = null
let _share: any = null
let _filesystem: any = null

async function loadPlugin(pluginName: string) {
  if (typeof window === 'undefined') return null
  try {
    const mod = await import(`@capacitor/${pluginName}`)
    const className = pluginName.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')
    return mod[className] || null
  } catch {
    return null
  }
}

export function useCapacitor() {
  const [platform, setPlatform] = useState<CapacitorPlatform>({
    isNative: false,
    platform: 'web',
  })
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    connected: true,
    connectionType: 'unknown',
  })

  useEffect(() => {
    async function init() {
      try {
        const { Capacitor } = await import('@capacitor/core')
        setPlatform({
          isNative: Capacitor.isNativePlatform(),
          platform: Capacitor.getPlatform() as CapacitorPlatform['platform'],
        })

        // Load and configure plugins
        _network = await loadPlugin('network')
        _haptics = await loadPlugin('haptics')
        _splashScreen = await loadPlugin('splash-screen')
        _statusBar = await loadPlugin('status-bar')

        // Setup network listener
        if (_network) {
          const status = await _network.getStatus()
          setNetworkStatus(status)

          _network.addListener('networkStatusChange', (status: NetworkStatus) => {
            setNetworkStatus(status)
          })
        }

        // Hide splash screen after app loads
        if (_splashScreen) {
          await _splashScreen.hide({ fadeOutDuration: 300 })
        }

        // Configure status bar
        if (_statusBar && Capacitor.isNativePlatform()) {
          await _statusBar.setStyle({ style: 'DARK' })
          await _statusBar.setBackgroundColor({ color: '#0a1f0e' })
        }
      } catch (err) {
        // Running on web — Capacitor not available
        console.log('Capacitor not available:', err)
      }
    }
    init()
  }, [])

  // Haptic feedback
  const hapticImpact = useCallback(async (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (!_haptics) _haptics = await loadPlugin('haptics')
    if (_haptics) {
      try {
        await _haptics.impact({ style: style.toUpperCase() })
      } catch { /* ignore */ }
    }
  }, [])

  const hapticNotification = useCallback(async (type: 'success' | 'warning' | 'error' = 'success') => {
    if (!_haptics) _haptics = await loadPlugin('haptics')
    if (_haptics) {
      try {
        await _haptics.notification({ type: type.toUpperCase() })
      } catch { /* ignore */ }
    }
  }, [])

  const hapticSelection = useCallback(async () => {
    if (!_haptics) _haptics = await loadPlugin('haptics')
    if (_haptics) {
      try {
        await _haptics.selectionStart()
        await _haptics.selectionChanged()
        await _haptics.selectionEnd()
      } catch { /* ignore */ }
    }
  }, [])

  return {
    platform,
    networkStatus,
    hapticImpact,
    hapticNotification,
    hapticSelection,
    isNative: platform.isNative,
    isAndroid: platform.platform === 'android',
    isWeb: platform.platform === 'web',
  }
}
