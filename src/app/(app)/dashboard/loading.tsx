import { SkeletonDashboard } from '@/components/ui'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-4xl">
        <SkeletonDashboard />
      </div>
    </div>
  )
}
