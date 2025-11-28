import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'
type Language = 'tr' | 'en'

interface AppState {
  // Theme
  theme: Theme
  setTheme: (theme: Theme) => void
  
  // Language
  language: Language
  setLanguage: (language: Language) => void
  
  // Onboarding
  hasCompletedOnboarding: boolean
  setOnboardingComplete: (complete: boolean) => void
  
  // UI State
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  
  // Modals
  activeModal: string | null
  setActiveModal: (modal: string | null) => void
  
  // Feature modules loaded
  loadedModules: string[]
  addLoadedModule: (module: string) => void
  isModuleLoaded: (module: string) => boolean
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => {
        set({ theme })
        // Apply theme to document
        if (typeof window !== 'undefined') {
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
        }
      },

      // Language
      language: 'tr',
      setLanguage: (language) => set({ language }),

      // Onboarding
      hasCompletedOnboarding: false,
      setOnboardingComplete: (complete) => set({ hasCompletedOnboarding: complete }),

      // UI State
      isSidebarOpen: false,
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),

      // Modals
      activeModal: null,
      setActiveModal: (modal) => set({ activeModal: modal }),

      // Feature modules
      loadedModules: [],
      addLoadedModule: (module) =>
        set((state) => ({
          loadedModules: state.loadedModules.includes(module)
            ? state.loadedModules
            : [...state.loadedModules, module],
        })),
      isModuleLoaded: (module) => get().loadedModules.includes(module),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        loadedModules: state.loadedModules,
      }),
    }
  )
)
