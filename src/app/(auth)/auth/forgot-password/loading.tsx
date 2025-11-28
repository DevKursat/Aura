import { Skeleton } from '@/components/ui'

export default function ForgotPasswordLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Skeleton variant="rounded" className="h-16 w-16 mx-auto mb-4 bg-slate-700" />
          <Skeleton className="h-8 w-48 mx-auto mb-2 bg-slate-700" />
          <Skeleton className="h-4 w-64 mx-auto bg-slate-700" />
        </div>

        {/* Form */}
        <div className="rounded-2xl bg-slate-800/50 p-6 space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-slate-700" />
            <Skeleton className="h-12 w-full rounded-xl bg-slate-700" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl bg-slate-700" />
          <Skeleton className="h-4 w-32 mx-auto bg-slate-700" />
        </div>
      </div>
    </div>
  )
}
