'use client'

import { WifiOff, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui'

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Icon */}
        <div className="relative mx-auto w-32 h-32">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-purple-500/20 rounded-full blur-2xl" />
          <div className="relative w-full h-full flex items-center justify-center bg-slate-800/50 rounded-full border border-slate-700">
            <WifiOff className="w-16 h-16 text-slate-400" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-white">
            Çevrimdışısınız
          </h1>
          <p className="text-slate-400 text-lg">
            İnternet bağlantınız yok gibi görünüyor. Lütfen bağlantınızı kontrol edip tekrar deneyin.
          </p>
        </div>

        {/* Tips */}
        <div className="bg-slate-800/30 rounded-2xl p-6 text-left space-y-3">
          <p className="text-sm font-medium text-slate-300">💡 İpuçları:</p>
          <ul className="text-sm text-slate-400 space-y-2">
            <li>• Wi-Fi veya mobil veri bağlantınızı kontrol edin</li>
            <li>• Uçak modunun kapalı olduğundan emin olun</li>
            <li>• Sayfayı yenileyerek tekrar deneyin</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleRetry}
            variant="gradient"
            size="lg"
            className="flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Tekrar Dene
          </Button>
          <Button
            onClick={handleGoHome}
            variant="secondary"
            size="lg"
            className="flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Ana Sayfa
          </Button>
        </div>

        {/* Cached content notice */}
        <p className="text-xs text-slate-500">
          Daha önce görüntülediğiniz bazı içerikler önbellekte mevcut olabilir.
        </p>
      </div>
    </div>
  )
}
