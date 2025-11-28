export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type FortuneType = 
  | 'coffee' 
  | 'tarot' 
  | 'palm' 
  | 'face' 
  | 'astrology' 
  | 'horoscope' 
  | 'yildizname' 
  | 'dream' 
  | 'numerology' 
  | 'love_match'

export type SubscriptionTier = 'free' | 'plus' | 'premium'

export type MoodType = 'great' | 'good' | 'okay' | 'bad' | 'terrible'

export type DreamType = 'normal' | 'lucid' | 'nightmare' | 'recurring' | 'prophetic'

export type ZodiacSign = 
  | 'aries' | 'taurus' | 'gemini' | 'cancer' 
  | 'leo' | 'virgo' | 'libra' | 'scorpio' 
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          username: string | null
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          birth_time: string | null
          birth_place: string | null
          birth_latitude: number | null
          birth_longitude: number | null
          zodiac_sign: string | null
          language: string
          theme: string
          coins: number
          subscription_tier: SubscriptionTier
          subscription_expires_at: string | null
          streak_days: number
          last_active_at: string | null
          total_readings: number
          push_enabled: boolean
          email_notifications: boolean
          daily_horoscope_notification: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          birth_time?: string | null
          birth_place?: string | null
          birth_latitude?: number | null
          birth_longitude?: number | null
          zodiac_sign?: string | null
          language?: string
          theme?: string
          coins?: number
          subscription_tier?: SubscriptionTier
          subscription_expires_at?: string | null
          streak_days?: number
          last_active_at?: string | null
          total_readings?: number
          push_enabled?: boolean
          email_notifications?: boolean
          daily_horoscope_notification?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          birth_time?: string | null
          birth_place?: string | null
          birth_latitude?: number | null
          birth_longitude?: number | null
          zodiac_sign?: string | null
          language?: string
          theme?: string
          coins?: number
          subscription_tier?: SubscriptionTier
          subscription_expires_at?: string | null
          streak_days?: number
          last_active_at?: string | null
          total_readings?: number
          push_enabled?: boolean
          email_notifications?: boolean
          daily_horoscope_notification?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      coin_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: string
          description: string | null
          reference_id: string | null
          balance_after: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: string
          description?: string | null
          reference_id?: string | null
          balance_after: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: string
          description?: string | null
          reference_id?: string | null
          balance_after?: number
          created_at?: string
        }
      }
      fortune_readings: {
        Row: {
          id: string
          user_id: string
          type: FortuneType
          input_data: Json | null
          input_images: string[] | null
          reading_text: string | null
          reading_summary: string | null
          reading_highlights: Json | null
          generated_image_url: string | null
          audio_url: string | null
          coins_spent: number
          is_free: boolean
          language: string
          is_favorite: boolean
          is_shared: boolean
          share_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: FortuneType
          input_data?: Json | null
          input_images?: string[] | null
          reading_text?: string | null
          reading_summary?: string | null
          reading_highlights?: Json | null
          generated_image_url?: string | null
          audio_url?: string | null
          coins_spent?: number
          is_free?: boolean
          language?: string
          is_favorite?: boolean
          is_shared?: boolean
          share_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: FortuneType
          input_data?: Json | null
          input_images?: string[] | null
          reading_text?: string | null
          reading_summary?: string | null
          reading_highlights?: Json | null
          generated_image_url?: string | null
          audio_url?: string | null
          coins_spent?: number
          is_free?: boolean
          language?: string
          is_favorite?: boolean
          is_shared?: boolean
          share_count?: number
          created_at?: string
        }
      }
      daily_horoscopes: {
        Row: {
          id: string
          zodiac_sign: string
          date: string
          language: string
          general: string
          love: string | null
          career: string | null
          health: string | null
          finance: string | null
          lucky_number: number | null
          lucky_color: string | null
          compatibility: string | null
          mood: string | null
          intensity: number | null
          created_at: string
        }
        Insert: {
          id?: string
          zodiac_sign: string
          date: string
          language?: string
          general: string
          love?: string | null
          career?: string | null
          health?: string | null
          finance?: string | null
          lucky_number?: number | null
          lucky_color?: string | null
          compatibility?: string | null
          mood?: string | null
          intensity?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          zodiac_sign?: string
          date?: string
          language?: string
          general?: string
          love?: string | null
          career?: string | null
          health?: string | null
          finance?: string | null
          lucky_number?: number | null
          lucky_color?: string | null
          compatibility?: string | null
          mood?: string | null
          intensity?: number | null
          created_at?: string
        }
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          title: string | null
          content: string
          mood: MoodType | null
          mood_score: number | null
          tags: string[] | null
          weather: string | null
          location: string | null
          ai_insights: string | null
          sentiment_score: number | null
          images: string[] | null
          is_private: boolean
          is_shared_to_community: boolean
          entry_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          content: string
          mood?: MoodType | null
          mood_score?: number | null
          tags?: string[] | null
          weather?: string | null
          location?: string | null
          ai_insights?: string | null
          sentiment_score?: number | null
          images?: string[] | null
          is_private?: boolean
          is_shared_to_community?: boolean
          entry_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          content?: string
          mood?: MoodType | null
          mood_score?: number | null
          tags?: string[] | null
          weather?: string | null
          location?: string | null
          ai_insights?: string | null
          sentiment_score?: number | null
          images?: string[] | null
          is_private?: boolean
          is_shared_to_community?: boolean
          entry_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      dream_entries: {
        Row: {
          id: string
          user_id: string
          title: string | null
          content: string
          dream_type: DreamType | null
          clarity: number | null
          emotions: string[] | null
          symbols: string[] | null
          characters: string[] | null
          locations: string[] | null
          ai_interpretation: string | null
          ai_symbols_analysis: Json | null
          generated_image_url: string | null
          sleep_quality: number | null
          dream_date: string
          is_private: boolean
          is_shared_to_community: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          content: string
          dream_type?: DreamType | null
          clarity?: number | null
          emotions?: string[] | null
          symbols?: string[] | null
          characters?: string[] | null
          locations?: string[] | null
          ai_interpretation?: string | null
          ai_symbols_analysis?: Json | null
          generated_image_url?: string | null
          sleep_quality?: number | null
          dream_date?: string
          is_private?: boolean
          is_shared_to_community?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          content?: string
          dream_type?: DreamType | null
          clarity?: number | null
          emotions?: string[] | null
          symbols?: string[] | null
          characters?: string[] | null
          locations?: string[] | null
          ai_interpretation?: string | null
          ai_symbols_analysis?: Json | null
          generated_image_url?: string | null
          sleep_quality?: number | null
          dream_date?: string
          is_private?: boolean
          is_shared_to_community?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      meditation_categories: {
        Row: {
          id: string
          name_en: string
          name_tr: string
          description_en: string | null
          description_tr: string | null
          icon: string | null
          color: string | null
          sort_order: number
        }
        Insert: {
          id?: string
          name_en: string
          name_tr: string
          description_en?: string | null
          description_tr?: string | null
          icon?: string | null
          color?: string | null
          sort_order?: number
        }
        Update: {
          id?: string
          name_en?: string
          name_tr?: string
          description_en?: string | null
          description_tr?: string | null
          icon?: string | null
          color?: string | null
          sort_order?: number
        }
      }
      meditations: {
        Row: {
          id: string
          category_id: string | null
          title_en: string
          title_tr: string
          description_en: string | null
          description_tr: string | null
          duration_seconds: number
          audio_url: string
          background_image_url: string | null
          is_premium: boolean
          is_featured: boolean
          play_count: number
          avg_rating: number
          created_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          title_en: string
          title_tr: string
          description_en?: string | null
          description_tr?: string | null
          duration_seconds: number
          audio_url: string
          background_image_url?: string | null
          is_premium?: boolean
          is_featured?: boolean
          play_count?: number
          avg_rating?: number
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          title_en?: string
          title_tr?: string
          description_en?: string | null
          description_tr?: string | null
          duration_seconds?: number
          audio_url?: string
          background_image_url?: string | null
          is_premium?: boolean
          is_featured?: boolean
          play_count?: number
          avg_rating?: number
          created_at?: string
        }
      }
      meditation_sessions: {
        Row: {
          id: string
          user_id: string
          meditation_id: string | null
          duration_completed: number
          completed: boolean
          rating: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          meditation_id?: string | null
          duration_completed: number
          completed?: boolean
          rating?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          meditation_id?: string | null
          duration_completed?: number
          completed?: boolean
          rating?: number | null
          created_at?: string
        }
      }
      community_posts: {
        Row: {
          id: string
          user_id: string
          content: string
          post_type: string
          linked_reading_id: string | null
          linked_dream_id: string | null
          linked_journal_id: string | null
          images: string[] | null
          likes_count: number
          comments_count: number
          shares_count: number
          is_approved: boolean
          is_flagged: boolean
          is_anonymous: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          post_type?: string
          linked_reading_id?: string | null
          linked_dream_id?: string | null
          linked_journal_id?: string | null
          images?: string[] | null
          likes_count?: number
          comments_count?: number
          shares_count?: number
          is_approved?: boolean
          is_flagged?: boolean
          is_anonymous?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          post_type?: string
          linked_reading_id?: string | null
          linked_dream_id?: string | null
          linked_journal_id?: string | null
          images?: string[] | null
          likes_count?: number
          comments_count?: number
          shares_count?: number
          is_approved?: boolean
          is_flagged?: boolean
          is_anonymous?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      post_likes: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          created_at?: string
        }
      }
      post_comments: {
        Row: {
          id: string
          user_id: string
          post_id: string
          parent_id: string | null
          content: string
          likes_count: number
          is_approved: boolean
          is_flagged: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          parent_id?: string | null
          content: string
          likes_count?: number
          is_approved?: boolean
          is_flagged?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          parent_id?: string | null
          content?: string
          likes_count?: number
          is_approved?: boolean
          is_flagged?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          tier: string
          status: string
          provider: string | null
          provider_subscription_id: string | null
          provider_customer_id: string | null
          price_amount: number | null
          price_currency: string
          billing_period: string | null
          current_period_start: string | null
          current_period_end: string | null
          trial_end: string | null
          cancelled_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tier: string
          status: string
          provider?: string | null
          provider_subscription_id?: string | null
          provider_customer_id?: string | null
          price_amount?: number | null
          price_currency?: string
          billing_period?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          trial_end?: string | null
          cancelled_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tier?: string
          status?: string
          provider?: string | null
          provider_subscription_id?: string | null
          provider_customer_id?: string | null
          price_amount?: number | null
          price_currency?: string
          billing_period?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          trial_end?: string | null
          cancelled_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      coin_purchases: {
        Row: {
          id: string
          user_id: string
          coins_amount: number
          price_amount: number
          price_currency: string
          provider: string | null
          provider_transaction_id: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          coins_amount: number
          price_amount: number
          price_currency?: string
          provider?: string | null
          provider_transaction_id?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          coins_amount?: number
          price_amount?: number
          price_currency?: string
          provider?: string | null
          provider_transaction_id?: string | null
          status?: string
          created_at?: string
        }
      }
      ad_rewards: {
        Row: {
          id: string
          user_id: string
          ad_network: string
          ad_type: string
          ad_unit_id: string | null
          coins_rewarded: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ad_network: string
          ad_type: string
          ad_unit_id?: string | null
          coins_rewarded: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ad_network?: string
          ad_type?: string
          ad_unit_id?: string | null
          coins_rewarded?: number
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          body: string | null
          data: Json | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          body?: string | null
          data?: Json | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          body?: string | null
          data?: Json | null
          is_read?: boolean
          created_at?: string
        }
      }
      tarot_cards: {
        Row: {
          id: number
          name_en: string
          name_tr: string
          arcana: string
          suit: string | null
          number: number | null
          image_url: string | null
          upright_meaning_en: string | null
          upright_meaning_tr: string | null
          reversed_meaning_en: string | null
          reversed_meaning_tr: string | null
          keywords_en: string[] | null
          keywords_tr: string[] | null
        }
        Insert: {
          id?: number
          name_en: string
          name_tr: string
          arcana: string
          suit?: string | null
          number?: number | null
          image_url?: string | null
          upright_meaning_en?: string | null
          upright_meaning_tr?: string | null
          reversed_meaning_en?: string | null
          reversed_meaning_tr?: string | null
          keywords_en?: string[] | null
          keywords_tr?: string[] | null
        }
        Update: {
          id?: number
          name_en?: string
          name_tr?: string
          arcana?: string
          suit?: string | null
          number?: number | null
          image_url?: string | null
          upright_meaning_en?: string | null
          upright_meaning_tr?: string | null
          reversed_meaning_en?: string | null
          reversed_meaning_tr?: string | null
          keywords_en?: string[] | null
          keywords_tr?: string[] | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      spend_coins: {
        Args: {
          p_user_id: string
          p_amount: number
          p_description: string
          p_reference_id?: string
        }
        Returns: boolean
      }
      add_coins: {
        Args: {
          p_user_id: string
          p_amount: number
          p_type: string
          p_description?: string
        }
        Returns: number
      }
      check_daily_free_reading: {
        Args: {
          p_user_id: string
          p_fortune_type: FortuneType
        }
        Returns: boolean
      }
    }
    Enums: {
      fortune_type: FortuneType
    }
  }
}

// Helper types for common use
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type DreamEntry = Database['public']['Tables']['dream_entries']['Row']
export type DreamEntryInsert = Database['public']['Tables']['dream_entries']['Insert']
export type DreamEntryUpdate = Database['public']['Tables']['dream_entries']['Update']

export type JournalEntry = Database['public']['Tables']['journal_entries']['Row']
export type JournalEntryInsert = Database['public']['Tables']['journal_entries']['Insert']
export type JournalEntryUpdate = Database['public']['Tables']['journal_entries']['Update']

export type FortuneReading = Database['public']['Tables']['fortune_readings']['Row']
export type FortuneReadingInsert = Database['public']['Tables']['fortune_readings']['Insert']
export type FortuneReadingUpdate = Database['public']['Tables']['fortune_readings']['Update']

export type CommunityPost = Database['public']['Tables']['community_posts']['Row']
export type CommunityPostInsert = Database['public']['Tables']['community_posts']['Insert']
export type CommunityPostUpdate = Database['public']['Tables']['community_posts']['Update']

export type PostComment = Database['public']['Tables']['post_comments']['Row']
export type PostCommentInsert = Database['public']['Tables']['post_comments']['Insert']
export type PostCommentUpdate = Database['public']['Tables']['post_comments']['Update']

export type Meditation = Database['public']['Tables']['meditations']['Row']
export type MeditationCategory = Database['public']['Tables']['meditation_categories']['Row']
export type MeditationSession = Database['public']['Tables']['meditation_sessions']['Row']

export type CoinTransaction = Database['public']['Tables']['coin_transactions']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type TarotCard = Database['public']['Tables']['tarot_cards']['Row']
export type DailyHoroscope = Database['public']['Tables']['daily_horoscopes']['Row']
