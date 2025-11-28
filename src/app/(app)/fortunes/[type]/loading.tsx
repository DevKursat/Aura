import { SkeletonReading } from '@/components/ui'

export default function FortuneTypeLoading() {
  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-2xl">
        <SkeletonReading />
      </div>
    </div>
  )
}
