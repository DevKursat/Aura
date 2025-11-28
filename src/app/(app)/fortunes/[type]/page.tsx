'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from '@/locales'
import { useAuthStore } from '@/stores'
import { Card, Button, LoadingSpinner, Modal } from '@/components/ui'
import { CoinBadge, PremiumBadge } from '@/components/ui/badge'
import { COIN_COSTS, FORTUNE_TYPES } from '@/lib/constants'
import { 
  ArrowLeft, 
  Upload, 
  Camera, 
  Sparkles, 
  Image as ImageIcon,
  X,
  AlertCircle,
  Check
} from 'lucide-react'
import Image from 'next/image'
import type { FortuneType, FortuneReading } from '@/lib/supabase/types'

type FortuneCategory = keyof typeof FORTUNE_TYPES

export default function FortuneDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fortuneType = params.type as FortuneCategory
  const fortuneInfo = FORTUNE_TYPES[fortuneType]

  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [reading, setReading] = useState<FortuneReading | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCoinModal, setShowCoinModal] = useState(false)

  const coinCost = COIN_COSTS[fortuneType as keyof typeof COIN_COSTS] || 0
  const requiresImage = ['coffee', 'palm', 'face'].includes(fortuneType)
  const userCoins = user?.profile?.coins || 0
  const hasEnoughCoins = userCoins >= coinCost

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleGenerateReading = async () => {
    if (!hasEnoughCoins) {
      setShowCoinModal(true)
      return
    }

    if (requiresImage && !uploadedImage) {
      setError(t.common.error)
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('fortuneType', fortuneType)
      formData.append('language', 'tr')
      
      if (uploadedFile) {
        formData.append('image', uploadedFile)
      }

      if (fortuneType === 'horoscope' && user?.profile?.zodiac_sign) {
        formData.append('zodiacSign', user.profile.zodiac_sign)
      }

      if (fortuneType === 'yildizname' && user?.profile?.birth_date) {
        formData.append('birthDate', user.profile.birth_date)
        formData.append('birthTime', user?.profile?.birth_time || '12:00')
        formData.append('birthPlace', user?.profile?.birth_place || 'Istanbul')
      }

      const response = await fetch('/api/fortune/reading', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fal yorumu oluşturulamadı')
      }

      setReading(data.reading)
      setShowResult(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setIsGenerating(false)
    }
  }

  if (!fortuneInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Fal türü bulunamadı</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm dark:bg-slate-800/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {fortuneInfo.emoji} {t.fortunes.types[fortuneType]?.name || fortuneInfo.name_tr}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.fortunes.types[fortuneType]?.description || fortuneInfo.description_tr}
            </p>
          </div>
          <CoinBadge amount={coinCost} />
        </motion.div>

        {/* Upload Section (for image-based fortunes) */}
        <AnimatePresence mode="wait">
          {!showResult && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {requiresImage ? (
                <Card className="relative overflow-hidden p-6">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {uploadedImage ? (
                    <div className="relative">
                      <div className="relative aspect-square overflow-hidden rounded-2xl">
                        <Image
                          src={uploadedImage}
                          alt="Uploaded"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        onClick={() => {
                          setUploadedImage(null)
                          setUploadedFile(null)
                        }}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-16 transition-colors hover:border-teal-400 hover:bg-teal-50/50 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-teal-500 dark:hover:bg-teal-900/20"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                        <Camera className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                      </div>
                      <p className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
                        {fortuneType === 'coffee' && 'Kahve fincanı fotoğrafı yükle'}
                        {fortuneType === 'palm' && 'Avuç içi fotoğrafı yükle'}
                        {fortuneType === 'face' && 'Yüz fotoğrafı yükle'}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Dokunarak fotoğraf çek veya galeriden seç
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      {uploadedImage ? 'Değiştir' : 'Galeri'}
                    </Button>
                    <Button
                      variant="gradient"
                      className="flex-1"
                      onClick={handleGenerateReading}
                      isLoading={isGenerating}
                      disabled={!uploadedImage || isGenerating}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      {t.fortunes.common.startReading}
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="p-6">
                  {/* For non-image fortunes */}
                  <div className="flex flex-col items-center py-8 text-center">
                    <div className="text-6xl">{fortuneInfo.emoji}</div>
                    <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                      {t.fortunes.types[fortuneType]?.name || fortuneInfo.name_tr}
                    </h2>
                    <p className="mt-2 max-w-sm text-slate-500 dark:text-slate-400">
                      {t.fortunes.types[fortuneType]?.description || fortuneInfo.description_tr}
                    </p>

                    {fortuneType === 'tarot' && (
                      <div className="mt-6 grid grid-cols-3 gap-3">
                        {[1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            initial={{ rotateY: 0 }}
                            animate={{ rotateY: [0, 10, -10, 0] }}
                            transition={{ delay: i * 0.2, duration: 2, repeat: Infinity }}
                            className="flex h-32 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg"
                          >
                            <span className="text-2xl">🎴</span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full"
                    onClick={handleGenerateReading}
                    isLoading={isGenerating}
                    disabled={isGenerating}
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    {t.fortunes.common.startReading}
                    <CoinBadge amount={coinCost} className="ml-2" />
                  </Button>
                </Card>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Reading Result */}
          {showResult && reading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="p-6">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <div className="mb-4 flex items-center gap-2">
                    <Check className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {t.fortunes.common.readingReady}
                    </span>
                  </div>
                  <div
                    className="whitespace-pre-wrap text-slate-700 dark:text-slate-300"
                    dangerouslySetInnerHTML={{ __html: reading.reading_text || '' }}
                  />
                </div>

                {reading.generated_image_url && (
                  <div className="mt-6 overflow-hidden rounded-xl">
                    <Image
                      src={reading.generated_image_url}
                      alt="Generated visualization"
                      width={512}
                      height={512}
                      className="w-full"
                    />
                  </div>
                )}
              </Card>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowResult(false)
                    setReading(null)
                    setUploadedImage(null)
                    setUploadedFile(null)
                  }}
                >
                  Yeni Fal
                </Button>
                <Button
                  variant="gradient"
                  className="flex-1"
                  onClick={() => router.push('/fortunes')}
                >
                  Diğer Fallar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <Card className="mx-4 max-w-sm p-8 text-center">
              <LoadingSpinner size="lg" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                {t.fortunes.common.aiAnalyzing}
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {t.fortunes.common.pleaseWait}
              </p>
            </Card>
          </motion.div>
        )}

        {/* Coin Modal */}
        <Modal
          isOpen={showCoinModal}
          onClose={() => setShowCoinModal(false)}
          title={t.coins.insufficientCoins}
        >
          <div className="p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
              <span className="text-3xl">🪙</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
              {t.coins.insufficientCoins}
            </h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Bu fal için <strong>{coinCost} coin</strong> gerekli. 
              Mevcut bakiyeniz: <strong>{userCoins} coin</strong>
            </p>
            <div className="mt-6 space-y-3">
              <Button
                variant="gradient"
                className="w-full"
                onClick={() => router.push('/coins')}
              >
                Coin Satın Al
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowCoinModal(false)}
              >
                Kapat
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
