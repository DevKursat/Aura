import { Skeleton } from '@/components/ui'

export default function SettingsLoading() {
  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Settings Sections */}
        {[1, 2, 3].map((section) => (
          <div key={section} className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <div className="rounded-2xl bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton variant="rounded" className="h-10 w-10" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Logout button */}
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  )
}
