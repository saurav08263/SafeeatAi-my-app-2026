'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SafetyScoreCircleProps {
  score: number
  riskLevel: 'low' | 'medium' | 'high' | 'dangerous'
  size?: number
  strokeWidth?: number
  showLabel?: boolean
  animate?: boolean
}

const riskColors = {
  low: { stroke: '#22c55e', bg: '#22c55e20', text: 'text-safe', glow: '#22c55e40' },
  medium: { stroke: '#eab308', bg: '#eab30820', text: 'text-warn', glow: '#eab30840' },
  high: { stroke: '#f97316', bg: '#f9731620', text: 'text-orange-500', glow: '#f9731640' },
  dangerous: { stroke: '#ef4444', bg: '#ef444420', text: 'text-danger', glow: '#ef444440' },
}

export function SafetyScoreCircle({
  score,
  riskLevel,
  size = 160,
  strokeWidth = 10,
  showLabel = true,
  animate = true,
}: SafetyScoreCircleProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const colors = riskColors[riskLevel]
  const center = size / 2

  const riskLabels = {
    low: 'Safe',
    medium: 'Caution',
    high: 'Risk',
    dangerous: 'Danger',
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Glow effect */}
      <div
        className="absolute rounded-full blur-xl opacity-50"
        style={{
          width: size * 0.8,
          height: size * 0.8,
          backgroundColor: colors.glow,
        }}
      />

      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Score circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animate ? { strokeDashoffset: circumference } : { strokeDashoffset: offset }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={cn('text-4xl font-bold tabular-nums', colors.text)}
          initial={animate ? { opacity: 0, scale: 0.5 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {score}
        </motion.span>
        {showLabel && (
          <motion.span
            className={cn('text-xs font-semibold uppercase tracking-wider mt-0.5', colors.text)}
            initial={animate ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1.2 }}
          >
            {riskLabels[riskLevel]}
          </motion.span>
        )}
      </div>
    </div>
  )
}
