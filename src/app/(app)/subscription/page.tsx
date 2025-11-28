'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/locales'
import { useAuthStore } from '@/stores'
import { Card, Button, Modal } from '@/components/ui'
import { SUBSCRIPTION_TIERS } from '@/lib/constants'
import { 
  Check,
  Crown,
  Sparkles,
  Star,
  Zap,
  Shield,
  Gift,
  X
} from 'lucide-react'

const features = {
  free: [
    'Günde 1 ücretsiz fal',
    '5 coin günlük bonus',
    'Temel burç yorumları',
    'Reklam destekli',
  ],
  plus: [
    'Günde 5 ücretsiz fal',
    '15 coin günlük bonus',
    'Detaylı burç yorumları',
    'Reklamsız deneyim',
    'Öncelikli destek',
    'AI rüya yorumu',
  ],
  premium: [
    'Sınırsız fal',
    '30 coin günlük bonus',
    'Premium burç yorumları',
    'Reklamsız deneyim',
    'VIP destek',
    'AI rüya yorumu & görsel',
    'Özel topluluk erişimi',
    'Erken erişim özellikler',
    'Yıldızname analizi',
  ],
}

export default function SubscriptionPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { user } = useAuthStore()
  const profile = user?.profile

  const currentTier = profile?.subscription_tier || 'free'
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const tiers = [
    {
      id: 'free',
      name: t.subscription.free,
      icon: Star,
      color: 'from-slate-500 to-slate-600',
      price: { monthly: 0, yearly: 0 },
      features: features.free,
    },
    {
      id: 'plus',
      name: 'Plus',
      icon: Zap,
      color: 'from-teal-500 to-emerald-600',
      price: { monthly: 79.99, yearly: 599.99 },
      features: features.plus,
      popular: true,
    },
    {
      id: 'premium',
      name: t.subscription.premium,
      icon: Crown,
      color: 'from-amber-500 to-orange-600',
      price: { monthly: 149.99, yearly: 999.99 },
      features: features.premium,
    },
  ]

  const handleSubscribe = async (tierId: string) => {
    if (tierId === 'free' || tierId === currentTier) return

    setLoading(true)
    setSelectedTier(tierId)

    try {
      // In real app, would integrate with payment provider
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Simulate successful subscription
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error subscribing:', error)
    } finally {
      setLoading(false)
    }
  }

  const getYearlySavings = (tier: typeof tiers[0]) => {
    if (tier.price.monthly === 0) return 0
    const monthlyTotal = tier.price.monthly * 12
    const savings = monthlyTotal - tier.price.yearly
    return Math.round(savings)
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t.subscription.title} 👑
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Premium özelliklerin kilidini aç
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Aylık
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Yıllık
              <span className="absolute -right-2 -top-2 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                -30%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Subscription Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-4 md:grid-cols-3"
        >
          {tiers.map((tier, index) => {
            const isCurrentTier = currentTier === tier.id
            const savings = getYearlySavings(tier)

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card
                  className={`relative h-full ${
                    tier.popular ? 'ring-2 ring-teal-500' : ''
                  } ${isCurrentTier ? 'border-2 border-teal-500' : ''}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-500 px-4 py-1 text-xs font-medium text-white">
                      En Popüler
                    </div>
                  )}

                  {isCurrentTier && (
                    <div className="absolute right-4 top-4 rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                      Mevcut Plan
                    </div>
                  )}

                  <div className="p-6">
                    {/* Header */}
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tier.color}`}>
                      <tier.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                      {tier.name}
                    </h3>

                    {/* Price */}
                    <div className="mt-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">
                          {tier.price[billingCycle] === 0
                            ? 'Ücretsiz'
                            : `₺${tier.price[billingCycle].toLocaleString()}`}
                        </span>
                        {tier.price[billingCycle] > 0 && (
                          <span className="text-slate-500">
                            /{billingCycle === 'monthly' ? 'ay' : 'yıl'}
                          </span>
                        )}
                      </div>
                      {billingCycle === 'yearly' && savings > 0 && (
                        <p className="mt-1 text-sm text-emerald-600">
                          ₺{savings} tasarruf
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="mt-6 space-y-3">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Button */}
                    <Button
                      variant={tier.id === 'free' ? 'outline' : 'gradient'}
                      className={`mt-6 w-full ${
                        tier.id === 'premium'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'
                          : ''
                      }`}
                      onClick={() => handleSubscribe(tier.id)}
                      isLoading={loading && selectedTier === tier.id}
                      disabled={isCurrentTier || tier.id === 'free'}
                    >
                      {isCurrentTier
                        ? 'Mevcut Plan'
                        : tier.id === 'free'
                        ? 'Mevcut'
                        : t.subscription.subscribe}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            Sık Sorulan Sorular
          </h2>
          <div className="space-y-4">
            <Card className="p-4">
              <h4 className="font-medium text-slate-900 dark:text-white">
                İstediğim zaman iptal edebilir miyim?
              </h4>
              <p className="mt-2 text-sm text-slate-500">
                Evet! Aboneliğinizi istediğiniz zaman ayarlardan iptal edebilirsiniz. 
                İptal sonrası dönem sonuna kadar erişiminiz devam eder.
              </p>
            </Card>
            <Card className="p-4">
              <h4 className="font-medium text-slate-900 dark:text-white">
                Ödeme yöntemleri nelerdir?
              </h4>
              <p className="mt-2 text-sm text-slate-500">
                Kredi/banka kartı, Apple Pay, Google Pay ile ödeme yapabilirsiniz.
              </p>
            </Card>
            <Card className="p-4">
              <h4 className="font-medium text-slate-900 dark:text-white">
                Coinlerim ne olur?
              </h4>
              <p className="mt-2 text-sm text-slate-500">
                Mevcut coinleriniz korunur. Premium ile günlük bonus miktarınız artar.
              </p>
            </Card>
          </div>
        </motion.div>

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h4 className="font-medium text-emerald-800 dark:text-emerald-300">
                7 Gün Para İade Garantisi
              </h4>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Memnun kalmazsanız ilk 7 gün içinde tam iade
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          router.push('/dashboard')
        }}
      >
        <div className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500"
          >
            <Crown className="h-10 w-10 text-white" />
          </motion.div>
          <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            Premium'a Hoş Geldin! 🎉
          </h3>
          <p className="mt-2 text-slate-500">
            Artık tüm premium özelliklere erişebilirsin!
          </p>
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-center gap-2 text-emerald-600">
              <Check className="h-5 w-5" />
              <span>Sınırsız fal aktif</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-emerald-600">
              <Check className="h-5 w-5" />
              <span>Reklamsız deneyim</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-emerald-600">
              <Check className="h-5 w-5" />
              <span>Günlük +30 coin</span>
            </div>
          </div>
          <Button
            variant="gradient"
            className="mt-6 w-full bg-gradient-to-r from-amber-500 to-orange-600"
            onClick={() => {
              setShowSuccessModal(false)
              router.push('/dashboard')
            }}
          >
            Keşfetmeye Başla
          </Button>
        </div>
      </Modal>
    </div>
  )
}
