'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from '@/locales'
import { Card, Button, Input } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { 
  Mail, 
  ArrowLeft,
  Sparkles,
  CheckCircle
} from 'lucide-react'

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (resetError) throw resetError

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Şifre sıfırlama e-postası gönderilirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">
              E-posta Gönderildi!
            </h1>
            <p className="text-slate-400 mb-6">
              Şifre sıfırlama bağlantısı <strong className="text-white">{email}</strong> adresine gönderildi. 
              Lütfen e-postanızı kontrol edin.
            </p>
            <p className="text-sm text-slate-500 mb-6">
              E-posta gelmedi mi? Spam klasörünü kontrol edin veya birkaç dakika bekleyin.
            </p>
            <Link href="/auth/login">
              <Button variant="gradient" className="w-full">
                Giriş Sayfasına Dön
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-teal-500 to-purple-500 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Şifremi Unuttum</h1>
          <p className="text-slate-400">E-posta adresinize sıfırlama bağlantısı göndereceğiz</p>
        </div>

        {/* Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="pl-12"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
            </Button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link 
              href="/auth/login" 
              className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Giriş sayfasına dön
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
