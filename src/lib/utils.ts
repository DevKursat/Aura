import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, locale: string = 'tr'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(date: Date | string, locale: string = 'tr'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTime(date: Date | string, locale: string = 'tr'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (locale === 'tr') {
    if (minutes < 1) return 'Az önce'
    if (minutes < 60) return `${minutes} dakika önce`
    if (hours < 24) return `${hours} saat önce`
    if (days < 7) return `${days} gün önce`
    return formatDate(d, locale)
  } else {
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} minutes ago`
    if (hours < 24) return `${hours} hours ago`
    if (days < 7) return `${days} days ago`
    return formatDate(d, locale)
  }
}

export function formatCoins(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`
  }
  return amount.toString()
}

export function getZodiacSign(birthDate: Date | string): string {
  const date = typeof birthDate === 'string' ? new Date(birthDate) : birthDate
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  const signs = [
    { sign: 'capricorn', start: [1, 1], end: [1, 19] },
    { sign: 'aquarius', start: [1, 20], end: [2, 18] },
    { sign: 'pisces', start: [2, 19], end: [3, 20] },
    { sign: 'aries', start: [3, 21], end: [4, 19] },
    { sign: 'taurus', start: [4, 20], end: [5, 20] },
    { sign: 'gemini', start: [5, 21], end: [6, 20] },
    { sign: 'cancer', start: [6, 21], end: [7, 22] },
    { sign: 'leo', start: [7, 23], end: [8, 22] },
    { sign: 'virgo', start: [8, 23], end: [9, 22] },
    { sign: 'libra', start: [9, 23], end: [10, 22] },
    { sign: 'scorpio', start: [10, 23], end: [11, 21] },
    { sign: 'sagittarius', start: [11, 22], end: [12, 21] },
    { sign: 'capricorn', start: [12, 22], end: [12, 31] },
  ]
  
  for (const { sign, start, end } of signs) {
    const [startMonth, startDay] = start
    const [endMonth, endDay] = end
    
    if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay)
    ) {
      return sign
    }
  }
  
  return 'unknown'
}

export const zodiacData = {
  aries: { 
    name_en: 'Aries', 
    name_tr: 'Koç', 
    element: 'fire', 
    emoji: '♈',
    dates_en: 'Mar 21 - Apr 19',
    dates_tr: '21 Mart - 19 Nisan'
  },
  taurus: { 
    name_en: 'Taurus', 
    name_tr: 'Boğa', 
    element: 'earth', 
    emoji: '♉',
    dates_en: 'Apr 20 - May 20',
    dates_tr: '20 Nisan - 20 Mayıs'
  },
  gemini: { 
    name_en: 'Gemini', 
    name_tr: 'İkizler', 
    element: 'air', 
    emoji: '♊',
    dates_en: 'May 21 - Jun 20',
    dates_tr: '21 Mayıs - 20 Haziran'
  },
  cancer: { 
    name_en: 'Cancer', 
    name_tr: 'Yengeç', 
    element: 'water', 
    emoji: '♋',
    dates_en: 'Jun 21 - Jul 22',
    dates_tr: '21 Haziran - 22 Temmuz'
  },
  leo: { 
    name_en: 'Leo', 
    name_tr: 'Aslan', 
    element: 'fire', 
    emoji: '♌',
    dates_en: 'Jul 23 - Aug 22',
    dates_tr: '23 Temmuz - 22 Ağustos'
  },
  virgo: { 
    name_en: 'Virgo', 
    name_tr: 'Başak', 
    element: 'earth', 
    emoji: '♍',
    dates_en: 'Aug 23 - Sep 22',
    dates_tr: '23 Ağustos - 22 Eylül'
  },
  libra: { 
    name_en: 'Libra', 
    name_tr: 'Terazi', 
    element: 'air', 
    emoji: '♎',
    dates_en: 'Sep 23 - Oct 22',
    dates_tr: '23 Eylül - 22 Ekim'
  },
  scorpio: { 
    name_en: 'Scorpio', 
    name_tr: 'Akrep', 
    element: 'water', 
    emoji: '♏',
    dates_en: 'Oct 23 - Nov 21',
    dates_tr: '23 Ekim - 21 Kasım'
  },
  sagittarius: { 
    name_en: 'Sagittarius', 
    name_tr: 'Yay', 
    element: 'fire', 
    emoji: '♐',
    dates_en: 'Nov 22 - Dec 21',
    dates_tr: '22 Kasım - 21 Aralık'
  },
  capricorn: { 
    name_en: 'Capricorn', 
    name_tr: 'Oğlak', 
    element: 'earth', 
    emoji: '♑',
    dates_en: 'Dec 22 - Jan 19',
    dates_tr: '22 Aralık - 19 Ocak'
  },
  aquarius: { 
    name_en: 'Aquarius', 
    name_tr: 'Kova', 
    element: 'air', 
    emoji: '♒',
    dates_en: 'Jan 20 - Feb 18',
    dates_tr: '20 Ocak - 18 Şubat'
  },
  pisces: { 
    name_en: 'Pisces', 
    name_tr: 'Balık', 
    element: 'water', 
    emoji: '♓',
    dates_en: 'Feb 19 - Mar 20',
    dates_tr: '19 Şubat - 20 Mart'
  },
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
