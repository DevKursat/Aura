const translations = {
  // Navigation
  nav: {
    home: 'Ana Sayfa',
    fortunes: 'Fallar',
    journal: 'Günlük',
    dreams: 'Rüyalar',
    meditation: 'Meditasyon',
    community: 'Topluluk',
    profile: 'Profil',
    settings: 'Ayarlar',
  },

  // Common
  common: {
    loading: 'Yükleniyor...',
    error: 'Bir hata oluştu',
    retry: 'Tekrar Dene',
    cancel: 'İptal',
    save: 'Kaydet',
    delete: 'Sil',
    edit: 'Düzenle',
    share: 'Paylaş',
    close: 'Kapat',
    next: 'İleri',
    back: 'Geri',
    done: 'Tamam',
    search: 'Ara',
    seeAll: 'Tümünü Gör',
    today: 'Bugün',
    yesterday: 'Dün',
    all: 'Tümü',
    free: 'Ücretsiz',
    premium: 'Premium',
    new: 'Yeni',
    popular: 'Popüler',
    recommended: 'Önerilen',
  },

  // Auth
  auth: {
    login: 'Giriş Yap',
    register: 'Kayıt Ol',
    logout: 'Çıkış Yap',
    email: 'E-posta',
    password: 'Şifre',
    confirmPassword: 'Şifre Tekrar',
    fullName: 'Ad Soyad',
    forgotPassword: 'Şifremi Unuttum',
    resetPassword: 'Şifreyi Sıfırla',
    welcomeBack: 'Tekrar hoş geldin!',
    createAccount: 'Hesap Oluştur',
    haveAccount: 'Zaten hesabın var mı?',
    noAccount: 'Hesabın yok mu?',
    or: 'veya',
    continueWithGoogle: 'Google ile devam et',
    continueWithApple: 'Apple ile devam et',
    termsAgree: 'Kullanım koşullarını kabul ediyorum',
    privacyAgree: 'Gizlilik politikasını okudum',
  },

  // Fortunes
  fortunes: {
    title: 'Fallar',
    subtitle: 'Geleceğini keşfet',
    types: {
      coffee: {
        name: 'Kahve Falı',
        description: 'Fincanındaki sırları keşfet',
        instructions: 'Kahve fincanının fotoğrafını çek',
      },
      tarot: {
        name: 'Tarot',
        description: 'Kartların sana ne söylediğini öğren',
        instructions: '3 kart seç',
      },
      palm: {
        name: 'El Falı',
        description: 'Avucundaki çizgiler ne anlatıyor',
        instructions: 'Avuç içi fotoğrafını çek',
      },
      face: {
        name: 'Yüz Analizi',
        description: 'Yüz hatlarından karakter analizi',
        instructions: 'Yüz fotoğrafını çek',
      },
      horoscope: {
        name: 'Günlük Burç',
        description: 'Bugün seni neler bekliyor',
        instructions: 'Burcunu seç',
      },
      astrology: {
        name: 'Astroloji',
        description: 'Yıldız haritanı keşfet',
        instructions: 'Doğum bilgilerini gir',
      },
      numerology: {
        name: 'Numeroloji',
        description: 'Sayıların gücünü öğren',
        instructions: 'Doğum tarihini gir',
      },
      runic: {
        name: 'Rün Falı',
        description: 'Kadim rün taşlarının mesajı',
        instructions: '3 rün seç',
      },
      love: {
        name: 'Aşk Falı',
        description: 'Aşk hayatın hakkında',
        instructions: 'Sorunu sor',
      },
      yildizname: {
        name: 'Yıldızname',
        description: 'Doğum anındaki gökyüzü haritası',
        instructions: 'Doğum bilgilerini gir',
      },
    },
    common: {
      dailyFree: 'Günlük Ücretsiz',
      startReading: 'Falı Başlat',
      newReading: 'Yeni Fal',
      readingHistory: 'Geçmiş Fallar',
      shareReading: 'Falı Paylaş',
      saveReading: 'Falı Kaydet',
      readingReady: 'Falın Hazır!',
      aiAnalyzing: 'AI falına bakıyor...',
      uploadPhoto: 'Fotoğraf Yükle',
      takePhoto: 'Fotoğraf Çek',
      pleaseWait: 'Lütfen bekleyin, mistik güçler çalışıyor...',
    },
  },

  // Dreams
  dreams: {
    title: 'Rüya Günlüğü',
    newDream: 'Yeni Rüya',
    dreamContent: 'Rüyanı anlat',
    interpret: 'Yorumla',
    generateImage: 'Görselleştir',
    tags: 'Etiketler',
    dreamType: 'Rüya Türü',
    types: {
      good: 'Güzel Rüya',
      nightmare: 'Kabus',
      prophetic: 'Kehanet',
      recurring: 'Tekrarlayan',
      lucid: 'Lucid',
    },
  },

  // Journal
  journal: {
    title: 'Günlük',
    newEntry: 'Yeni Girdi',
    mood: 'Ruh Hali',
    moods: {
      happy: 'Mutlu',
      sad: 'Üzgün',
      peaceful: 'Huzurlu',
      angry: 'Sinirli',
      anxious: 'Kaygılı',
      thoughtful: 'Düşünceli',
      tired: 'Yorgun',
      in_love: 'Aşık',
    },
    aiAnalysis: 'AI Analizi',
    analyze: 'Analiz Et',
  },

  // Meditation
  meditation: {
    title: 'Meditasyon',
    categories: 'Kategoriler',
    duration: 'Süre',
    sessions: 'Seanslar',
    streak: 'Gün Serisi',
    totalMinutes: 'Toplam Dakika',
    startSession: 'Seansa Başla',
    completed: 'Tamamlandı',
  },

  // Community
  community: {
    title: 'Topluluk',
    newPost: 'Yeni Gönderi',
    likes: 'Beğeni',
    comments: 'Yorum',
    share: 'Paylaş',
    categories: {
      all: 'Tümü',
      fortune: 'Fallar',
      dream: 'Rüyalar',
      meditation: 'Meditasyon',
      astrology: 'Astroloji',
      general: 'Genel',
    },
  },

  // Profile
  profile: {
    title: 'Profil',
    editProfile: 'Profili Düzenle',
    stats: {
      readings: 'Fal',
      journals: 'Günlük',
      dreams: 'Rüya',
      meditations: 'Meditasyon',
    },
    settings: 'Ayarlar',
    signOut: 'Çıkış Yap',
    membership: 'Üyelik',
    birthInfo: 'Doğum Bilgileri',
  },

  // Settings
  settings: {
    title: 'Ayarlar',
    appearance: 'Görünüm',
    theme: 'Tema',
    language: 'Dil',
    notifications: 'Bildirimler',
    privacy: 'Gizlilik',
    terms: 'Kullanım Koşulları',
    help: 'Yardım',
    contact: 'İletişim',
    about: 'Hakkında',
    version: 'Versiyon',
    deleteAccount: 'Hesabı Sil',
    themes: {
      light: 'Açık',
      dark: 'Koyu',
      system: 'Sistem',
    },
  },

  // Subscription
  subscription: {
    title: 'Premium Üyelik',
    free: 'Ücretsiz',
    plus: 'Plus',
    premium: 'Premium',
    features: 'Özellikler',
    subscribe: 'Abone Ol',
    restore: 'Satın Alımları Geri Yükle',
    currentPlan: 'Mevcut Plan',
    upgrade: 'Yükselt',
    cancel: 'İptal Et',
    benefits: {
      unlimitedFortunes: 'Sınırsız fal',
      noAds: 'Reklamsız deneyim',
      prioritySupport: 'Öncelikli destek',
      exclusiveContent: 'Özel içerikler',
      dailyBonus: 'Artırılmış günlük bonus',
    },
  },

  // Onboarding
  onboarding: {
    skip: 'Atla',
    next: 'İleri',
    getStarted: 'Başla',
    welcome: {
      title: 'Aura\'ya Hoş Geldin',
      subtitle: 'Mistik yolculuğuna başla',
    },
    steps: {
      interests: {
        title: 'İlgi Alanların',
        subtitle: 'Seni en çok ne ilgilendiriyor?',
      },
      birthInfo: {
        title: 'Doğum Bilgilerin',
        subtitle: 'Daha kişisel yorumlar için',
        birthDate: 'Doğum Tarihi',
        birthTime: 'Doğum Saati',
        birthPlace: 'Doğum Yeri',
      },
      zodiac: {
        title: 'Burcun',
        subtitle: 'Hangi burçsun?',
      },
      notifications: {
        title: 'Bildirimler',
        subtitle: 'Günlük burç yorumun ve önemli güncellemeler',
      },
    },
    complete: {
      title: 'Hazırsın!',
      subtitle: 'Mistik yolculuğuna başlayabilirsin',
      button: 'Keşfet',
    },
  },

  // Coins
  coins: {
    title: 'Coinler',
    balance: 'Bakiye',
    earn: 'Kazan',
    spend: 'Harca',
    history: 'Geçmiş',
    insufficientCoins: 'Yetersiz Coin',
    watchAd: 'Reklam İzle',
    claim: 'Al',
    watchAdDesc: '{coins} coin kazan',
    dailyBonus: 'Günlük Bonus',
    packages: 'Coin Paketleri',
    bonus: 'Bonus',
  },

  // Errors
  errors: {
    generic: 'Bir şeyler yanlış gitti',
    network: 'İnternet bağlantısı yok',
    unauthorized: 'Oturum süreniz doldu',
    notFound: 'Sayfa bulunamadı',
    serverError: 'Sunucu hatası',
    insufficientCoins: 'Yeterli coin yok',
    dailyLimitReached: 'Günlük limit doldu',
  },
} as const

export type TranslationKeys = typeof translations
export default translations
