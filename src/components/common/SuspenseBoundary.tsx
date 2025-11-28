'use client'

import { Suspense, ReactNode, ComponentType } from 'react'
import { Skeleton } from '@/components/ui'

interface SuspenseBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

// Default fallback component
function DefaultFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-500 border-t-transparent" />
    </div>
  )
}

// Generic Suspense wrapper
export function SuspenseBoundary({ children, fallback }: SuspenseBoundaryProps) {
  return (
    <Suspense fallback={fallback || <DefaultFallback />}>
      {children}
    </Suspense>
  )
}

// Card grid suspense
export function CardGridSuspense({ children, count = 8 }: { children: ReactNode; count?: number }) {
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(count)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl bg-slate-800" />
          ))}
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

// List suspense
export function ListSuspense({ children, count = 5 }: { children: ReactNode; count?: number }) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          {[...Array(count)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl bg-slate-800" />
          ))}
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

// Feed suspense
export function FeedSuspense({ children, count = 3 }: { children: ReactNode; count?: number }) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          {[...Array(count)].map((_, i) => (
            <div key={i} className="bg-slate-800 rounded-2xl p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" className="h-10 w-10 bg-slate-700" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-slate-700" />
                  <Skeleton className="h-3 w-16 bg-slate-700" />
                </div>
              </div>
              <Skeleton className="h-20 w-full bg-slate-700" />
              <div className="flex gap-4">
                <Skeleton className="h-8 w-16 bg-slate-700" />
                <Skeleton className="h-8 w-16 bg-slate-700" />
              </div>
            </div>
          ))}
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

// Modal suspense
export function ModalSuspense({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-teal-500 border-t-transparent" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

// Page section suspense
export function SectionSuspense({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          {title && <Skeleton className="h-6 w-32 bg-slate-700" />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32 rounded-xl bg-slate-800" />
            <Skeleton className="h-32 rounded-xl bg-slate-800" />
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

// HOC to wrap component with Suspense
export function withSuspense<P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode
) {
  return function SuspenseWrapper(props: P) {
    return (
      <Suspense fallback={fallback || <DefaultFallback />}>
        <Component {...props} />
      </Suspense>
    )
  }
}
