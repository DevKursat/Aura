import { Skeleton } from '@/components/ui'

export default function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Skeleton variant="rounded" className="h-16 w-16 mx-auto mb-4 bg-slate-700" />
          <Skeleton className="h-8 w-24 mx-auto mb-2 bg-slate-700" />
          <Skeleton className="h-4 w-48 mx-auto bg-slate-700" />
        </div>

        {/* Form */}
        <div className="rounded-2xl bg-slate-800/50 p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16 bg-slate-700" />
              <Skeleton className="h-12 w-full rounded-xl bg-slate-700" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12 bg-slate-700" />
              <Skeleton className="h-12 w-full rounded-xl bg-slate-700" />
            </div>
          </div>

          <Skeleton className="h-12 w-full rounded-xl bg-slate-700" />

          <div className="flex items-center gap-4">
            <Skeleton className="h-px flex-1 bg-slate-700" />
            <Skeleton className="h-4 w-8 bg-slate-700" />
            <Skeleton className="h-px flex-1 bg-slate-700" />
          </div>

          <div className="flex gap-4">
            <Skeleton className="h-12 flex-1 rounded-xl bg-slate-700" />
            <Skeleton className="h-12 flex-1 rounded-xl bg-slate-700" />
          </div>
        </div>

        {/* Footer */}
        <Skeleton className="h-4 w-48 mx-auto bg-slate-700" />
      </div>
    </div>
  )
}
