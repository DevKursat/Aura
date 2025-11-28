'use client'

import { motion } from 'framer-motion'
import { useTranslation } from '@/locales'
import { useAuthStore } from '@/stores'
import { FeaturedFortunes } from '@/components/fortunes'
import { Card } from '@/components/ui'
import { CoinBadge } from '@/components/ui/badge'
import { 
  Flame, 
  TrendingUp, 
  Calendar,
  Sparkles,
  Moon,
  BookOpen,
  Gift
} from 'lucide-react'
import Link from 'next/link'
import { zodiacData } from '@/lib/utils'

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const profile = user?.profile

  const zodiac = profile?.zodiac_sign 
    ? zodiacData[profile.zodiac_sign as keyof typeof zodiacData]
    : null

  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t.onboarding.welcome.title.replace('Aura', profile?.full_name?.split(' ')[0] || 'Aura')} 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {t.common.today}: {new Date().toLocaleDateString('tr-TR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </p>
          </div>
          {zodiac && (
            <div className="flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 dark:bg-teal-900/20">
              <span className="text-2xl">{zodiac.emoji}</span>
              <span className="font-medium text-teal-700 dark:text-teal-300">
                {zodiac.name_tr}
              </span>
            </div>
          )}
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {/* Streak */}
          <Card className="flex items-center gap-3 p-4" hoverable>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/20">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {profile?.streak_days || 0}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.meditation.streak}
              </p>
            </div>
          </Card>

          {/* Total Readings */}
          <Card className="flex items-center gap-3 p-4" hoverable>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/20">
              <Sparkles className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {profile?.total_readings || 0}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.profile.stats.readings}
              </p>
            </div>
          </Card>

          {/* Coins */}
          <Link href="/coins">
            <Card className="flex items-center gap-3 p-4" hoverable>
              <CoinBadge amount={profile?.coins || 0} size="lg" showIcon={false} />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.coins.balance}
                </p>
              </div>
            </Card>
          </Link>

          {/* Daily Gift */}
          <Card className="flex items-center gap-3 p-4 bg-gradient-to-br from-teal-500 to-purple-600 text-white" hoverable>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <Gift className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{t.coins.dailyBonus}</p>
              <p className="text-xs text-white/80">+5 coin</p>
            </div>
          </Card>
        </motion.div>

        {/* Daily Horoscope Preview */}
        {zodiac && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/fortunes/horoscope">
              <Card variant="gradient" hoverable className="relative overflow-hidden">
                <div className="absolute right-0 top-0 text-[120px] opacity-10">
                  {zodiac.emoji}
                </div>
                <div className="relative">
                  <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">{t.fortunes.types.horoscope.name}</span>
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                    {zodiac.name_tr} - {t.common.today}
                  </h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-300 line-clamp-2">
                    Bugün için harika enerjiler sizi bekliyor. Yıldızlar yaratıcılığınızı ve 
                    iletişim yeteneklerinizi destekliyor...
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <span className="text-emerald-600 dark:text-emerald-400">⬆ Kariyer</span>
                    <span className="text-rose-500">♥ Aşk: Güçlü</span>
                    <span className="text-amber-500">⭐ Şans: 8/10</span>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.section>
        )}

        {/* Fortune Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FeaturedFortunes />
        </motion.div>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            Hızlı Erişim
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <Link href="/journal">
              <Card className="flex flex-col items-center p-4 text-center" hoverable>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/20">
                  <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.nav.journal}
                </span>
              </Card>
            </Link>

            <Link href="/dreams">
              <Card className="flex flex-col items-center p-4 text-center" hoverable>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/20">
                  <Moon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.nav.dreams}
                </span>
              </Card>
            </Link>

            <Link href="/meditation">
              <Card className="flex flex-col items-center p-4 text-center" hoverable>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/20">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.nav.meditation}
                </span>
              </Card>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
