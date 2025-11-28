'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/locales'
import { useAuthStore, useAppStore } from '@/stores'
import { Button, Card, Input } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { zodiacData } from '@/lib/utils'
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Calendar,
  MapPin,
  Clock,
  Check,
  Star
} from 'lucide-react'

const steps = [
  { id: 'welcome', title: 'Hoş Geldin' },
  { id: 'interests', title: 'İlgi Alanların' },
  { id: 'birth', title: 'Doğum Bilgilerin' },
  { id: 'zodiac', title: 'Burcun' },
  { id: 'complete', title: 'Tamamlandı' },
]

const fortuneTypes = [
  { id: 'coffee', emoji: '☕', name: 'Kahve Falı' },
  { id: 'tarot', emoji: '🎴', name: 'Tarot' },
  { id: 'horoscope', emoji: '⭐', name: 'Günlük Burç' },
  { id: 'palm', emoji: '✋', name: 'El Falı' },
  { id: 'dreams', emoji: '🌙', name: 'Rüya Yorumu' },
  { id: 'astrology', emoji: '🪐', name: 'Astroloji' },
  { id: 'meditation', emoji: '🧘', name: 'Meditasyon' },
  { id: 'numerology', emoji: '🔢', name: 'Numeroloji' },
]

const zodiacSigns = Object.entries(zodiacData).map(([key, value]) => ({
  id: key,
  ...value,
}))

export default function OnboardingPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const { setOnboardingComplete } = useAppStore()
  const supabase = createClient()

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [birthPlace, setBirthPlace] = useState('')
  const [selectedZodiac, setSelectedZodiac] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    )
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          birth_date: birthDate || null,
          birth_time: birthTime || null,
          birth_place: birthPlace || null,
          zodiac_sign: selectedZodiac || null,
          interests: selectedInterests,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id)

      if (error) throw error

      // Refresh profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (profile && user) {
        setUser({ ...user, profile })
      }

      setOnboardingComplete(true)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error completing onboarding:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-500 to-purple-600">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
              {t.onboarding.welcome.title}
            </h1>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              {t.onboarding.welcome.subtitle}
            </p>
            <div className="mt-8 space-y-4">
              {[
                { emoji: '🔮', text: 'Kahve, tarot ve daha fazla fal türü' },
                { emoji: '🌙', text: 'Rüyalarını yorumla ve görselleştir' },
                { emoji: '🧘', text: 'Meditasyon ve huzur' },
                { emoji: '👥', text: 'Toplulukla deneyim paylaş' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800"
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-slate-700 dark:text-slate-300">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )

      case 'interests':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t.onboarding.steps.interests.title}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {t.onboarding.steps.interests.subtitle}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {fortuneTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => toggleInterest(type.id)}
                  className={`flex flex-col items-center rounded-2xl border-2 p-4 transition-all ${
                    selectedInterests.includes(type.id)
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800'
                  }`}
                >
                  <span className="text-3xl">{type.emoji}</span>
                  <span className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {type.name}
                  </span>
                  {selectedInterests.includes(type.id) && (
                    <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )

      case 'birth':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t.onboarding.steps.birthInfo.title}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {t.onboarding.steps.birthInfo.subtitle}
            </p>
            <div className="mt-8 space-y-6">
              <Input
                label={t.onboarding.steps.birthInfo.birthDate}
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                icon={<Calendar className="h-5 w-5" />}
              />
              <Input
                label={t.onboarding.steps.birthInfo.birthTime}
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                icon={<Clock className="h-5 w-5" />}
              />
              <Input
                label={t.onboarding.steps.birthInfo.birthPlace}
                type="text"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                placeholder="İstanbul"
                icon={<MapPin className="h-5 w-5" />}
              />
            </div>
            <p className="mt-6 text-center text-sm text-slate-400">
              Bu bilgiler daha kişiselleştirilmiş deneyim sunar
            </p>
          </motion.div>
        )

      case 'zodiac':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t.onboarding.steps.zodiac.title}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {t.onboarding.steps.zodiac.subtitle}
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {zodiacSigns.map((sign) => (
                <button
                  key={sign.id}
                  onClick={() => setSelectedZodiac(sign.id)}
                  className={`relative flex flex-col items-center rounded-xl border-2 p-3 transition-all ${
                    selectedZodiac === sign.id
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800'
                  }`}
                >
                  <span className="text-2xl">{sign.emoji}</span>
                  <span className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {sign.name_tr}
                  </span>
                  <span className="text-[10px] text-slate-400">{sign.dates_tr}</span>
                  {selectedZodiac === sign.id && (
                    <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )

      case 'complete':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500"
            >
              <Check className="h-12 w-12 text-white" />
            </motion.div>
            <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
              {t.onboarding.complete.title}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {t.onboarding.complete.subtitle}
            </p>

            {/* Summary */}
            <div className="mt-8 space-y-3 text-left">
              {selectedZodiac && (
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                  <span className="text-2xl">
                    {zodiacSigns.find((z) => z.id === selectedZodiac)?.emoji}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {zodiacSigns.find((z) => z.id === selectedZodiac)?.name_tr}
                  </span>
                </div>
              )}
              {selectedInterests.length > 0 && (
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                  <p className="text-sm text-slate-500">İlgi Alanların</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedInterests.map((interest) => {
                      const type = fortuneTypes.find((t) => t.id === interest)
                      return (
                        <span
                          key={interest}
                          className="rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
                        >
                          {type?.emoji} {type?.name}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bonus */}
            <Card className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 p-4 dark:from-amber-900/20 dark:to-orange-900/20">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">🎁</span>
                <span className="font-medium text-amber-700 dark:text-amber-300">
                  50 coin hoş geldin hediyesi hesabına eklendi!
                </span>
              </div>
            </Card>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-teal-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Progress */}
      <div className="fixed left-0 right-0 top-0 z-50 bg-white/80 backdrop-blur-lg dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 disabled:opacity-50 dark:bg-slate-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          {/* Step indicators */}
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full transition-colors ${
                  index <= currentStep
                    ? 'bg-teal-500'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            {t.onboarding.skip}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg dark:bg-slate-900/80">
        <div className="mx-auto max-w-lg px-4 py-4">
          {currentStep < steps.length - 1 ? (
            <Button
              variant="gradient"
              size="lg"
              className="w-full"
              onClick={handleNext}
            >
              {t.onboarding.next}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="gradient"
              size="lg"
              className="w-full"
              onClick={handleComplete}
              isLoading={loading}
            >
              {t.onboarding.complete.button}
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
