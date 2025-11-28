'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui'
import { usePWA } from '@/hooks/usePWA'

export function InstallPrompt() {
  const { isInstallable, isInstalled, install } = usePWA()
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Show prompt after a delay if installable
    if (isInstallable && !isInstalled && !isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 5000) // Show after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [isInstallable, isInstalled, isDismissed])

  const handleInstall = async () => {
    const success = await install()
    if (success) {
      setIsVisible(false)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    // Store in localStorage to not show again for a while
    localStorage.setItem('installPromptDismissed', Date.now().toString())
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50"
      >
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-700">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white mb-1">
                Aura&apos;yı Yükle
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Daha hızlı erişim ve çevrimdışı kullanım için uygulamayı ana ekranına ekle.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleInstall}
                  variant="gradient"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Yükle
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  size="sm"
                >
                  Daha Sonra
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
