-- =============================================
-- SUPABASE STORAGE BUCKETS & POLICIES
-- =============================================
-- Bu SQL'i Supabase Dashboard > SQL Editor'de çalıştırın

-- 1. BUCKET'LARI OLUŞTUR
-- =============================================

-- Avatarlar (public - herkes görebilir)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 
  'avatars', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Fal okumaları görselleri (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'readings', 
  'readings', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Günlük görselleri (private - sadece sahibi görebilir)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'journals', 
  'journals', 
  false,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Rüya görselleri (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dreams', 
  'dreams', 
  false,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Topluluk görselleri (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'community', 
  'community', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Meditasyon ses/görsel dosyaları (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'meditations', 
  'meditations', 
  true,
  52428800, -- 50MB limit (ses dosyaları için)
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']
) ON CONFLICT (id) DO NOTHING;

-- 2. STORAGE POLİCİES
-- =============================================

-- AVATARS POLICIES
-- ----------------
-- Herkes avatar görebilir
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Kullanıcılar kendi avatarını yükleyebilir
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Kullanıcılar kendi avatarını güncelleyebilir
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Kullanıcılar kendi avatarını silebilir
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- READINGS POLICIES
-- -----------------
-- Herkes fal görsellerini görebilir
CREATE POLICY "Reading images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'readings');

-- Kullanıcılar kendi fal görsellerini yükleyebilir
CREATE POLICY "Users can upload their own reading images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'readings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Kullanıcılar kendi fal görsellerini silebilir
CREATE POLICY "Users can delete their own reading images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'readings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- JOURNALS POLICIES (Private)
-- ---------------------------
-- Kullanıcılar sadece kendi günlük görsellerini görebilir
CREATE POLICY "Users can view their own journal images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'journals' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Kullanıcılar kendi günlük görsellerini yükleyebilir
CREATE POLICY "Users can upload their own journal images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'journals' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Kullanıcılar kendi günlük görsellerini silebilir
CREATE POLICY "Users can delete their own journal images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'journals' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- DREAMS POLICIES (Private)
-- -------------------------
-- Kullanıcılar sadece kendi rüya görsellerini görebilir
CREATE POLICY "Users can view their own dream images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'dreams' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Kullanıcılar kendi rüya görsellerini yükleyebilir
CREATE POLICY "Users can upload their own dream images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'dreams' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Kullanıcılar kendi rüya görsellerini silebilir
CREATE POLICY "Users can delete their own dream images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'dreams' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- COMMUNITY POLICIES
-- ------------------
-- Herkes topluluk görsellerini görebilir
CREATE POLICY "Community images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'community');

-- Kullanıcılar topluluk görseli yükleyebilir
CREATE POLICY "Authenticated users can upload community images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'community' 
  AND auth.role() = 'authenticated'
);

-- Kullanıcılar kendi yükledikleri görselleri silebilir
CREATE POLICY "Users can delete their own community images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'community' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- MEDITATIONS POLICIES
-- --------------------
-- Herkes meditasyon dosyalarını görebilir/dinleyebilir
CREATE POLICY "Meditation files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'meditations');

-- Sadece adminler meditasyon dosyası yükleyebilir (service role ile)
-- Bu policy yoksa sadece service_role key ile yükleme yapılabilir
