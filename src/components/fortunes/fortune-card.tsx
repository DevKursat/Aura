'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Coffee, 
  Sparkles as TarotIcon, 
  Hand, 
  Scan, 
  Star, 
  Sun,
  Moon,
  Heart,
  Hash,
  ScrollText
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/locales'
import { COIN_COSTS } from '@/lib/constants'
import { CoinBadge } from '@/components/ui/badge'
import type { FortuneType } from '@/lib/supabase/types'

interface FortuneCardProps {
  type: FortuneType
  hasFreeReading?: boolean
}

const fortuneIcons: Record<FortuneType, React.ElementType> = {
  coffee: Coffee,
  tarot: TarotIcon,
  palm: Hand,
  face: Scan,
  astrology: Star,
  horoscope: Sun,
  yildizname: ScrollText,
  dream: Moon,
  numerology: Hash,
  love_match: Heart,
}

const fortuneColors: Record<FortuneType, { bg: string; icon: string; gradient: string }> = {
  coffee: { 
    bg: 'bg-amber-50 dark:bg-amber-900/20', 
    icon: 'text-amber-600 dark:text-amber-400',
    gradient: 'from-amber-500 to-orange-600'
  },
  tarot: { 
    bg: 'bg-purple-50 dark:bg-purple-900/20', 
    icon: 'text-purple-600 dark:text-purple-400',
    gradient: 'from-purple-500 to-pink-600'
  },
  palm: { 
    bg: 'bg-rose-50 dark:bg-rose-900/20', 
    icon: 'text-rose-600 dark:text-rose-400',
    gradient: 'from-rose-500 to-red-600'
  },
  face: { 
    bg: 'bg-sky-50 dark:bg-sky-900/20', 
    icon: 'text-sky-600 dark:text-sky-400',
    gradient: 'from-sky-500 to-blue-600'
  },
  astrology: { 
    bg: 'bg-indigo-50 dark:bg-indigo-900/20', 
    icon: 'text-indigo-600 dark:text-indigo-400',
    gradient: 'from-indigo-500 to-violet-600'
  },
  horoscope: { 
    bg: 'bg-teal-50 dark:bg-teal-900/20', 
    icon: 'text-teal-600 dark:text-teal-400',
    gradient: 'from-teal-500 to-cyan-600'
  },
  yildizname: { 
    bg: 'bg-violet-50 dark:bg-violet-900/20', 
    icon: 'text-violet-600 dark:text-violet-400',
    gradient: 'from-violet-500 to-purple-600'
  },
  dream: { 
    bg: 'bg-blue-50 dark:bg-blue-900/20', 
    icon: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-500 to-indigo-600'
  },
  numerology: { 
    bg: 'bg-emerald-50 dark:bg-emerald-900/20', 
    icon: 'text-emerald-600 dark:text-emerald-400',
    gradient: 'from-emerald-500 to-green-600'
  },
  love_match: { 
    bg: 'bg-pink-50 dark:bg-pink-900/20', 
    icon: 'text-pink-600 dark:text-pink-400',
    gradient: 'from-pink-500 to-rose-600'
  },
}

export function FortuneCard({ type, hasFreeReading = false }: FortuneCardProps) {
  const { t } = useTranslation()
  const Icon = fortuneIcons[type]
  const colors = fortuneColors[type]
  const cost = COIN_COSTS[type as keyof typeof COIN_COSTS] || 30

  const fortuneInfo = t.fortunes.types[type as keyof typeof t.fortunes.types]

  return (
    <Link href={`/fortunes/${type}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-lg dark:border-slate-700 dark:bg-slate-800',
        )}
      >
        {/* Gradient accent */}
        <div className={cn(
          'absolute left-0 top-0 h-1 w-full bg-gradient-to-r',
          colors.gradient
        )} />

        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
            colors.bg
          )}>
            <Icon className={cn('h-6 w-6', colors.icon)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {fortuneInfo?.name}
              </h3>
              {hasFreeReading ? (
                <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {t.fortunes.common.dailyFree}
                </span>
              ) : (
                <CoinBadge amount={cost} size="sm" />
              )}
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {fortuneInfo?.description}
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

// Grid view of all fortunes
export function FortuneGrid() {
  const fortuneTypes: FortuneType[] = [
    'coffee', 'tarot', 'palm', 'face', 'astrology', 
    'horoscope', 'yildizname', 'dream', 'numerology', 'love_match'
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fortuneTypes.map((type, index) => (
        <motion.div
          key={type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <FortuneCard 
            type={type} 
            hasFreeReading={index === 0} // First reading is free for demo
          />
        </motion.div>
      ))}
    </div>
  )
}

// Featured fortune types for homepage
export function FeaturedFortunes() {
  const { t } = useTranslation()
  const featured: FortuneType[] = ['coffee', 'tarot', 'horoscope', 'dream']

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {t.fortunes.title}
        </h2>
        <Link 
          href="/fortunes" 
          className="text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400"
        >
          {t.common.seeAll}
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {featured.map((type, index) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <FortuneCard type={type} hasFreeReading={index === 0} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
