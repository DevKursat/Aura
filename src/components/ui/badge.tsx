'use client'

import { cn } from '@/lib/utils'
import { Coins } from 'lucide-react'

interface CoinBadgeProps {
  amount: number
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

export function CoinBadge({ amount, size = 'md', showIcon = true, className }: CoinBadgeProps) {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  const formatAmount = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
    return n.toString()
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 font-semibold text-amber-900',
        sizes[size],
        className
      )}
    >
      {showIcon && <Coins className={iconSizes[size]} />}
      <span>{formatAmount(amount)}</span>
    </div>
  )
}

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'premium'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    premium: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}

interface PremiumBadgeProps {
  tier: 'plus' | 'premium'
  size?: 'sm' | 'md'
}

export function PremiumBadge({ tier, size = 'md' }: PremiumBadgeProps) {
  const tiers = {
    plus: {
      text: 'Plus',
      gradient: 'from-teal-500 to-cyan-500',
    },
    premium: {
      text: 'Premium',
      gradient: 'from-purple-500 to-pink-500',
    },
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-gradient-to-r font-semibold text-white',
        `${tiers[tier].gradient}`,
        sizes[size]
      )}
    >
      ✨ {tiers[tier].text}
    </span>
  )
}
