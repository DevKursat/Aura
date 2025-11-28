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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/locales'

const navItems = [
  { href: '/dashboard', icon: Home, labelKey: 'home' },
  { href: '/fortunes', icon: Sparkles, labelKey: 'fortunes' },
  { href: '/journal', icon: BookOpen, labelKey: 'journal' },
  { href: '/dreams', icon: Moon, labelKey: 'dreams' },
  { href: '/meditation', icon: Headphones, labelKey: 'meditation' },
  { href: '/community', icon: Users, labelKey: 'community' },
  { href: '/profile', icon: User, labelKey: 'profile' },
] as const

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useTranslation()

  // Only show on main pages
  const showNav = navItems.some(item => pathname.startsWith(item.href))
  if (!showNav) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/80 md:hidden">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon
          const label = t.nav[item.labelKey as keyof typeof t.nav]

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center px-3 py-2',
                isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-teal-600 dark:bg-teal-400"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon className="h-5 w-5" />
              <span className="mt-0.5 text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
