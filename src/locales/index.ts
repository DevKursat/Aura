import tr from './tr'
import en from './en'

export const translations = { tr, en }

export type Language = keyof typeof translations
export type TranslationKeys = typeof tr

export function getTranslation(lang: Language) {
  return translations[lang] || translations.tr
}

// Helper hook for translations
import { useAppStore } from '@/stores'

export function useTranslation() {
  const language = useAppStore((state) => state.language)
  const t = getTranslation(language)
  
  return { t, language }
}
