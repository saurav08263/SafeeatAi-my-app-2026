'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import type { Screen } from '@/lib/store'
import { Home, ScanLine, Clock, User, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs: { id: Screen; icon: typeof Home; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'history', icon: Clock, label: 'History' },
  { id: 'scanner', icon: ScanLine, label: 'Scan' },
  { id: 'premium', icon: Crown, label: 'Premium' },
  { id: 'profile', icon: User, label: 'Profile' },
]

export function BottomNav() {
  const { currentScreen, setCurrentScreen } = useAppStore()

  const isActive = (id: Screen) => {
    if (id === 'scanner') return currentScreen === 'scanner'
    if (id === 'home') return currentScreen === 'home'
    if (id === 'history') return currentScreen === 'history'
    if (id === 'premium') return currentScreen === 'premium' || currentScreen === 'paywall' || currentScreen === 'payment-success'
    if (id === 'profile') return currentScreen === 'profile' || currentScreen === 'notifications' || currentScreen === 'help'
    return currentScreen === id
  }

  return (
    <div className="tab-bar shrink-0">
      <nav className="mx-auto flex max-w-lg items-end justify-around px-1 pt-1.5 pb-1">
        {tabs.map((tab) => {
          const active = isActive(tab.id)
          const Icon = tab.icon
          const isCenter = tab.id === 'scanner'

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentScreen(tab.id)}
              className={cn(
                'relative flex flex-col items-center justify-center transition-all duration-150 tap-feedback',
                isCenter ? 'w-16 h-12' : 'w-14 h-11',
              )}
            >
              {isCenter ? (
                /* Center Scan Button — raised FAB with glow */
                <div className="flex flex-col items-center -mt-5">
                  <div className={cn(
                    'flex items-center justify-center h-14 w-14 rounded-full transition-all duration-300',
                    active
                      ? 'gradient-primary shadow-lg shadow-primary/40 glow-primary'
                      : 'bg-white/10 dark:bg-white/10 bg-muted/50 border border-white/15 dark:border-white/15 border-border/30 shadow-lg shadow-black/20 dark:shadow-black/20 shadow-black/5'
                  )}>
                    <ScanLine
                      className={cn(
                        'w-7 h-7 transition-all duration-200',
                        active ? 'text-primary-foreground' : 'text-muted-foreground'
                      )}
                      strokeWidth={2.2}
                    />
                  </div>
                  <span className={cn(
                    'text-[10px] font-semibold mt-0.5 transition-all',
                    active ? 'text-primary' : 'text-muted-foreground'
                  )}>
                    Scan
                  </span>
                </div>
              ) : (
                /* Regular Tab Items */
                <>
                  <div className="relative flex items-center justify-center">
                    <Icon
                      className={cn(
                        'h-5 w-5 transition-all duration-150',
                        active ? 'text-primary' : 'text-muted-foreground/60'
                      )}
                      strokeWidth={active ? 2.5 : 1.8}
                    />
                    {/* Active indicator — premium glow dot */}
                    {active && (
                      <motion.div
                        layoutId="tab-dot"
                        className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary glow-primary"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </div>
                  <span className={cn(
                    'text-[10px] font-medium mt-0.5 transition-all',
                    active ? 'text-primary' : 'text-muted-foreground/60'
                  )}>
                    {tab.label}
                  </span>
                </>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
