'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/locales'
import { useAuthStore } from '@/stores'
import { Card, Button, LoadingSpinner } from '@/components/ui'
import { 
  Play, 
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Clock,
  Flame,
  Heart,
  Leaf,
  Moon,
  Sun,
  Wind,
  Waves
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface MeditationCategory {
  id: string
  name: string
  name_tr: string
  icon: string
  description: string
  color: string
}

interface Meditation {
  id: string
  title: string
  description: string
  duration_minutes: number
  audio_url: string
  cover_image_url: string
  category_id: string
  is_premium: boolean
}

const categoryIcons: Record<string, React.ReactNode> = {
  sleep: <Moon className="h-5 w-5" />,
  stress: <Wind className="h-5 w-5" />,
  focus: <Sun className="h-5 w-5" />,
  anxiety: <Heart className="h-5 w-5" />,
  nature: <Leaf className="h-5 w-5" />,
  water: <Waves className="h-5 w-5" />,
}

const mockCategories: MeditationCategory[] = [
  { id: '1', name: 'Sleep', name_tr: 'Uyku', icon: 'sleep', description: 'Rahat bir uyku için', color: 'from-indigo-500 to-purple-600' },
  { id: '2', name: 'Stress', name_tr: 'Stres', icon: 'stress', description: 'Stresi azalt', color: 'from-teal-500 to-emerald-600' },
  { id: '3', name: 'Focus', name_tr: 'Odaklanma', icon: 'focus', description: 'Konsantrasyonu artır', color: 'from-amber-500 to-orange-600' },
  { id: '4', name: 'Anxiety', name_tr: 'Kaygı', icon: 'anxiety', description: 'Kaygıyı yönet', color: 'from-rose-500 to-pink-600' },
  { id: '5', name: 'Nature', name_tr: 'Doğa', icon: 'nature', description: 'Doğa sesleri', color: 'from-green-500 to-emerald-600' },
  { id: '6', name: 'Water', name_tr: 'Su', icon: 'water', description: 'Su sesleri', color: 'from-blue-500 to-cyan-600' },
]

const mockMeditations: Meditation[] = [
  { id: '1', title: 'Derin Uyku', description: '10 dakikada uykuya dal', duration_minutes: 10, audio_url: '', cover_image_url: '/meditations/sleep1.jpg', category_id: '1', is_premium: false },
  { id: '2', title: 'Stres Atma', description: 'Günlük stresi at', duration_minutes: 15, audio_url: '', cover_image_url: '/meditations/stress1.jpg', category_id: '2', is_premium: false },
  { id: '3', title: 'Sabah Enerjisi', description: 'Güne enerjik başla', duration_minutes: 8, audio_url: '', cover_image_url: '/meditations/focus1.jpg', category_id: '3', is_premium: false },
  { id: '4', title: 'Kaygı Yönetimi', description: 'Kaygıyı kontrol et', duration_minutes: 12, audio_url: '', cover_image_url: '/meditations/anxiety1.jpg', category_id: '4', is_premium: true },
  { id: '5', title: 'Orman Sesleri', description: 'Huzurlu orman', duration_minutes: 20, audio_url: '', cover_image_url: '/meditations/nature1.jpg', category_id: '5', is_premium: false },
  { id: '6', title: 'Yağmur Sesi', description: 'Rahatlatıcı yağmur', duration_minutes: 30, audio_url: '', cover_image_url: '/meditations/water1.jpg', category_id: '6', is_premium: true },
]

export default function MeditationPage() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const audioRef = useRef<HTMLAudioElement>(null)

  const [categories] = useState<MeditationCategory[]>(mockCategories)
  const [meditations] = useState<Meditation[]>(mockMeditations)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentMeditation, setCurrentMeditation] = useState<Meditation | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  const profile = user?.profile
  const streak = profile?.streak_days || 0
  const totalMinutes = 0

  const filteredMeditations = selectedCategory
    ? meditations.filter((m) => m.category_id === selectedCategory)
    : meditations

  const handlePlayMeditation = (meditation: Meditation) => {
    if (meditation.is_premium && profile?.subscription_tier === 'free') {
      alert('Bu meditasyon Premium üyelik gerektirir')
      return
    }
    setCurrentMeditation(meditation)
    setIsPlaying(true)
    // In real app, would play audio
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
    setIsMuted(!isMuted)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t.nav.meditation} 🧘
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              İç huzurunu bul
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4"
        >
          <Card className="p-4 text-center">
            <Flame className="mx-auto h-6 w-6 text-orange-500" />
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {streak}
            </p>
            <p className="text-xs text-slate-500">{t.meditation.streak}</p>
          </Card>
          <Card className="p-4 text-center">
            <Clock className="mx-auto h-6 w-6 text-blue-500" />
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {totalMinutes}
            </p>
            <p className="text-xs text-slate-500">{t.meditation.totalMinutes}</p>
          </Card>
          <Card className="p-4 text-center">
            <Heart className="mx-auto h-6 w-6 text-rose-500" />
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {meditations.length}
            </p>
            <p className="text-xs text-slate-500">{t.meditation.sessions}</p>
          </Card>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            {t.meditation.categories}
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === null
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {t.common.all}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {categoryIcons[category.icon]}
                <span>{category.name_tr}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Meditations Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid gap-4 md:grid-cols-2"
        >
          {filteredMeditations.map((meditation, index) => {
            const category = categories.find((c) => c.id === meditation.category_id)
            return (
              <motion.div
                key={meditation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="cursor-pointer overflow-hidden transition-all hover:shadow-lg"
                  onClick={() => handlePlayMeditation(meditation)}
                  hoverable
                >
                  <div className={`relative h-32 bg-gradient-to-br ${category?.color || 'from-teal-500 to-emerald-600'}`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    {meditation.is_premium && (
                      <div className="absolute right-3 top-3 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-medium text-white">
                        Premium
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {meditation.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {meditation.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {meditation.duration_minutes} dk
                      </span>
                      <span className="flex items-center gap-1">
                        {categoryIcons[category?.icon || 'sleep']}
                        {category?.name_tr}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Daily Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="gradient" className="relative overflow-hidden p-6">
            <div className="absolute right-0 top-0 text-[100px] opacity-10">
              🧘‍♀️
            </div>
            <div className="relative">
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-teal-700 dark:text-teal-300">
                Günün Önerisi
              </span>
              <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
                5 Dakikalık Nefes Egzersizi
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Stresli bir gün mü geçirdin? Bu kısa nefes egzersizi ile rahatla.
              </p>
              <Button variant="gradient" className="mt-4">
                <Play className="mr-2 h-4 w-4" />
                Başla
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Player Bottom Sheet */}
      <AnimatePresence>
        {currentMeditation && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-white shadow-xl dark:bg-slate-900"
          >
            <div className="p-6">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full bg-teal-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-xs text-slate-500">
                  <span>{formatTime((progress / 100) * currentMeditation.duration_minutes * 60)}</span>
                  <span>{currentMeditation.duration_minutes}:00</span>
                </div>
              </div>

              {/* Info */}
              <div className="mb-4 text-center">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {currentMeditation.title}
                </h3>
                <p className="text-sm text-slate-500">{currentMeditation.description}</p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6">
                <button className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                  <SkipBack className="h-6 w-6" />
                </button>
                <button
                  onClick={togglePlayPause}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-500 text-white hover:bg-teal-600"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="ml-1 h-6 w-6" />
                  )}
                </button>
                <button className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                  <SkipForward className="h-6 w-6" />
                </button>
              </div>

              {/* Volume */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={toggleMute}
                  className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setCurrentMeditation(null)
                  setIsPlaying(false)
                }}
                className="mt-4 w-full text-center text-sm text-slate-500 hover:text-slate-700"
              >
                Kapat
              </button>
            </div>

            {/* Hidden Audio Element */}
            <audio
              ref={audioRef}
              src={currentMeditation.audio_url}
              onTimeUpdate={(e) => {
                const audio = e.currentTarget
                setProgress((audio.currentTime / audio.duration) * 100)
              }}
              onLoadedMetadata={(e) => {
                setDuration(e.currentTarget.duration)
              }}
              onEnded={() => {
                setIsPlaying(false)
                setProgress(0)
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
