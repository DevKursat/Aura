'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/locales'
import { useAuthStore } from '@/stores'
import { Card, Button, Avatar, Input, Modal } from '@/components/ui'
import { CoinBadge, PremiumBadge } from '@/components/ui/badge'
import { zodiacData } from '@/lib/utils'
import { 
  Edit2, 
  Settings, 
  LogOut, 
  ChevronRight,
  Star,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  BookOpen,
  Moon,
  Crown
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ProfilePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const supabase = createClient()
  
  const profile = user?.profile
  const zodiac = profile?.zodiac_sign 
    ? zodiacData[profile.zodiac_sign as keyof typeof zodiacData]
    : null

  const [showEditModal, setShowEditModal] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [username, setUsername] = useState(profile?.username || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [birthDate, setBirthDate] = useState(profile?.birth_date || '')
  const [birthTime, setBirthTime] = useState(profile?.birth_time || '')
  const [birthPlace, setBirthPlace] = useState(profile?.birth_place || '')
  const [saving, setSaving] = useState(false)

  const handleSaveProfile = async () => {
    if (!user?.id) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          username,
          bio,
          birth_date: birthDate || null,
          birth_time: birthTime || null,
          birth_place: birthPlace || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error
      
      setShowEditModal(false)
      // Refresh profile in store
      window.location.reload()
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await logout()
    router.push('/auth/login')
  }

  const stats = [
    { 
      label: t.profile.stats.readings, 
      value: profile?.total_readings || 0, 
      icon: Sparkles, 
      color: 'text-purple-500' 
    },
    { 
      label: 'Günlük', 
      value: 0, 
      icon: BookOpen, 
      color: 'text-emerald-500' 
    },
    { 
      label: 'Rüya', 
      value: 0, 
      icon: Moon, 
      color: 'text-indigo-500' 
    },
  ]

  const menuItems = [
    { 
      label: t.profile.editProfile, 
      icon: Edit2, 
      onClick: () => setShowEditModal(true) 
    },
    { 
      label: t.nav.settings, 
      icon: Settings, 
      href: '/settings' 
    },
    { 
      label: 'Premium Üyelik', 
      icon: Crown, 
      href: '/subscription' 
    },
  ]

  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t.nav.profile}
          </h1>
          <button
            onClick={() => router.push('/settings')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800"
          >
            <Settings className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="gradient" className="relative overflow-hidden">
            {profile?.subscription_tier !== 'free' && (
              <div className="absolute right-4 top-4">
                <PremiumBadge tier={profile?.subscription_tier as 'plus' | 'premium'} />
              </div>
            )}
            <div className="flex flex-col items-center py-8">
              <Avatar
                src={profile?.avatar_url}
                fallback={profile?.full_name || user?.email || 'User'}
                size="xl"
              />
              <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                {profile?.full_name || 'Kullanıcı'}
              </h2>
              {profile?.username && (
                <p className="text-slate-500 dark:text-slate-400">
                  @{profile.username}
                </p>
              )}
              {profile?.bio && (
                <p className="mt-2 max-w-xs text-center text-sm text-slate-600 dark:text-slate-300">
                  {profile.bio}
                </p>
              )}
              
              {/* Zodiac & Coins */}
              <div className="mt-4 flex items-center gap-4">
                {zodiac && (
                  <div className="flex items-center gap-2 rounded-full bg-white/50 px-4 py-2 dark:bg-slate-800/50">
                    <span className="text-xl">{zodiac.emoji}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {zodiac.name_tr}
                    </span>
                  </div>
                )}
                <CoinBadge amount={profile?.coins || 0} />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 text-center">
              <stat.icon className={`mx-auto h-6 w-6 ${stat.color}`} />
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </Card>
          ))}
        </motion.div>

        {/* Birth Info */}
        {(profile?.birth_date || profile?.birth_place) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4">
              <h3 className="font-medium text-slate-900 dark:text-white">
                Doğum Bilgileri
              </h3>
              <div className="mt-4 space-y-3">
                {profile?.birth_date && (
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <Calendar className="h-5 w-5 text-slate-400" />
                    <span>
                      {new Date(profile.birth_date).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                {profile?.birth_time && (
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <Clock className="h-5 w-5 text-slate-400" />
                    <span>{profile.birth_time}</span>
                  </div>
                )}
                {profile?.birth_place && (
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <MapPin className="h-5 w-5 text-slate-400" />
                    <span>{profile.birth_place}</span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Menu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="divide-y divide-slate-100 dark:divide-slate-800">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick || (() => router.push(item.href!))}
                className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-slate-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </button>
            ))}
          </Card>
        </motion.div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="outline"
            className="w-full text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-5 w-5" />
            {t.profile.signOut}
          </Button>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={t.profile.editProfile}
        size="lg"
      >
        <div className="space-y-6 p-6">
          <Input
            label="Ad Soyad"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ad Soyad"
          />
          <Input
            label="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="kullanici_adi"
          />
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Hakkında
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Kendin hakkında bir şeyler yaz..."
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          
          <div className="border-t border-slate-200 pt-6 dark:border-slate-700">
            <h4 className="mb-4 font-medium text-slate-900 dark:text-white">
              Doğum Bilgileri
            </h4>
            <div className="space-y-4">
              <Input
                label="Doğum Tarihi"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
              <Input
                label="Doğum Saati"
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
              />
              <Input
                label="Doğum Yeri"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                placeholder="İstanbul"
              />
            </div>
          </div>

          <Button
            variant="gradient"
            className="w-full"
            onClick={handleSaveProfile}
            isLoading={saving}
          >
            Kaydet
          </Button>
        </div>
      </Modal>
    </div>
  )
}
