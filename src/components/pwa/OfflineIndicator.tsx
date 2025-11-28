'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, Wifi } from 'lucide-react'
import { usePWA } from '@/hooks/usePWA'

export function OfflineIndicator() {
  const { isOnline } = usePWA()

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-amber-950 px-4 py-2"
        >
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <WifiOff className="w-4 h-4" />
            <span>Çevrimdışı mod - Bazı özellikler kullanılamayabilir</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function OnlineIndicator() {
  const { isOnline } = usePWA()

  // Show briefly when coming back online
  return (
    <AnimatePresence>
      {isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ delay: 0.5 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-green-500 text-green-950 px-4 py-2"
        >
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Wifi className="w-4 h-4" />
            <span>Tekrar çevrimiçi</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
