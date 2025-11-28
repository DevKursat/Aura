'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/locales'
import { useAuthStore } from '@/stores'
import { Card, Button, Input, Modal, LoadingSpinner } from '@/components/ui'
import { 
  Plus, 
  Moon, 
  Search,
  ChevronRight,
  Sparkles,
  Image as ImageIcon,
  Trash2,
  Star
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import type { DreamEntry } from '@/lib/supabase/types'

const dreamTypes = [
  { emoji: '😊', label: 'Güzel Rüya', value: 'good' },
  { emoji: '😨', label: 'Kabus', value: 'nightmare' },
  { emoji: '🔮', label: 'Kehanet', value: 'prophetic' },
  { emoji: '🔁', label: 'Tekrarlayan', value: 'recurring' },
  { emoji: '✈️', label: 'Lucid', value: 'lucid' },
]

export default function DreamsPage() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const supabase = createClient()

  const [dreams, setDreams] = useState<DreamEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [selectedDream, setSelectedDream] = useState<DreamEntry | null>(null)

  // New dream form state
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newType, setNewType] = useState('')
  const [newTags, setNewTags] = useState('')
  const [saving, setSaving] = useState(false)
  const [interpreting, setInterpreting] = useState(false)
  const [generatingImage, setGeneratingImage] = useState(false)
  const [interpretation, setInterpretation] = useState('')
  const [generatedImage, setGeneratedImage] = useState('')

  useEffect(() => {
    if (user?.id) {
      fetchDreams()
    }
  }, [user?.id])

  const fetchDreams = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('dream_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('dream_date', { ascending: false })

      if (error) throw error
      setDreams(data || [])
    } catch (error) {
      console.error('Error fetching dreams:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInterpret = async () => {
    if (!newContent.trim()) return

    setInterpreting(true)
    try {
      const response = await fetch('/api/dreams/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dreamContent: newContent }),
      })

      const data = await response.json()
      if (data.interpretation) {
        setInterpretation(data.interpretation)
      }
    } catch (error) {
      console.error('Error interpreting dream:', error)
    } finally {
      setInterpreting(false)
    }
  }

  const handleGenerateImage = async () => {
    if (!newContent.trim()) return

    setGeneratingImage(true)
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: newContent,
          type: 'dream'
        }),
      })

      const data = await response.json()
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl)
      }
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setGeneratingImage(false)
    }
  }

  const handleSaveDream = async () => {
    if (!newContent.trim() || !user?.id) return

    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('dream_entries')
        .insert({
          user_id: user.id,
          title: newTitle || 'Rüya',
          content: newContent,
          dream_type: newType || null,
          tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
          interpretation: interpretation || null,
          generated_image_url: generatedImage || null,
          dream_date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single()

      if (error) throw error
      
      setDreams([data, ...dreams])
      setShowNewModal(false)
      resetForm()
    } catch (error) {
      console.error('Error saving dream:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteDream = async (id: string) => {
    if (!confirm('Bu rüyayı silmek istediğinize emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('dream_entries')
        .delete()
        .eq('id', id)

      if (error) throw error
      setDreams(dreams.filter((d) => d.id !== id))
      setSelectedDream(null)
    } catch (error) {
      console.error('Error deleting dream:', error)
    }
  }

  const resetForm = () => {
    setNewTitle('')
    setNewContent('')
    setNewType('')
    setNewTags('')
    setInterpretation('')
    setGeneratedImage('')
  }

  const filteredDreams = dreams.filter(
    (dream) =>
      dream.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.symbols?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t.nav.dreams} 🌙
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Rüyalarını kaydet ve yorumla
            </p>
          </div>
          <Button variant="gradient" onClick={() => setShowNewModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Rüya Ekle
          </Button>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Rüyalarında ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4"
        >
          <Card className="p-4 text-center">
            <Moon className="mx-auto h-6 w-6 text-indigo-500" />
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {dreams.length}
            </p>
            <p className="text-xs text-slate-500">Toplam Rüya</p>
          </Card>
          <Card className="p-4 text-center">
            <Sparkles className="mx-auto h-6 w-6 text-purple-500" />
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {dreams.filter((d) => d.ai_interpretation).length}
            </p>
            <p className="text-xs text-slate-500">Yorumlanan</p>
          </Card>
          <Card className="p-4 text-center">
            <ImageIcon className="mx-auto h-6 w-6 text-teal-500" />
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {dreams.filter((d) => d.generated_image_url).length}
            </p>
            <p className="text-xs text-slate-500">Görselleşen</p>
          </Card>
        </motion.div>

        {/* Dreams Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredDreams.length === 0 ? (
            <Card className="py-12 text-center">
              <Moon className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
                Henüz rüya kaydınız yok
              </h3>
              <p className="mt-2 text-slate-500">
                Rüyalarınızı kaydedin ve AI ile yorumlayın
              </p>
              <Button
                variant="gradient"
                className="mt-4"
                onClick={() => setShowNewModal(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                İlk Rüyayı Kaydet
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredDreams.map((dream, index) => {
                const typeInfo = dreamTypes.find((t) => t.value === dream.dream_type)
                return (
                  <motion.div
                    key={dream.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className="cursor-pointer overflow-hidden transition-all hover:shadow-md"
                      onClick={() => setSelectedDream(dream)}
                      hoverable
                    >
                      {dream.generated_image_url && (
                        <div className="relative h-40 w-full">
                          <Image
                            src={dream.generated_image_url}
                            alt={dream.title || 'Dream'}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {typeInfo && <span className="text-xl">{typeInfo.emoji}</span>}
                            <h4 className="font-medium text-slate-900 dark:text-white">
                              {dream.title}
                            </h4>
                          </div>
                          {dream.ai_interpretation && (
                            <Sparkles className="h-4 w-4 text-purple-500" />
                          )}
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                          {dream.content}
                        </p>
                        {dream.symbols && dream.symbols.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {dream.symbols.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="mt-3 text-xs text-slate-400">
                          {new Date(dream.dream_date).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* New Dream Modal */}
      <Modal
        isOpen={showNewModal}
        onClose={() => {
          setShowNewModal(false)
          resetForm()
        }}
        title="Yeni Rüya"
        size="lg"
      >
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
          <Input
            label="Başlık"
            placeholder="Rüyana bir başlık ver"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />

          {/* Dream Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Rüya Türü
            </label>
            <div className="flex flex-wrap gap-2">
              {dreamTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setNewType(type.value)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all ${
                    newType === type.value
                      ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <span>{type.emoji}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Rüya İçeriği
            </label>
            <textarea
              placeholder="Rüyanı detaylı bir şekilde anlat..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={6}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <Input
            label="Etiketler (virgülle ayırın)"
            placeholder="uçmak, deniz, aile"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
          />

          {/* AI Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleInterpret}
              isLoading={interpreting}
              disabled={!newContent.trim() || interpreting}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Yorumla
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleGenerateImage}
              isLoading={generatingImage}
              disabled={!newContent.trim() || generatingImage}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Görselleştir
            </Button>
          </div>

          {/* Interpretation Result */}
          {interpretation && (
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 dark:from-purple-900/20 dark:to-indigo-900/20">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">AI Rüya Yorumu</span>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                {interpretation}
              </p>
            </Card>
          )}

          {/* Generated Image */}
          {generatedImage && (
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src={generatedImage}
                alt="Generated dream visualization"
                width={512}
                height={512}
                className="w-full"
              />
            </div>
          )}

          <Button
            variant="gradient"
            className="w-full"
            onClick={handleSaveDream}
            isLoading={saving}
            disabled={!newContent.trim() || saving}
          >
            Kaydet
          </Button>
        </div>
      </Modal>

      {/* Dream Detail Modal */}
      <Modal
        isOpen={!!selectedDream}
        onClose={() => setSelectedDream(null)}
        title={selectedDream?.title || 'Rüya'}
        size="lg"
      >
        {selectedDream && (
          <div className="max-h-[70vh] overflow-y-auto p-6">
            {selectedDream.generated_image_url && (
              <div className="relative mb-6 overflow-hidden rounded-xl">
                <Image
                  src={selectedDream.generated_image_url}
                  alt={selectedDream.title || 'Dream'}
                  width={512}
                  height={512}
                  className="w-full"
                />
              </div>
            )}

            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {dreamTypes.find((t) => t.value === selectedDream.dream_type) && (
                  <span className="text-2xl">
                    {dreamTypes.find((t) => t.value === selectedDream.dream_type)?.emoji}
                  </span>
                )}
                <span className="text-sm text-slate-500">
                  {new Date(selectedDream.dream_date).toLocaleDateString('tr-TR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteDream(selectedDream.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{selectedDream.content}</p>
            </div>

            {selectedDream.symbols && selectedDream.symbols.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedDream.symbols.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {selectedDream.ai_interpretation && (
              <Card className="mt-6 bg-gradient-to-br from-purple-50 to-indigo-50 p-4 dark:from-purple-900/20 dark:to-indigo-900/20">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">AI Rüya Yorumu</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                  {selectedDream.ai_interpretation}
                </p>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
