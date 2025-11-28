const translations = {
  // Navigation
  nav: {
    home: 'Home',
    fortunes: 'Fortunes',
    journal: 'Journal',
    dreams: 'Dreams',
    meditation: 'Meditation',
    community: 'Community',
    profile: 'Profile',
    settings: 'Settings',
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    share: 'Share',
    close: 'Close',
    next: 'Next',
    back: 'Back',
    done: 'Done',
    search: 'Search',
    seeAll: 'See All',
    today: 'Today',
    yesterday: 'Yesterday',
    all: 'All',
    free: 'Free',
    premium: 'Premium',
    new: 'New',
    popular: 'Popular',
    recommended: 'Recommended',
  },

  // Auth
  auth: {
    login: 'Login',
    register: 'Sign Up',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    forgotPassword: 'Forgot Password',
    resetPassword: 'Reset Password',
    welcomeBack: 'Welcome back!',
    createAccount: 'Create Account',
    haveAccount: 'Already have an account?',
    noAccount: "Don't have an account?",
    or: 'or',
    continueWithGoogle: 'Continue with Google',
    continueWithApple: 'Continue with Apple',
    termsAgree: 'I agree to the terms of service',
    privacyAgree: 'I have read the privacy policy',
  },

  // Fortunes
  fortunes: {
    title: 'Fortunes',
    subtitle: 'Discover your future',
    types: {
      coffee: {
        name: 'Coffee Reading',
        description: 'Discover the secrets in your cup',
        instructions: 'Take a photo of your coffee cup',
      },
      tarot: {
        name: 'Tarot',
        description: 'Learn what the cards tell you',
        instructions: 'Select 3 cards',
      },
      palm: {
        name: 'Palm Reading',
        description: 'What do the lines in your palm say',
        instructions: 'Take a photo of your palm',
      },
      face: {
        name: 'Face Analysis',
        description: 'Character analysis from facial features',
        instructions: 'Take a photo of your face',
      },
      horoscope: {
        name: 'Daily Horoscope',
        description: 'What awaits you today',
        instructions: 'Select your zodiac sign',
      },
      astrology: {
        name: 'Astrology',
        description: 'Discover your star chart',
        instructions: 'Enter your birth information',
      },
      numerology: {
        name: 'Numerology',
        description: 'Learn the power of numbers',
        instructions: 'Enter your birth date',
      },
      runic: {
        name: 'Rune Reading',
        description: 'Message of ancient rune stones',
        instructions: 'Select 3 runes',
      },
      love: {
        name: 'Love Fortune',
        description: 'About your love life',
        instructions: 'Ask your question',
      },
      yildizname: {
        name: 'Birth Chart',
        description: 'Sky map at the moment of your birth',
        instructions: 'Enter your birth information',
      },
    },
    common: {
      dailyFree: 'Daily Free',
      startReading: 'Start Reading',
      newReading: 'New Reading',
      readingHistory: 'Reading History',
      shareReading: 'Share Reading',
      saveReading: 'Save Reading',
      readingReady: 'Your Reading is Ready!',
      aiAnalyzing: 'AI is reading your fortune...',
      uploadPhoto: 'Upload Photo',
      takePhoto: 'Take Photo',
      pleaseWait: 'Please wait, mystical powers are working...',
    },
  },

  // Dreams
  dreams: {
    title: 'Dream Journal',
    newDream: 'New Dream',
    dreamContent: 'Describe your dream',
    interpret: 'Interpret',
    generateImage: 'Visualize',
    tags: 'Tags',
    dreamType: 'Dream Type',
    types: {
      good: 'Good Dream',
      nightmare: 'Nightmare',
      prophetic: 'Prophetic',
      recurring: 'Recurring',
      lucid: 'Lucid',
    },
  },

  // Journal
  journal: {
    title: 'Journal',
    newEntry: 'New Entry',
    mood: 'Mood',
    moods: {
      happy: 'Happy',
      sad: 'Sad',
      peaceful: 'Peaceful',
      angry: 'Angry',
      anxious: 'Anxious',
      thoughtful: 'Thoughtful',
      tired: 'Tired',
      in_love: 'In Love',
    },
    aiAnalysis: 'AI Analysis',
    analyze: 'Analyze',
  },

  // Meditation
  meditation: {
    title: 'Meditation',
    categories: 'Categories',
    duration: 'Duration',
    sessions: 'Sessions',
    streak: 'Day Streak',
    totalMinutes: 'Total Minutes',
    startSession: 'Start Session',
    completed: 'Completed',
  },

  // Community
  community: {
    title: 'Community',
    newPost: 'New Post',
    likes: 'Likes',
    comments: 'Comments',
    share: 'Share',
    categories: {
      all: 'All',
      fortune: 'Fortunes',
      dream: 'Dreams',
      meditation: 'Meditation',
      astrology: 'Astrology',
      general: 'General',
    },
  },

  // Profile
  profile: {
    title: 'Profile',
    editProfile: 'Edit Profile',
    stats: {
      readings: 'Readings',
      journals: 'Journals',
      dreams: 'Dreams',
      meditations: 'Meditations',
    },
    settings: 'Settings',
    signOut: 'Sign Out',
    membership: 'Membership',
    birthInfo: 'Birth Information',
  },

  // Settings
  settings: {
    title: 'Settings',
    appearance: 'Appearance',
    theme: 'Theme',
    language: 'Language',
    notifications: 'Notifications',
    privacy: 'Privacy',
    terms: 'Terms of Service',
    help: 'Help',
    contact: 'Contact',
    about: 'About',
    version: 'Version',
    deleteAccount: 'Delete Account',
    themes: {
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },
  },

  // Subscription
  subscription: {
    title: 'Premium Membership',
    free: 'Free',
    plus: 'Plus',
    premium: 'Premium',
    features: 'Features',
    subscribe: 'Subscribe',
    restore: 'Restore Purchases',
    currentPlan: 'Current Plan',
    upgrade: 'Upgrade',
    cancel: 'Cancel',
    benefits: {
      unlimitedFortunes: 'Unlimited readings',
      noAds: 'Ad-free experience',
      prioritySupport: 'Priority support',
      exclusiveContent: 'Exclusive content',
      dailyBonus: 'Increased daily bonus',
    },
  },

  // Onboarding
  onboarding: {
    skip: 'Skip',
    next: 'Next',
    getStarted: 'Get Started',
    welcome: {
      title: 'Welcome to Aura',
      subtitle: 'Begin your mystical journey',
    },
    steps: {
      interests: {
        title: 'Your Interests',
        subtitle: 'What interests you the most?',
      },
      birthInfo: {
        title: 'Birth Information',
        subtitle: 'For more personalized readings',
        birthDate: 'Birth Date',
        birthTime: 'Birth Time',
        birthPlace: 'Birth Place',
      },
      zodiac: {
        title: 'Your Zodiac',
        subtitle: 'What is your zodiac sign?',
      },
      notifications: {
        title: 'Notifications',
        subtitle: 'Daily horoscope and important updates',
      },
    },
    complete: {
      title: "You're Ready!",
      subtitle: 'You can start your mystical journey',
      button: 'Explore',
    },
  },

  // Coins
  coins: {
    title: 'Coins',
    balance: 'Balance',
    earn: 'Earn',
    spend: 'Spend',
    history: 'History',
    insufficientCoins: 'Insufficient Coins',
    watchAd: 'Watch Ad',
    claim: 'Claim',
    watchAdDesc: 'Earn {coins} coins',
    dailyBonus: 'Daily Bonus',
    packages: 'Coin Packages',
    bonus: 'Bonus',
  },

  // Errors
  errors: {
    generic: 'Something went wrong',
    network: 'No internet connection',
    unauthorized: 'Session expired',
    notFound: 'Page not found',
    serverError: 'Server error',
    insufficientCoins: 'Not enough coins',
    dailyLimitReached: 'Daily limit reached',
  },
} as const

export type TranslationKeys = typeof translations
export default translations
