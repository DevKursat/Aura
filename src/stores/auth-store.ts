import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Database, SubscriptionTier } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface User {
  id: string
  email: string | null
  profile: Profile | null
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: Profile) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  updateCoins: (amount: number) => void
  updateSubscription: (tier: SubscriptionTier, expiresAt: string | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      setProfile: (profile) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, profile }
            : null,
        })),

      setLoading: (isLoading) => set({ isLoading }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      updateCoins: (amount) =>
        set((state) => {
          if (!state.user?.profile) return state
          return {
            user: {
              ...state.user,
              profile: {
                ...state.user.profile,
                coins: state.user.profile.coins + amount,
              },
            },
          }
        }),

      updateSubscription: (tier, expiresAt) =>
        set((state) => {
          if (!state.user?.profile) return state
          return {
            user: {
              ...state.user,
              profile: {
                ...state.user.profile,
                subscription_tier: tier,
                subscription_expires_at: expiresAt,
              },
            },
          }
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
