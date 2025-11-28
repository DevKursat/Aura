'use client'

import dynamic from 'next/dynamic'
import { ComponentType, ReactNode } from 'react'
import { Skeleton, SkeletonFortuneCard, SkeletonPost, SkeletonMeditationCard, SkeletonJournalEntry } from '@/components/ui'

// Loading components for different types
function FortuneCardLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <SkeletonFortuneCard key={i} />
      ))}
    </div>
  )
}

function PostLoading() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <SkeletonPost key={i} />
      ))}
    </div>
  )
}

function MeditationLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <SkeletonMeditationCard key={i} />
      ))}
    </div>
  )
}

function JournalLoading() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <SkeletonJournalEntry key={i} />
      ))}
    </div>
  )
}

function ModalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-slate-800 rounded-2xl p-8">
        <Skeleton className="h-6 w-48 mb-4 bg-slate-700" />
        <Skeleton className="h-32 w-full bg-slate-700" />
      </div>
    </div>
  )
}

function GenericLoading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-500 border-t-transparent" />
    </div>
  )
}

// Create lazy loading wrapper with custom loading component
export function createLazyComponent<T extends Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  LoadingComponent: ComponentType = GenericLoading
) {
  return dynamic(importFn, {
    loading: () => <LoadingComponent />,
    ssr: false,
  })
}

// Export loading components for reuse
export {
  FortuneCardLoading,
  PostLoading,
  MeditationLoading,
  JournalLoading,
  ModalLoading,
  GenericLoading,
}
