// Fortune types
export const FORTUNE_TYPES = {
  coffee: {
    id: 'coffee',
    name_en: 'Coffee Reading',
    name_tr: 'Kahve Falı',
    emoji: '☕',
    description_en: 'Discover the secrets in your cup',
    description_tr: 'Fincanındaki sırları keşfet',
    cost: 30,
    requires_image: true,
    category: 'traditional',
  },
  tarot: {
    id: 'tarot',
    name_en: 'Tarot',
    name_tr: 'Tarot',
    emoji: '🎴',
    description_en: 'Learn what the cards tell you',
    description_tr: 'Kartların sana ne söylediğini öğren',
    cost: 40,
    requires_image: false,
    category: 'cards',
  },
  palm: {
    id: 'palm',
    name_en: 'Palm Reading',
    name_tr: 'El Falı',
    emoji: '✋',
    description_en: 'What do the lines say',
    description_tr: 'Avucundaki çizgiler ne anlatıyor',
    cost: 50,
    requires_image: true,
    category: 'traditional',
  },
  face: {
    id: 'face',
    name_en: 'Face Analysis',
    name_tr: 'Yüz Analizi',
    emoji: '👤',
    description_en: 'Character analysis from facial features',
    description_tr: 'Yüz hatlarından karakter analizi',
    cost: 50,
    requires_image: true,
    category: 'modern',
  },
  horoscope: {
    id: 'horoscope',
    name_en: 'Daily Horoscope',
    name_tr: 'Günlük Burç',
    emoji: '⭐',
    description_en: 'What awaits you today',
    description_tr: 'Bugün seni neler bekliyor',
    cost: 0,
    requires_image: false,
    category: 'astrology',
  },
  astrology: {
    id: 'astrology',
    name_en: 'Astrology',
    name_tr: 'Astroloji',
    emoji: '🪐',
    description_en: 'Discover your star chart',
    description_tr: 'Yıldız haritanı keşfet',
    cost: 45,
    requires_image: false,
    category: 'astrology',
  },
  yildizname: {
    id: 'yildizname',
    name_en: 'Birth Chart',
    name_tr: 'Yıldızname',
    emoji: '🌟',
    description_en: 'Sky map at birth',
    description_tr: 'Doğum anındaki gökyüzü haritası',
    cost: 80,
    requires_image: false,
    category: 'astrology',
  },
  numerology: {
    id: 'numerology',
    name_en: 'Numerology',
    name_tr: 'Numeroloji',
    emoji: '🔢',
    description_en: 'Power of numbers',
    description_tr: 'Sayıların gücü',
    cost: 35,
    requires_image: false,
    category: 'mystical',
  },
  runic: {
    id: 'runic',
    name_en: 'Rune Reading',
    name_tr: 'Rün Falı',
    emoji: '🪨',
    description_en: 'Message of ancient runes',
    description_tr: 'Kadim rün taşlarının mesajı',
    cost: 40,
    requires_image: false,
    category: 'mystical',
  },
  love: {
    id: 'love',
    name_en: 'Love Fortune',
    name_tr: 'Aşk Falı',
    emoji: '💕',
    description_en: 'About your love life',
    description_tr: 'Aşk hayatın hakkında',
    cost: 40,
    requires_image: false,
    category: 'love',
  },
} as const

export type FortuneTypeKey = keyof typeof FORTUNE_TYPES

// Coin costs for different features
export const COIN_COSTS = {
  // Fortune readings
  coffee: 30,
  tarot: 40,
  palm: 50,
  face: 50,
  astrology: 45,
  yildizname: 80,
  dream: 25,
  numerology: 35,
  love_match: 40,
  
  // Image generation
  dream_image: 60,
  reading_image: 60,
  
  // Premium features
  detailed_analysis: 20,
  audio_reading: 15,
} as const

// Coin packages for purchase
export const COIN_PACKAGES = [
  { id: 'coins_100', coins: 100, price: 0.99, price_tr: '₺39,99', currency: 'USD', bonus: 0, popular: false },
  { id: 'coins_500', coins: 500, price: 3.99, price_tr: '₺159,99', currency: 'USD', bonus: 100, popular: false },
  { id: 'coins_1200', coins: 1200, price: 7.99, price_tr: '₺319,99', currency: 'USD', bonus: 280, popular: true },
  { id: 'coins_3000', coins: 3000, price: 14.99, price_tr: '₺599,99', currency: 'USD', bonus: 900, popular: false },
] as const

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  free: {
    name_en: 'Free',
    name_tr: 'Ücretsiz',
    price_monthly: 0,
    price_yearly: 0,
    features: {
      daily_free_readings: 1,
      daily_image_generations: 0,
      journal_entries: 5,
      dream_entries: 5,
      ads: true,
      community_posts: 3,
      meditation_access: 'limited',
    },
  },
  plus: {
    name_en: 'Aura Plus',
    name_tr: 'Aura Plus',
    price_monthly: 4.99,
    price_yearly: 39.99,
    features: {
      daily_free_readings: 10,
      daily_image_generations: 5,
      journal_entries: -1, // unlimited
      dream_entries: -1,
      ads: 'reduced',
      community_posts: -1,
      meditation_access: 'most',
    },
  },
  premium: {
    name_en: 'Aura Premium',
    name_tr: 'Aura Premium',
    price_monthly: 9.99,
    price_yearly: 79.99,
    features: {
      daily_free_readings: -1, // unlimited
      daily_image_generations: -1,
      journal_entries: -1,
      dream_entries: -1,
      ads: false,
      community_posts: -1,
      meditation_access: 'all',
      priority_support: true,
      exclusive_badges: true,
      early_access: true,
    },
  },
} as const

// Ad reward amounts
export const AD_REWARDS = {
  standard: 15,
  rewarded_video: {
    min: 10,
    max: 25,
    daily_limit: 10,
  },
  rewarded_interstitial: {
    min: 5,
    max: 10,
    daily_limit: 5,
  },
} as const

// Daily bonuses
export const DAILY_BONUSES = {
  base: 5,
  day7: 10,
  day30: 20,
  login: 5,
  streak_multiplier: {
    7: 2,    // 7 days = 2x bonus
    30: 3,   // 30 days = 3x bonus
    100: 5,  // 100 days = 5x bonus
  },
  journal_entry: 3,
  dream_entry: 3,
  community_post: 2,
  referral: 100,
} as const

// Feature flags
export const FEATURES = {
  coffee_reading: true,
  tarot_reading: true,
  palm_reading: true,
  face_reading: true,
  astrology: true,
  yildizname: true,
  dream_journal: true,
  daily_journal: true,
  meditation: true,
  community: true,
  image_generation: true,
  audio_readings: false, // Coming soon
  live_readings: false, // Coming soon
  ar_features: false, // Coming soon
} as const

// Rate limits
export const RATE_LIMITS = {
  ai_requests_per_minute: 10,
  image_generations_per_hour: 20,
  community_posts_per_day: 10,
  comments_per_hour: 30,
} as const

// Image generation settings
export const IMAGE_GENERATION = {
  provider: 'fal.ai',
  model: 'flux-pro',
  default_size: '1024x1024',
  max_size: '2048x2048',
  formats: ['webp', 'png', 'jpg'],
} as const

// AI settings
export const AI_SETTINGS = {
  provider: 'anthropic',
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 4096,
  temperature: 0.8, // Higher for creative fortune readings
} as const

// Supported languages
export const LANGUAGES = {
  tr: {
    name: 'Türkçe',
    flag: '🇹🇷',
    rtl: false,
  },
  en: {
    name: 'English',
    flag: '🇺🇸',
    rtl: false,
  },
} as const

// App metadata
export const APP_CONFIG = {
  name: 'Aura',
  tagline_en: 'Your Mystical Lifestyle Companion',
  tagline_tr: 'Mistik Yaşam Tarzı Asistanınız',
  version: '1.0.0',
  support_email: 'support@aura.app',
  website: 'https://aura.app',
  social: {
    instagram: '@auraapp',
    twitter: '@auraapp',
    tiktok: '@auraapp',
  },
} as const
