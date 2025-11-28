'use client'

import { usePathname } from 'next/navigation'
import { Menu, Bell, Coins } from 'lucide-react'
import { useAppStore, useAuthStore } from '@/stores'
import { Avatar } from '@/components/ui'
import { CoinBadge } from '@/components/ui/badge'
import Link from 'next/link'

export function Header() {
  const pathname = usePathname()
  const { setSidebarOpen } = useAppStore()
  const { user } = useAuthStore()

  const profile = user?.profile

  // Don't show header on auth pages
  if (pathname.startsWith('/auth') || pathname.startsWith('/onboarding')) {
    return null
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo for mobile */}
          <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-purple-600">
              <span className="text-sm font-bold text-white">A</span>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">Aura</span>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Coins */}
          {profile && (
            <Link href="/coins">
              <CoinBadge amount={profile.coins} size="md" />
            </Link>
          )}

          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Profile (mobile only) */}
          <Link href="/profile" className="md:hidden">
            <Avatar
              src={profile?.avatar_url}
              alt={profile?.full_name || 'User'}
              fallback={profile?.full_name || undefined}
              size="sm"
            />
          </Link>
        </div>
      </div>
    </header>
  )
}
