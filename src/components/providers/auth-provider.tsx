'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore, useAppStore } from '@/stores'
import { Header, Sidebar, BottomNav } from '@/components/layout'
import { LoadingScreen } from '@/components/ui'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const { setUser, setLoading, isLoading, user } = useAuthStore()
  const { hasCompletedOnboarding, theme, setTheme } = useAppStore()

  useEffect(() => {
    const supabase = createClient()

    // Apply theme
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (authUser) {
          // Fetch profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single()

          setUser({
            id: authUser.id,
            email: authUser.email || null,
            profile: profile || null,
          })
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error getting session:', error)
        setUser(null)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          setUser({
            id: session.user.id,
            email: session.user.email || null,
            profile: profile || null,
          })

          // Redirect to onboarding if not completed
          if (!hasCompletedOnboarding) {
            router.push('/onboarding')
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          router.push('/auth/login')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (isLoading) {
    return <LoadingScreen message="Yükleniyor..." />
  }

  return <>{children}</>
}

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <div className="md:ml-72">
        <Header />
        <main className="pb-20 md:pb-6">{children}</main>
        <BottomNav />
      </div>
    </div>
  )
}
