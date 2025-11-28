'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'circular' | 'rounded' | 'text'
  animation?: 'pulse' | 'wave' | 'none'
  width?: string | number
  height?: string | number
}

export function Skeleton({
  className,
  variant = 'default',
  animation = 'pulse',
  width,
  height,
}: SkeletonProps) {
  const variants = {
    default: 'rounded-md',
    circular: 'rounded-full',
    rounded: 'rounded-xl',
    text: 'rounded',
  }

  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%]',
    none: '',
  }

  return (
    <div
      className={cn(
        'bg-slate-200 dark:bg-slate-700',
        variants[variant],
        animations[animation],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  )
}

// Pre-built skeleton components for common use cases

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar({
  size = 'md',
  className,
}: {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  const sizes = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20',
  }

  return (
    <Skeleton
      variant="circular"
      className={cn(sizes[size], className)}
    />
  )
}

export function SkeletonButton({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizes = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32',
  }

  return (
    <Skeleton
      variant="rounded"
      className={cn(sizes[size], className)}
    />
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl bg-white dark:bg-slate-800 p-4 space-y-4', className)}>
      <div className="flex items-center gap-3">
        <SkeletonAvatar />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-40 w-full rounded-xl" />
      <SkeletonText lines={2} />
      <div className="flex gap-2">
        <SkeletonButton size="sm" />
        <SkeletonButton size="sm" />
      </div>
    </div>
  )
}

export function SkeletonFortuneCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl bg-white dark:bg-slate-800 p-4', className)}>
      <div className="flex items-center gap-3 mb-3">
        <Skeleton variant="rounded" className="h-12 w-12" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton variant="rounded" className="h-6 w-16" />
      </div>
    </div>
  )
}

export function SkeletonPost({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl bg-white dark:bg-slate-800 p-4 space-y-4', className)}>
      <div className="flex items-center gap-3">
        <SkeletonAvatar />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-3 w-1/6" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <div className="flex items-center gap-4 pt-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}

export function SkeletonJournalEntry({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl bg-white dark:bg-slate-800 p-4', className)}>
      <div className="flex items-start gap-3">
        <Skeleton variant="rounded" className="h-10 w-10 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-16" />
          </div>
          <SkeletonText lines={2} />
          <div className="flex gap-2 pt-1">
            <Skeleton variant="rounded" className="h-5 w-12" />
            <Skeleton variant="rounded" className="h-5 w-16" />
            <Skeleton variant="rounded" className="h-5 w-14" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonMeditationCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl bg-white dark:bg-slate-800 overflow-hidden', className)}>
      <Skeleton className="h-32 w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton variant="circular" className="h-8 w-8" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <SkeletonAvatar size="lg" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl bg-white dark:bg-slate-800 p-4 text-center">
            <Skeleton className="h-8 w-12 mx-auto mb-2" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>

      {/* Featured */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-24" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonFortuneCard key={i} />
          ))}
        </div>
      </div>

      {/* Daily Horoscope */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" className="h-16 w-16" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <SkeletonText lines={4} />
      </div>
    </div>
  )
}

export function SkeletonFortuneList() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="grid gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonFortuneCard key={i} />
        ))}
      </div>
    </div>
  )
}

export function SkeletonCommunityFeed() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <SkeletonPost key={i} />
      ))}
    </div>
  )
}

export function SkeletonProfile() {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 text-center">
        <SkeletonAvatar size="xl" className="mx-auto mb-4" />
        <Skeleton className="h-6 w-32 mx-auto mb-2" />
        <Skeleton className="h-4 w-24 mx-auto mb-4" />
        <div className="flex justify-center gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-6 w-8 mx-auto mb-1" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl bg-white dark:bg-slate-800 p-4 text-center">
            <Skeleton variant="circular" className="h-10 w-10 mx-auto mb-2" />
            <Skeleton className="h-6 w-8 mx-auto mb-1" />
            <Skeleton className="h-3 w-12 mx-auto" />
          </div>
        ))}
      </div>

      {/* Menu Items */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 p-4">
            <Skeleton variant="rounded" className="h-10 w-10" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonReading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton variant="rounded" className="h-12 w-12" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Image */}
      <Skeleton className="h-64 w-full rounded-2xl" />

      {/* Content */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        <SkeletonText lines={6} />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <SkeletonButton size="lg" className="flex-1" />
        <SkeletonButton size="lg" className="flex-1" />
      </div>
    </div>
  )
}
