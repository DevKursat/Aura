import { SkeletonJournalEntry, Skeleton } from '@/components/ui'

export default function DreamsLoading() {
  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl bg-white dark:bg-slate-800 p-4 text-center">
              <Skeleton variant="circular" className="h-6 w-6 mx-auto mb-2" />
              <Skeleton className="h-7 w-8 mx-auto mb-1" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>

        {/* Filter chips */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>

        {/* Dream Entries */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonJournalEntry key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
