import { Skeleton } from '@/components/ui'

export default function CoinsLoading() {
  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Balance Card */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-center">
          <Skeleton className="h-4 w-20 mx-auto mb-2 bg-slate-700" />
          <Skeleton className="h-12 w-32 mx-auto mb-4 bg-slate-700" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-10 w-24 rounded-xl bg-slate-700" />
            <Skeleton className="h-10 w-24 rounded-xl bg-slate-700" />
          </div>
        </div>

        {/* Daily Bonus */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton variant="rounded" className="h-12 w-12" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        </div>

        {/* Watch Ad */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton variant="rounded" className="h-12 w-12" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        </div>

        {/* Coin Packages */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl bg-white dark:bg-slate-800 p-4">
                <Skeleton className="h-8 w-16 mx-auto mb-2" />
                <Skeleton className="h-6 w-20 mx-auto mb-3" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
