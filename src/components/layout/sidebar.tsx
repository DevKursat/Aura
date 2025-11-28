'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Home,
  Sparkles,
  BookOpen,
  Moon,
  Headphones,
  Users,
  User,
  Settings,
  Crown,
  HelpCircle,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/locales'
import { useAuthStore, useAppStore } from '@/stores'
import { Avatar } from '@/components/ui'
import { CoinBadge, PremiumBadge } from '@/components/ui/badge'

const mainNavItems = [
  { href: '/dashboard', icon: Home, labelKey: 'home' },
  { href: '/fortunes', icon: Sparkles, labelKey: 'fortunes' },
  { href: '/journal', icon: BookOpen, labelKey: 'journal' },
  { href: '/dreams', icon: Moon, labelKey: 'dreams' },
  { href: '/meditation', icon: Headphones, labelKey: 'meditation' },
  { href: '/community', icon: Users, labelKey: 'community' },
] as const

const bottomNavItems = [
  { href: '/profile', icon: User, labelKey: 'profile' },
  { href: '/settings', icon: Settings, labelKey: 'settings' },
] as const

export function Sidebar() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const { user, logout } = useAuthStore()
  const { isSidebarOpen, setSidebarOpen } = useAppStore()

  const profile = user?.profile

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900',
          'md:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6 dark:border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-purple-600">
            <span className="text-lg font-bold text-white">A</span>
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">Aura</span>
        </div>

        {/* User info */}
        {profile && (
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Avatar
                src={profile.avatar_url}
                alt={profile.full_name || 'User'}
                fallback={profile.full_name || undefined}
                size="lg"
              />
              <div className="flex-1 min-w-0">
                <p className="truncate font-semibold text-slate-900 dark:text-white">
                  {profile.full_name || 'User'}
                </p>
                <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                  @{profile.username || 'user'}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <CoinBadge amount={profile.coins} size="sm" />
              {profile.subscription_tier !== 'free' && (
                <PremiumBadge tier={profile.subscription_tier as 'plus' | 'premium'} size="sm" />
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {mainNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              const Icon = item.icon
              const label = t.nav[item.labelKey as keyof typeof t.nav]

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors',
                      isActive
                        ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebarIndicator"
                        className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-teal-600 dark:bg-teal-400"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Upgrade banner */}
          {profile?.subscription_tier === 'free' && (
            <Link
              href="/subscription"
              className="mt-6 block rounded-xl bg-gradient-to-r from-teal-600 to-purple-600 p-4 text-white"
            >
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                <span className="font-semibold">Upgrade to Premium</span>
              </div>
              <p className="mt-1 text-sm text-white/80">
                Unlock unlimited readings & more
              </p>
            </Link>
          )}
        </nav>

        {/* Bottom items */}
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <ul className="space-y-1">
            {bottomNavItems.map((item) => {
              const Icon = item.icon
              const label = t.nav[item.labelKey as keyof typeof t.nav]

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </Link>
                </li>
              )
            })}
            <li>
              <button
                onClick={() => {
                  logout()
                  setSidebarOpen(false)
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-5 w-5" />
                <span>{t.auth.logout}</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  )
}
