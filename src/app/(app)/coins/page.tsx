'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/locales'
import { useAuthStore } from '@/stores'
import { Card, Button, Modal } from '@/components/ui'
import { CoinBadge } from '@/components/ui/badge'
import { COIN_PACKAGES, AD_REWARDS, DAILY_BONUSES } from '@/lib/constants'
import { 
  Plus, 
  Gift,
  Video,
  Clock,
  ShoppingCart,
  Check,
  Crown,
  Star,
  Sparkles,
  Zap
} from 'lucide-react'

export default function CoinsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { user } = useAuthStore()
  const profile = user?.profile

  const [loading, setLoading] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [earnedCoins, setEarnedCoins] = useState(0)

  const currentCoins = profile?.coins || 0
  const streak = profile?.streak_days || 0

  // Calculate daily bonus based on streak
  const getDailyBonus = () => {
    if (streak >= 30) return DAILY_BONUSES.day30
    if (streak >= 7) return DAILY_BONUSES.day7
    return DAILY_BONUSES.base
  }

  const handleWatchAd = async () => {
    setLoading('ad')
    try {
      // Simulate ad watching
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      const response = await fetch('/api/coins/ad-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()
      if (data.success) {
        setEarnedCoins(data.coinsEarned)
        setShowSuccessModal(true)
      }
    } catch (error) {
      console.error('Error watching ad:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleDailyBonus = async () => {
    setLoading('daily')
    try {
      const response = await fetch('/api/coins/daily-bonus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()
      if (data.success) {
        setEarnedCoins(data.coinsEarned)
        setShowSuccessModal(true)
      }
    } catch (error) {
      console.error('Error claiming bonus:', error)
    } finally {
      setLoading(null)
    }
  }

  const handlePurchase = async (packageId: string) => {
    setLoading(packageId)
    try {
      // In real app, would integrate with payment provider
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Redirect to payment
      // router.push(`/payment?package=${packageId}`)
      alert('Ödeme sistemi yakında aktif olacak!')
    } catch (error) {
      console.error('Error purchasing:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t.coins.title} 🪙
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Coin kazan ve fallarını aç
          </p>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="gradient" className="relative overflow-hidden p-6">
            <div className="absolute -right-8 -top-8 text-[120px] opacity-10">
              🪙
            </div>
            <div className="relative">
              <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
                {t.coins.balance}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                  {currentCoins.toLocaleString()}
                </span>
                <span className="text-lg text-slate-500">coin</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-full bg-white/50 px-3 py-1 dark:bg-slate-800/50">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {streak} gün seri
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Free Coin Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            Ücretsiz Coin Kazan
          </h2>
          <div className="space-y-4">
            {/* Daily Bonus */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                    <Gift className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {t.coins.dailyBonus}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Her gün +{getDailyBonus()} coin
                    </p>
                  </div>
                </div>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={handleDailyBonus}
                  isLoading={loading === 'daily'}
                >
                  {t.coins.claim}
                </Button>
              </div>
              
              {/* Streak Bonus Info */}
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <Star className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  7+ gün seri: +3 coin | 30+ gün seri: +5 coin bonus
                </span>
              </div>
            </Card>

            {/* Watch Ad */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                    <Video className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {t.coins.watchAd}
                    </h3>
                    <p className="text-sm text-slate-500">
                      +{AD_REWARDS.standard} coin / reklam
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWatchAd}
                  isLoading={loading === 'ad'}
                >
                  İzle
                </Button>
              </div>
            </Card>

            {/* Referral */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-900/30">
                    <Sparkles className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      Arkadaş Davet Et
                    </h3>
                    <p className="text-sm text-slate-500">
                      Her davet için +50 coin
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Davet Et
                </Button>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Coin Packages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            {t.coins.packages}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {COIN_PACKAGES.map((pkg, index) => (
              <Card
                key={pkg.id}
                className={`relative overflow-hidden p-4 ${
                  pkg.popular ? 'ring-2 ring-teal-500' : ''
                }`}
                hoverable
              >
                {pkg.popular && (
                  <div className="absolute right-0 top-0 rounded-bl-xl bg-teal-500 px-3 py-1 text-xs font-medium text-white">
                    Popüler
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">🪙</span>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {pkg.coins.toLocaleString()}
                      </span>
                    </div>
                    {pkg.bonus > 0 && (
                      <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        +{pkg.bonus} bonus
                      </span>
                    )}
                  </div>
                  <Button
                    variant={pkg.popular ? 'gradient' : 'outline'}
                    size="sm"
                    onClick={() => handlePurchase(pkg.id)}
                    isLoading={loading === pkg.id}
                  >
                    {pkg.price_tr}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Premium Upgrade */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="gradient" className="relative overflow-hidden p-6">
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-[80px] opacity-20">
              👑
            </div>
            <div className="relative">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                <span className="font-semibold text-slate-900 dark:text-white">
                  Premium Üyelik
                </span>
              </div>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Sınırsız fal, coin ve özel içerikler için Premium'a geç
              </p>
              <Button
                variant="gradient"
                className="mt-4"
                onClick={() => router.push('/subscription')}
              >
                Premium'a Geç
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      >
        <div className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30"
          >
            <Check className="h-10 w-10 text-emerald-500" />
          </motion.div>
          <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            Tebrikler! 🎉
          </h3>
          <p className="mt-2 text-slate-500">
            <span className="font-semibold text-teal-600">+{earnedCoins} coin</span> kazandın!
          </p>
          <Button
            variant="gradient"
            className="mt-6 w-full"
            onClick={() => setShowSuccessModal(false)}
          >
            Harika!
          </Button>
        </div>
      </Modal>
    </div>
  )
}
