import { Skeleton } from '@/components/ui'

export default function SubscriptionLoading() {
  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-5 w-64 mx-auto" />
        </div>

        {/* Toggle */}
        <div className="flex justify-center">
          <Skeleton className="h-12 w-64 rounded-full" />
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`rounded-3xl p-6 ${i === 2 ? 'bg-gradient-to-br from-teal-500/20 to-purple-500/20 border-2 border-teal-500/30' : 'bg-white dark:bg-slate-800'}`}>
              <div className="text-center space-y-4">
                <Skeleton className="h-6 w-24 mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto" />
                <div className="flex items-end justify-center gap-1">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Skeleton variant="circular" className="h-5 w-5" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-12 w-full mt-6 rounded-xl" />
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32 mx-auto" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl bg-white dark:bg-slate-800 p-4">
              <Skeleton className="h-5 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
