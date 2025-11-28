'use client'

import { motion } from 'framer-motion'
import { useTranslation } from '@/locales'
import { FortuneGrid } from '@/components/fortunes'

export default function FortunesPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t.nav.fortunes} ✨
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            {t.onboarding.steps.interests.subtitle}
          </p>
        </motion.div>

        {/* Fortune Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <FortuneGrid />
        </motion.div>
      </div>
    </div>
  )
}
