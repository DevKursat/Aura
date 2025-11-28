'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <svg
      className={cn('animate-spin text-teal-500', sizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

interface LoadingDotsProps {
  className?: string
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-teal-500"
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  )
}

interface LoadingSkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export function LoadingSkeleton({
  className,
  variant = 'text',
  width,
  height,
}: LoadingSkeletonProps) {
  const variants = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200 dark:bg-slate-700',
        variants[variant],
        className
      )}
      style={{ width, height }}
    />
  )
}

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900">
      {/* Logo Animation */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 blur-xl">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 opacity-60" />
          </div>
          {/* Logo */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-purple-600">
            <span className="text-3xl font-bold text-white">A</span>
          </div>
        </div>
      </motion.div>

      {/* Loading indicator */}
      <LoadingDots />

      {/* Message */}
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-slate-400"
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}

// Card skeleton for fortune cards, etc.
export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start gap-4">
        <LoadingSkeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton width="60%" height={20} />
          <LoadingSkeleton width="40%" height={16} />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <LoadingSkeleton />
        <LoadingSkeleton width="80%" />
      </div>
    </div>
  )
}

// Post skeleton for community
export function PostSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-3">
        <LoadingSkeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-1">
          <LoadingSkeleton width={120} height={16} />
          <LoadingSkeleton width={80} height={12} />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton width="60%" />
      </div>
      <div className="mt-4 flex gap-4">
        <LoadingSkeleton width={60} height={24} />
        <LoadingSkeleton width={60} height={24} />
      </div>
    </div>
  )
}
