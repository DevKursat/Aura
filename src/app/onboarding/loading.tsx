import { Skeleton } from '@/components/ui'

export default function OnboardingLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Progress bar */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-24 bg-slate-700" />
          <Skeleton className="h-4 w-8 bg-slate-700" />
        </div>
        <Skeleton className="h-2 w-full rounded-full bg-slate-700" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-md space-y-8">
          {/* Title */}
          <div className="text-center">
            <Skeleton variant="circular" className="h-20 w-20 mx-auto mb-6 bg-slate-700" />
            <Skeleton className="h-8 w-64 mx-auto mb-3 bg-slate-700" />
            <Skeleton className="h-5 w-48 mx-auto bg-slate-700" />
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-800/50 flex flex-col items-center gap-3">
                <Skeleton variant="circular" className="h-12 w-12 bg-slate-700" />
                <Skeleton className="h-4 w-20 bg-slate-700" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="px-6 py-8">
        <div className="flex gap-4">
          <Skeleton className="h-12 w-24 rounded-xl bg-slate-700" />
          <Skeleton className="h-12 flex-1 rounded-xl bg-slate-700" />
        </div>
      </div>
    </div>
  )
}
