import { SkeletonCommunityFeed, Skeleton, SkeletonAvatar } from '@/components/ui'

export default function CommunityLoading() {
  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>

        {/* Create post card */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-4">
          <div className="flex items-center gap-3">
            <SkeletonAvatar />
            <Skeleton className="h-10 flex-1 rounded-xl" />
          </div>
        </div>

        {/* Feed */}
        <SkeletonCommunityFeed />
      </div>
    </div>
  )
}
