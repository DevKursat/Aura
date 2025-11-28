'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from '@/locales'
import { useAuthStore } from '@/stores'
import { Card, Button, Input } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock,
  User,
  Sparkles,
  Check
} from 'lucide-react'

export default function RegisterPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { setUser } = useAuthStore()
  const supabase = createClient()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const passwordRequirements = [
    { label: 'En az 8 karakter', met: password.length >= 8 },
    { label: 'Bir büyük harf', met: /[A-Z]/.test(password) },
    { label: 'Bir küçük harf', met: /[a-z]/.test(password) },
    { label: 'Bir rakam', met: /[0-9]/.test(password) },
  ]

  const isPasswordValid = passwordRequirements.every((req) => req.met)
  const passwordsMatch = password === confirmPassword && password.length > 0

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!acceptTerms) {
      setError('Kullanım koşullarını kabul etmelisiniz')
      return
    }

    if (!isPasswordValid) {
      setError('Şifre gereksinimleri karşılanmıyor')
      return
    }

    if (!passwordsMatch) {
      setError('Şifreler eşleşmiyor')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (signUpError) throw signUpError

      if (data.user) {
        // Try to create profile with upsert to handle existing profiles
        try {
          await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              email: data.user.email,
              full_name: fullName,
              coins: 50,
            }, {
              onConflict: 'id'
            })
        } catch (profileErr) {
          console.warn('Profile creation warning:', profileErr)
        }

        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        setUser({
          id: data.user.id,
          email: data.user.email!,
          profile: profile || null,
        })

        router.push('/onboarding')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kayıt olurken bir hata oluştu'
      if (!errorMessage.includes('duplicate') && !errorMessage.includes('already')) {
        setError(errorMessage)
      } else {
        router.push('/auth/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google ile kayıt olurken hata oluştu')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-purple-50 px-4 py-8 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-purple-600">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
            Aura&apos;ya Katıl
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Mistik yolculuğuna başla
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Full Name */}
            <Input
              label={t.auth.fullName}
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ad Soyad"
              icon={<User className="h-5 w-5" />}
              required
            />

            {/* Email */}
            <Input
              label={t.auth.email}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              icon={<Mail className="h-5 w-5" />}
              required
            />

            {/* Password */}
            <div className="relative">
              <Input
                label={t.auth.password}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock className="h-5 w-5" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-10 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Password Requirements */}
            {password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                {passwordRequirements.map((req, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 text-sm ${req.met ? 'text-emerald-600' : 'text-slate-400'}`}
                  >
                    <div className={`flex h-4 w-4 items-center justify-center rounded-full ${req.met ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                      {req.met && <Check className="h-3 w-3" />}
                    </div>
                    {req.label}
                  </div>
                ))}
              </motion.div>
            )}

            {/* Confirm Password */}
            <Input
              label={t.auth.confirmPassword}
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock className="h-5 w-5" />}
              error={confirmPassword.length > 0 && !passwordsMatch ? 'Şifreler eşleşmiyor' : undefined}
              required
            />

            {/* Terms */}
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                <Link href="/terms" className="text-teal-600 hover:underline">Kullanım Koşulları</Link>
                {' '}ve{' '}
                <Link href="/privacy" className="text-teal-600 hover:underline">Gizlilik Politikası</Link>
                &apos;nı okudum ve kabul ediyorum.
              </span>
            </label>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              isLoading={loading}
              disabled={!acceptTerms || !isPasswordValid || !passwordsMatch}
            >
              {t.auth.register}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            <span className="text-sm text-slate-500">{t.auth.or}</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* Social Sign Up */}
          <Button variant="outline" className="w-full" onClick={handleGoogleSignUp}>
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {t.auth.continueWithGoogle}
          </Button>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            {t.auth.haveAccount}{' '}
            <Link href="/auth/login" className="font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400">
              {t.auth.login}
            </Link>
          </p>
        </Card>

        {/* Welcome Bonus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
            🎁 Yeni üyelere 50 coin hediye!
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
