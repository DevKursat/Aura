'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/locales'
import { useAppStore, useAuthStore } from '@/stores'
import { Card, Button, Input, Modal } from '@/components/ui'
import { 
  ChevronRight,
  Globe,
  Moon,
  Sun,
  Bell,
  Shield,
  HelpCircle,
  FileText,
  Mail,
  Trash2,
  LogOut,
  Volume2,
  Vibrate,
  Languages
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { theme, setTheme, language, setLanguage } = useAppStore()
  const { user, logout } = useAuthStore()
  const supabase = createClient()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    daily_horoscope: true,
    fortune_ready: true,
    community: true,
  })
  const [sound, setSound] = useState(true)
  const [haptics, setHaptics] = useState(true)

  const handleDeleteAccount = async () => {
    if (deleteConfirm.toLowerCase() !== 'sil') return

    setDeleting(true)
    try {
      // Delete user data
      await supabase.from('fortune_readings').delete().eq('user_id', user?.id)
      await supabase.from('journal_entries').delete().eq('user_id', user?.id)
      await supabase.from('dream_entries').delete().eq('user_id', user?.id)
      await supabase.from('profiles').delete().eq('id', user?.id)
      
      // Sign out
      await logout()
      router.push('/auth/login')
    } catch (error) {
      console.error('Error deleting account:', error)
    } finally {
      setDeleting(false)
    }
  }

  const settingSections = [
    {
      title: t.settings.appearance,
      items: [
        {
          label: t.settings.theme,
          icon: theme === 'dark' ? Moon : Sun,
          value: theme === 'dark' ? 'Koyu' : theme === 'light' ? 'Açık' : 'Sistem',
          onClick: () => {
            const themes = ['light', 'dark', 'system'] as const
            const currentIndex = themes.indexOf(theme)
            const nextTheme = themes[(currentIndex + 1) % themes.length]
            setTheme(nextTheme)
          },
        },
        {
          label: t.settings.language,
          icon: Languages,
          value: language === 'tr' ? 'Türkçe' : 'English',
          onClick: () => setLanguage(language === 'tr' ? 'en' : 'tr'),
        },
      ],
    },
    {
      title: t.settings.notifications,
      items: [
        {
          label: 'Push Bildirimler',
          icon: Bell,
          isToggle: true,
          value: notifications.push,
          onChange: () => setNotifications({ ...notifications, push: !notifications.push }),
        },
        {
          label: 'E-posta Bildirimleri',
          icon: Mail,
          isToggle: true,
          value: notifications.email,
          onChange: () => setNotifications({ ...notifications, email: !notifications.email }),
        },
        {
          label: 'Günlük Burç Yorumu',
          icon: Bell,
          isToggle: true,
          value: notifications.daily_horoscope,
          onChange: () => setNotifications({ ...notifications, daily_horoscope: !notifications.daily_horoscope }),
        },
      ],
    },
    {
      title: 'Ses ve Titreşim',
      items: [
        {
          label: 'Ses Efektleri',
          icon: Volume2,
          isToggle: true,
          value: sound,
          onChange: () => setSound(!sound),
        },
        {
          label: 'Titreşim',
          icon: Vibrate,
          isToggle: true,
          value: haptics,
          onChange: () => setHaptics(!haptics),
        },
      ],
    },
    {
      title: 'Yasal',
      items: [
        {
          label: t.settings.privacy,
          icon: Shield,
          href: '/privacy',
        },
        {
          label: t.settings.terms,
          icon: FileText,
          href: '/terms',
        },
      ],
    },
    {
      title: 'Destek',
      items: [
        {
          label: t.settings.help,
          icon: HelpCircle,
          href: '/help',
        },
        {
          label: t.settings.contact,
          icon: Mail,
          href: 'mailto:support@auraapp.co',
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t.nav.settings} ⚙️
          </h1>
        </motion.div>

        {/* Setting Sections */}
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <h2 className="mb-3 text-sm font-medium text-slate-500 dark:text-slate-400">
              {section.title}
            </h2>
            <Card className="divide-y divide-slate-100 dark:divide-slate-800">
              {section.items.map((item, index) => (
                <button
                  key={index}
                  onClick={('onClick' in item ? item.onClick : 'onChange' in item ? item.onChange : () => 'href' in item && item.href && router.push(item.href))}
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700">
                      <item.icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {item.label}
                    </span>
                  </div>
                  {'isToggle' in item && item.isToggle ? (
                    <div
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        item.value ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-600'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                          item.value ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {'value' in item && item.value && (
                        <span className="text-sm text-slate-500">{item.value}</span>
                      )}
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    </div>
                  )}
                </button>
              ))}
            </Card>
          </motion.div>
        ))}

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="mb-3 text-sm font-medium text-red-500">
            Tehlikeli Bölge
          </h2>
          <Card className="border-red-200 dark:border-red-900">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex w-full items-center justify-between p-4 text-left text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
                  <Trash2 className="h-5 w-5 text-red-500" />
                </div>
                <span className="font-medium">{t.settings.deleteAccount}</span>
              </div>
              <ChevronRight className="h-5 w-5" />
            </button>
          </Card>
        </motion.div>

        {/* App Version */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-slate-400"
        >
          <p>Aura v1.0.0</p>
          <p className="mt-1">Made with 💜 in Istanbul</p>
        </motion.div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeleteConfirm('')
        }}
        title="Hesabı Sil"
      >
        <div className="p-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <Trash2 className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-center text-lg font-semibold text-slate-900 dark:text-white">
            Hesabınızı silmek istediğinize emin misiniz?
          </h3>
          <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
            Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.
          </p>
          <div className="mt-6">
            <Input
              label='Onaylamak için "SİL" yazın'
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="SİL"
            />
          </div>
          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowDeleteModal(false)
                setDeleteConfirm('')
              }}
            >
              İptal
            </Button>
            <Button
              variant="gradient"
              className="flex-1 bg-red-500 hover:bg-red-600"
              onClick={handleDeleteAccount}
              isLoading={deleting}
              disabled={deleteConfirm.toLowerCase() !== 'sil' || deleting}
            >
              Hesabı Sil
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
