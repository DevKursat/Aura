'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  Coffee, 
  Moon, 
  Sparkles, 
  Heart, 
  Users,
  Shield,
  Zap,
  ChevronRight,
  Play,
  Apple,
  Smartphone,
  Quote,
  CheckCircle2,
  ArrowRight,
  Globe,
  MessageCircle,
  TrendingUp,
  Award
} from 'lucide-react'
import { Button } from '@/components/ui'

// Features data
const features = [
  {
    icon: Coffee,
    title: 'Kahve Falı',
    description: 'Fincanındaki sırları AI teknolojisiyle keşfet',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Sparkles,
    title: 'Tarot',
    description: 'Kadim kartların rehberliğinde geleceğini öğren',
    color: 'from-purple-500 to-pink-600',
  },
  {
    icon: Star,
    title: 'Astroloji',
    description: 'Yıldızların sana ne söylediğini dinle',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Moon,
    title: 'Rüya Yorumu',
    description: 'Rüyalarının gizemli mesajlarını çöz',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    icon: Heart,
    title: 'Meditasyon',
    description: 'İç huzurunu bul, zihnini dinlendir',
    color: 'from-rose-500 to-pink-600',
  },
  {
    icon: Users,
    title: 'Topluluk',
    description: 'Deneyimlerini paylaş, ilham al',
    color: 'from-teal-500 to-cyan-600',
  },
]

// Testimonials data
const testimonials = [
  {
    name: 'Ayşe K.',
    avatar: '👩',
    role: 'Premium Üye',
    rating: 5,
    text: 'Kahve falı yorumları inanılmaz detaylı! Sanki karşımda oturan bir falcı gibi. Her sabah burcumu okumak günlük ritüelim oldu.',
    date: '2 gün önce',
  },
  {
    name: 'Mehmet Y.',
    avatar: '👨',
    role: '3 Aydır Kullanıyor',
    rating: 5,
    text: 'Rüya yorumlama özelliği harika. Rüyalarımı yazdıktan sonra AI\'ın verdiği yorumlar gerçekten anlam kazandırıyor.',
    date: '1 hafta önce',
  },
  {
    name: 'Zeynep S.',
    avatar: '👩‍🦰',
    role: 'Plus Üye',
    rating: 5,
    text: 'Meditasyon seansları çok kaliteli. Günlük stresimi atmak için mükemmel. Arayüz de çok şık ve kullanımı kolay.',
    date: '3 gün önce',
  },
  {
    name: 'Ali B.',
    avatar: '🧔',
    role: '6 Aydır Kullanıyor',
    rating: 5,
    text: 'Tarot falı özelliği beklentilerimin çok üzerinde. Kartların yorumları derinlikli ve kişiselleştirilmiş.',
    date: '5 gün önce',
  },
  {
    name: 'Elif D.',
    avatar: '👩‍🦱',
    role: 'Premium Üye',
    rating: 5,
    text: 'Yıldızname özelliği muhteşem! Doğum haritam hakkında çok detaylı bilgi aldım. Kesinlikle tavsiye ederim.',
    date: '1 gün önce',
  },
  {
    name: 'Can T.',
    avatar: '👨‍🦲',
    role: '1 Yıldır Kullanıyor',
    rating: 5,
    text: 'Topluluk özelliği sayesinde benzer ilgi alanlarına sahip insanlarla tanıştım. Çok güzel bir deneyim.',
    date: '4 gün önce',
  },
]

// Stats data
const stats = [
  { value: '500K+', label: 'Aktif Kullanıcı' },
  { value: '10M+', label: 'Fal Yorumu' },
  { value: '4.9', label: 'App Store Puanı', icon: Star },
  { value: '50+', label: 'Meditasyon Seansı' },
]

// Pricing tiers
const pricingTiers = [
  {
    name: 'Ücretsiz',
    price: '₺0',
    period: '/ay',
    description: 'Başlamak için ideal',
    features: [
      'Günlük 1 ücretsiz fal',
      'Temel burç yorumları',
      '5 günlük kayıt',
      'Topluluk erişimi',
      'Reklam destekli',
    ],
    cta: 'Hemen Başla',
    popular: false,
  },
  {
    name: 'Plus',
    price: '₺49.99',
    period: '/ay',
    description: 'Daha fazla özellik',
    features: [
      'Günlük 10 fal hakkı',
      'Detaylı astroloji',
      'Sınırsız günlük/rüya',
      'AI görsel üretimi',
      'Azaltılmış reklam',
      'Öncelikli destek',
    ],
    cta: 'Plus\'a Geç',
    popular: true,
  },
  {
    name: 'Premium',
    price: '₺99.99',
    period: '/ay',
    description: 'Tüm özelliklere erişim',
    features: [
      'Sınırsız fal',
      'Yıldızname erişimi',
      'Tüm meditasyonlar',
      'Reklamsız deneyim',
      'Özel rozetler',
      'Erken erişim',
      '7/24 VIP destek',
    ],
    cta: 'Premium Ol',
    popular: false,
  },
]

export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-purple-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
              Aura
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Özellikler</a>
            <a href="#testimonials" className="text-slate-300 hover:text-white transition-colors">Yorumlar</a>
            <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Fiyatlar</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                Giriş Yap
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="gradient" className="bg-gradient-to-r from-teal-500 to-purple-500">
                Ücretsiz Başla
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-4 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500/20 to-purple-500/20 border border-teal-500/30 mb-8"
            >
              <Zap className="w-4 h-4 text-teal-400" />
              <span className="text-sm text-teal-300">AI destekli mistik deneyim</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Geleceğini Keşfet,
              </span>
              <br />
              <span className="bg-gradient-to-r from-teal-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                İç Huzurunu Bul
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Kahve falı, tarot, astroloji, rüya yorumu ve meditasyon... 
              Tüm mistik ihtiyaçlarınız için tek uygulama. AI teknolojisiyle 
              kişiselleştirilmiş deneyim.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/auth/register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-lg px-8 py-6 rounded-xl shadow-lg shadow-teal-500/25"
                >
                  Ücretsiz Dene
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 text-lg px-8 py-6 rounded-xl"
              >
                <Play className="mr-2 w-5 h-5" />
                Nasıl Çalışır?
              </Button>
            </div>

            {/* App Store Badges */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <button className="flex items-center gap-2 px-5 py-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors">
                <Apple className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-400">Yakında</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </button>
              <button className="flex items-center gap-2 px-5 py-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors">
                <Smartphone className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-400">Yakında</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent flex items-center justify-center gap-1">
                    {stat.value}
                    {stat.icon && <stat.icon className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
                  </div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hero Image / Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-16 relative"
          >
            <div className="relative mx-auto max-w-5xl">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/30 via-purple-500/30 to-pink-500/30 blur-3xl rounded-full" />
              
              {/* App preview cards */}
              <div className="relative flex justify-center items-end gap-4 md:gap-8">
                {/* Left card */}
                <motion.div
                  initial={{ opacity: 0, x: -50, rotate: -5 }}
                  animate={{ opacity: 1, x: 0, rotate: -5 }}
                  transition={{ delay: 0.8 }}
                  className="hidden md:block w-48 lg:w-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border border-slate-700/50 shadow-2xl"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <Coffee className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-sm">Kahve Falı</span>
                  </div>
                  <div className="h-32 bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl mb-3" />
                  <div className="space-y-2">
                    <div className="h-2 bg-slate-700 rounded w-full" />
                    <div className="h-2 bg-slate-700 rounded w-3/4" />
                    <div className="h-2 bg-slate-700 rounded w-1/2" />
                  </div>
                </motion.div>

                {/* Center card - Main */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="w-64 md:w-72 lg:w-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-5 border border-slate-700/50 shadow-2xl z-10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-purple-500 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">Aura</div>
                        <div className="text-xs text-slate-500">Günlük Burç</div>
                      </div>
                    </div>
                    <div className="text-yellow-400 text-sm">⭐ 4.9</div>
                  </div>
                  <div className="h-44 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-2xl mb-4 flex items-center justify-center">
                    <div className="text-6xl">♌</div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Aslan Burcu</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Bugün cesaretin ve liderlik özelliklerinin ön plana çıkacağı bir gün...
                  </p>
                  <Button className="w-full bg-gradient-to-r from-teal-500 to-purple-500">
                    Detaylı Oku
                  </Button>
                </motion.div>

                {/* Right card */}
                <motion.div
                  initial={{ opacity: 0, x: 50, rotate: 5 }}
                  animate={{ opacity: 1, x: 0, rotate: 5 }}
                  transition={{ delay: 0.8 }}
                  className="hidden md:block w-48 lg:w-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border border-slate-700/50 shadow-2xl"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Moon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-sm">Rüya Yorumu</span>
                  </div>
                  <div className="h-32 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl mb-3" />
                  <div className="space-y-2">
                    <div className="h-2 bg-slate-700 rounded w-full" />
                    <div className="h-2 bg-slate-700 rounded w-2/3" />
                    <div className="h-2 bg-slate-700 rounded w-4/5" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-4 py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Tüm Özellikler
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Mistik dünyanın kapılarını aralayan özelliklerle dolu, 
              kişiselleştirilmiş deneyiminiz sizi bekliyor.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
                <ChevronRight className="absolute bottom-6 right-6 w-5 h-5 text-slate-600 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
              </motion.div>
            ))}
          </div>

          {/* Additional features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 grid md:grid-cols-3 gap-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Güvenli & Gizli</h4>
                <p className="text-sm text-slate-400">Tüm verileriniz şifrelenir ve gizli kalır</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Globe className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Çoklu Dil</h4>
                <p className="text-sm text-slate-400">Türkçe ve İngilizce dil desteği</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Sürekli Güncelleme</h4>
                <p className="text-sm text-slate-400">Yeni özellikler ve iyileştirmeler</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 px-4 py-20 md:py-32 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Kullanıcılarımız Ne Diyor?
              </span>
            </h2>
            <p className="text-slate-400 text-lg">
              500.000+ kullanıcının güvendiği uygulama
            </p>
          </motion.div>

          {/* Testimonial Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-3xl p-8 md:p-12 border border-slate-700/50"
              >
                <Quote className="w-12 h-12 text-teal-500/30 mb-6" />
                <p className="text-xl md:text-2xl text-slate-200 mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                      <div className="text-sm text-slate-500">{testimonials[currentTestimonial].role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentTestimonial
                      ? 'w-8 bg-teal-500'
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Testimonial Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-4 text-sm line-clamp-3">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-purple-500 rounded-full flex items-center justify-center">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{testimonial.name}</div>
                    <div className="text-xs text-slate-500">{testimonial.date}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 px-4 py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Basit & Şeffaf Fiyatlandırma
              </span>
            </h2>
            <p className="text-slate-400 text-lg">
              İhtiyacınıza uygun planı seçin, istediğiniz zaman iptal edin
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-3xl p-8 ${
                  tier.popular
                    ? 'bg-gradient-to-br from-teal-500/20 to-purple-500/20 border-2 border-teal-500/50'
                    : 'bg-slate-800/50 border border-slate-700/50'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full text-sm font-medium">
                    En Popüler
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{tier.description}</p>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-slate-400 mb-1">{tier.period}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/register">
                  <Button
                    className={`w-full ${
                      tier.popular
                        ? 'bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-teal-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl p-8 md:p-16 border border-slate-700/50 overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
            
            <div className="relative text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Mistik Yolculuğuna Başla
              </h2>
              <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                Hemen ücretsiz kaydol ve AI destekli fal, astroloji, meditasyon 
                deneyiminin tadını çıkar.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/auth/register">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-lg px-8"
                  >
                    Ücretsiz Başla
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8"
                  >
                    Giriş Yap
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-purple-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                  Aura
                </span>
              </div>
              <p className="text-slate-400 text-sm">
                AI destekli mistik deneyim platformu. 
                Geleceğini keşfet, iç huzurunu bul.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Özellikler</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Kahve Falı</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarot</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Astroloji</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Meditasyon</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Şirket</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kariyer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">İletişim</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Yasal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kullanım Koşulları</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Çerez Politikası</a></li>
                <li><a href="#" className="hover:text-white transition-colors">KVKK</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-800">
            <p className="text-slate-500 text-sm">
              © 2024 Aura. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Award className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
