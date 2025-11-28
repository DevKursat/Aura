-- =============================================
-- AURA DATABASE SCHEMA
-- Lifestyle Super App - Fortune Telling, Meditation, Journals
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- =============================================
-- USERS & PROFILES
-- =============================================

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  birth_date DATE,
  birth_time TIME,
  birth_place TEXT,
  birth_latitude DECIMAL(10, 8),
  birth_longitude DECIMAL(11, 8),
  zodiac_sign TEXT,
  language TEXT DEFAULT 'tr',
  theme TEXT DEFAULT 'dark',
  
  -- Coins & Subscription
  coins INTEGER DEFAULT 50,
  subscription_tier TEXT DEFAULT 'free', -- 'free', 'plus', 'premium'
  subscription_expires_at TIMESTAMPTZ,
  
  -- Stats
  streak_days INTEGER DEFAULT 0,
  last_active_at DATE,
  total_readings INTEGER DEFAULT 0,
  
  -- Notifications
  push_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  daily_horoscope_notification BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

-- =============================================
-- COIN TRANSACTIONS
-- =============================================

CREATE TABLE public.coin_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL, -- positive for earning, negative for spending
  type TEXT NOT NULL, -- 'reward_ad', 'purchase', 'daily_bonus', 'streak_bonus', 'referral', 'spend', 'refund'
  description TEXT,
  reference_id TEXT, -- For linking to readings, purchases, etc.
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions" ON public.coin_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- FORTUNE READINGS
-- =============================================

CREATE TYPE fortune_type AS ENUM (
  'coffee', -- Kahve falı
  'tarot', -- Tarot
  'palm', -- El falı
  'face', -- Yüz falı
  'astrology', -- Astroloji
  'horoscope', -- Günlük burç
  'yildizname', -- Yıldızname
  'dream', -- Rüya yorumu
  'numerology', -- Numeroloji
  'love_match' -- Aşk uyumu
);

CREATE TABLE public.fortune_readings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type fortune_type NOT NULL,
  
  -- Input data (JSON for flexibility)
  input_data JSONB, -- Images, card selections, birth data, etc.
  input_images TEXT[], -- Array of image URLs for coffee, palm, face
  
  -- AI Response
  reading_text TEXT,
  reading_summary TEXT,
  reading_highlights JSONB, -- Key points from the reading
  
  -- Generated content
  generated_image_url TEXT, -- AI generated visualization
  audio_url TEXT, -- TTS version of reading
  
  -- Metadata
  coins_spent INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'tr',
  
  -- Engagement
  is_favorite BOOLEAN DEFAULT false,
  is_shared BOOLEAN DEFAULT false,
  share_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.fortune_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own readings" ON public.fortune_readings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create readings" ON public.fortune_readings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own readings" ON public.fortune_readings
  FOR UPDATE USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_readings_user_type ON public.fortune_readings(user_id, type);
CREATE INDEX idx_readings_created ON public.fortune_readings(created_at DESC);

-- =============================================
-- TAROT CARDS
-- =============================================

CREATE TABLE public.tarot_cards (
  id SERIAL PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  arcana TEXT NOT NULL, -- 'major' or 'minor'
  suit TEXT, -- For minor arcana: wands, cups, swords, pentacles
  number INTEGER,
  image_url TEXT,
  upright_meaning_en TEXT,
  upright_meaning_tr TEXT,
  reversed_meaning_en TEXT,
  reversed_meaning_tr TEXT,
  keywords_en TEXT[],
  keywords_tr TEXT[]
);

-- =============================================
-- DAILY HOROSCOPES
-- =============================================

CREATE TABLE public.daily_horoscopes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  zodiac_sign TEXT NOT NULL,
  date DATE NOT NULL,
  language TEXT NOT NULL DEFAULT 'tr',
  
  general TEXT NOT NULL,
  love TEXT,
  career TEXT,
  health TEXT,
  finance TEXT,
  lucky_number INTEGER,
  lucky_color TEXT,
  compatibility TEXT, -- Most compatible sign today
  mood TEXT,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 5),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(zodiac_sign, date, language)
);

ALTER TABLE public.daily_horoscopes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read horoscopes" ON public.daily_horoscopes
  FOR SELECT USING (true);

-- =============================================
-- JOURNAL ENTRIES
-- =============================================

CREATE TABLE public.journal_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  title TEXT,
  content TEXT NOT NULL,
  mood TEXT, -- 'great', 'good', 'okay', 'bad', 'terrible'
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 5),
  tags TEXT[],
  
  -- Weather & location (optional)
  weather TEXT,
  location TEXT,
  
  -- AI Analysis
  ai_insights TEXT,
  sentiment_score DECIMAL(3, 2), -- -1 to 1
  
  -- Media
  images TEXT[],
  
  -- Privacy
  is_private BOOLEAN DEFAULT true,
  is_shared_to_community BOOLEAN DEFAULT false,
  
  entry_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own journals" ON public.journal_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_journal_user_date ON public.journal_entries(user_id, entry_date DESC);

-- =============================================
-- DREAM JOURNAL
-- =============================================

CREATE TABLE public.dream_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  title TEXT,
  content TEXT NOT NULL,
  
  -- Dream specifics
  dream_type TEXT, -- 'normal', 'lucid', 'nightmare', 'recurring', 'prophetic'
  clarity INTEGER CHECK (clarity >= 1 AND clarity <= 5),
  emotions TEXT[],
  symbols TEXT[], -- Key symbols in the dream
  characters TEXT[], -- People in the dream
  locations TEXT[], -- Places in the dream
  
  -- AI Interpretation
  ai_interpretation TEXT,
  ai_symbols_analysis JSONB, -- Detailed symbol meanings
  generated_image_url TEXT, -- AI visualization of dream
  
  -- Metadata
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  dream_date DATE DEFAULT CURRENT_DATE,
  
  -- Privacy
  is_private BOOLEAN DEFAULT true,
  is_shared_to_community BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.dream_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own dreams" ON public.dream_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_dreams_user_date ON public.dream_entries(user_id, dream_date DESC);

-- =============================================
-- MEDITATION
-- =============================================

CREATE TABLE public.meditation_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  description_en TEXT,
  description_tr TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE public.meditations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES public.meditation_categories(id),
  
  title_en TEXT NOT NULL,
  title_tr TEXT NOT NULL,
  description_en TEXT,
  description_tr TEXT,
  
  duration_seconds INTEGER NOT NULL,
  audio_url TEXT NOT NULL,
  background_image_url TEXT,
  
  -- Access control
  is_premium BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  
  -- Stats
  play_count INTEGER DEFAULT 0,
  avg_rating DECIMAL(2, 1) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.meditations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view meditations" ON public.meditations
  FOR SELECT USING (true);

CREATE TABLE public.meditation_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  meditation_id UUID REFERENCES public.meditations(id) ON DELETE SET NULL,
  
  duration_completed INTEGER NOT NULL, -- seconds actually listened
  completed BOOLEAN DEFAULT false,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.meditation_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own sessions" ON public.meditation_sessions
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- COMMUNITY
-- =============================================

CREATE TABLE public.community_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  content TEXT NOT NULL,
  post_type TEXT DEFAULT 'general', -- 'general', 'dream', 'reading', 'journal', 'question'
  
  -- Linked content (optional)
  linked_reading_id UUID REFERENCES public.fortune_readings(id) ON DELETE SET NULL,
  linked_dream_id UUID REFERENCES public.dream_entries(id) ON DELETE SET NULL,
  linked_journal_id UUID REFERENCES public.journal_entries(id) ON DELETE SET NULL,
  
  -- Media
  images TEXT[],
  
  -- Engagement
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  
  -- Moderation
  is_approved BOOLEAN DEFAULT true,
  is_flagged BOOLEAN DEFAULT false,
  is_anonymous BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved posts" ON public.community_posts
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create posts" ON public.community_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON public.community_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON public.community_posts
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_posts_created ON public.community_posts(created_at DESC);
CREATE INDEX idx_posts_type ON public.community_posts(post_type);

-- Post likes
CREATE TABLE public.post_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own likes" ON public.post_likes
  FOR ALL USING (auth.uid() = user_id);

-- Post comments
CREATE TABLE public.post_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  
  is_approved BOOLEAN DEFAULT true,
  is_flagged BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved comments" ON public.post_comments
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create comments" ON public.post_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.post_comments
  FOR UPDATE USING (auth.uid() = user_id);

-- Follows
CREATE TABLE public.follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own follows" ON public.follows
  FOR ALL USING (auth.uid() = follower_id);

CREATE POLICY "Anyone can see follows" ON public.follows
  FOR SELECT USING (true);

-- =============================================
-- SUBSCRIPTIONS & PURCHASES
-- =============================================

CREATE TABLE public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  tier TEXT NOT NULL, -- 'plus', 'premium'
  status TEXT NOT NULL, -- 'active', 'cancelled', 'expired', 'trial'
  
  -- Payment provider info
  provider TEXT, -- 'stripe', 'apple', 'google'
  provider_subscription_id TEXT,
  provider_customer_id TEXT,
  
  -- Pricing
  price_amount DECIMAL(10, 2),
  price_currency TEXT DEFAULT 'USD',
  billing_period TEXT, -- 'monthly', 'yearly'
  
  -- Dates
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Coin purchases
CREATE TABLE public.coin_purchases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  coins_amount INTEGER NOT NULL,
  price_amount DECIMAL(10, 2) NOT NULL,
  price_currency TEXT DEFAULT 'USD',
  
  provider TEXT, -- 'stripe', 'apple', 'google'
  provider_transaction_id TEXT,
  
  status TEXT DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'refunded'
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.coin_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchases" ON public.coin_purchases
  FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- AD REWARDS
-- =============================================

CREATE TABLE public.ad_rewards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  ad_network TEXT NOT NULL, -- 'admob', 'unity', 'applovin'
  ad_type TEXT NOT NULL, -- 'rewarded_video', 'rewarded_interstitial'
  ad_unit_id TEXT,
  
  coins_rewarded INTEGER NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ad_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own ad rewards" ON public.ad_rewards
  FOR SELECT USING (auth.uid() = user_id);

-- Rate limiting: max 10 rewarded ads per day
CREATE INDEX idx_ad_rewards_user_date ON public.ad_rewards(user_id, created_at);

-- =============================================
-- NOTIFICATIONS
-- =============================================

CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  type TEXT NOT NULL, -- 'like', 'comment', 'follow', 'reading_ready', 'daily_horoscope', 'streak_reminder'
  title TEXT NOT NULL,
  body TEXT,
  
  data JSONB, -- Additional data for deep linking
  
  is_read BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, created_at DESC);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Add welcome coins transaction
  INSERT INTO public.coin_transactions (user_id, amount, type, description, balance_after)
  VALUES (NEW.id, 50, 'welcome_bonus', 'Welcome to Aura!', 50);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_dream_entries_updated_at
  BEFORE UPDATE ON public.dream_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Function to update post likes count
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_like_change
  AFTER INSERT OR DELETE ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_post_likes_count();

-- Function to update post comments count
CREATE OR REPLACE FUNCTION public.update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_comment_change
  AFTER INSERT OR DELETE ON public.post_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_post_comments_count();

-- Function to handle coin spending
CREATE OR REPLACE FUNCTION public.spend_coins(
  p_user_id UUID,
  p_amount INTEGER,
  p_description TEXT,
  p_reference_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Get current balance
  SELECT coins INTO v_current_balance FROM public.profiles WHERE id = p_user_id FOR UPDATE;
  
  -- Check if enough coins
  IF v_current_balance < p_amount THEN
    RETURN FALSE;
  END IF;
  
  -- Calculate new balance
  v_new_balance := v_current_balance - p_amount;
  
  -- Update balance
  UPDATE public.profiles SET coins = v_new_balance WHERE id = p_user_id;
  
  -- Record transaction
  INSERT INTO public.coin_transactions (user_id, amount, type, description, reference_id, balance_after)
  VALUES (p_user_id, -p_amount, 'spend', p_description, p_reference_id, v_new_balance);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add coins
CREATE OR REPLACE FUNCTION public.add_coins(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT,
  p_description TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  -- Update balance and get new value
  UPDATE public.profiles 
  SET coins = coins + p_amount 
  WHERE id = p_user_id
  RETURNING coins INTO v_new_balance;
  
  -- Record transaction
  INSERT INTO public.coin_transactions (user_id, amount, type, description, balance_after)
  VALUES (p_user_id, p_amount, p_type, p_description, v_new_balance);
  
  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check daily free reading
CREATE OR REPLACE FUNCTION public.check_daily_free_reading(
  p_user_id UUID,
  p_fortune_type fortune_type
)
RETURNS BOOLEAN AS $$
DECLARE
  v_count INTEGER;
  v_subscription_tier TEXT;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO v_subscription_tier FROM public.profiles WHERE id = p_user_id;
  
  -- Premium users get unlimited
  IF v_subscription_tier = 'premium' THEN
    RETURN TRUE;
  END IF;
  
  -- Plus users get 10 per day
  IF v_subscription_tier = 'plus' THEN
    SELECT COUNT(*) INTO v_count 
    FROM public.fortune_readings 
    WHERE user_id = p_user_id 
      AND created_at >= CURRENT_DATE
      AND created_at < CURRENT_DATE + INTERVAL '1 day';
    RETURN v_count < 10;
  END IF;
  
  -- Free users get 1 per type per day
  SELECT COUNT(*) INTO v_count 
  FROM public.fortune_readings 
  WHERE user_id = p_user_id 
    AND type = p_fortune_type
    AND is_free = true
    AND created_at >= CURRENT_DATE
    AND created_at < CURRENT_DATE + INTERVAL '1 day';
  
  RETURN v_count < 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- STORAGE BUCKETS
-- =============================================

-- Run these in Supabase Dashboard > Storage

-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('readings', 'readings', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('journals', 'journals', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('dreams', 'dreams', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('community', 'community', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('meditations', 'meditations', true);

-- Storage policies would need to be set up in the Supabase Dashboard
