'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { ChevronLeft, Bell, Lightbulb, Clock, Crown, Shield, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

const notificationCategories = [
  { id: 'daily-tips', label: 'Daily Tips', description: 'Get daily food safety tips', icon: Lightbulb },
  { id: 'expiry-alerts', label: 'Expiry Alerts', description: 'Alerts when food is about to expire', icon: Clock },
  { id: 'premium-reminders', label: 'Premium Reminders', description: 'Reminders about premium features', icon: Crown },
]

const notificationHistory = [
  { icon: Lightbulb, title: 'Daily Tip', message: 'Avoid eating citrus fruits on an empty stomach to prevent acid reflux', time: '2 hours ago', color: 'text-primary' },
  { icon: Shield, title: 'Safety Alert', message: 'New study found harmful additives in common energy drinks', time: '5 hours ago', color: 'text-danger' },
  { icon: Clock, title: 'Expiry Reminder', message: 'Your Amul Milk expires tomorrow!', time: '1 day ago', color: 'text-warn' },
  { icon: Crown, title: 'Premium Feature', message: 'Unlock pregnancy food checker with Premium', time: '2 days ago', color: 'text-primary' },
  { icon: Lightbulb, title: 'Daily Tip', message: 'Drink water 30 minutes before meals for better digestion', time: '3 days ago', color: 'text-primary' },
  { icon: Shield, title: 'Safety Alert', message: 'Check your peanut butter for salmonella risk', time: '4 days ago', color: 'text-danger' },
]

export function NotificationsScreen() {
  const { navigateBack } = useAppStore()
  const [settings, setSettings] = useState<Record<string, boolean>>({
    'daily-tips': true,
    'expiry-alerts': true,
    'premium-reminders': false,
  })

  const toggleSetting = (id: string) => {
    setSettings(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 px-4 pt-4 pb-6"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={navigateBack}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
        </div>
      </motion.div>

      {/* Notification Toggles */}
      <motion.div variants={item}>
        <Card className="border-border/50 divide-y divide-border/30">
          {notificationCategories.map(({ id, label, description, icon: Icon }) => (
            <div key={id} className="flex items-center gap-3 p-4">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-[10px] text-muted-foreground">{description}</p>
              </div>
              <Switch
                checked={settings[id]}
                onCheckedChange={() => toggleSetting(id)}
              />
            </div>
          ))}
        </Card>
      </motion.div>

      {/* Notification History */}
      <motion.div variants={item}>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          Recent Notifications
        </h3>
        <div className="flex flex-col gap-2">
          {notificationHistory.map((notification, i) => {
            const NotifIcon = notification.icon
            return (
              <Card key={i} className="p-3 border-border/50">
                <div className="flex items-start gap-3">
                  <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5', cn('bg-muted/50'))}>
                    <NotifIcon className={cn('h-4 w-4', notification.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold">{notification.title}</p>
                      <span className="text-[9px] text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{notification.message}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}
