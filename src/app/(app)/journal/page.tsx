'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/locales'
import { useAuthStore } from '@/stores'
import { Card, Button, Input, Modal, LoadingSpinner } from '@/components/ui'
import { 
  Plus, 
  BookOpen, 
  Calendar,
  Search,
  ChevronRight,
  Heart,
  Edit3,
  Trash2,
  Sparkles
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { JournalEntry } from '@/lib/supabase/types'

const moodEmojis = [
  { emoji: '😊', label: 'Mutlu', value: 'happy' },
  { emoji: '😢', label: 'Üzgün', value: 'sad' },
  { emoji: '😌', label: 'Huzurlu', value: 'peaceful' },
  { emoji: '😤', label: 'Sinirli', value: 'angry' },
  { emoji: '😰', label: 'Kaygılı', value: 'anxious' },
  { emoji: '🤔', label: 'Düşünceli', value: 'thoughtful' },
  { emoji: '😴', label: 'Yorgun', value: 'tired' },
  { emoji: '🥰', label: 'Aşık', value: 'in_love' },
]

export default function JournalPage() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const supabase = createClient()

  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)

  // New entry form state
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newMood, setNewMood] = useState('')
  const [saving, setSaving] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    if (user?.id) {
      fetchEntries()
    }
  }, [user?.id])

  const fetchEntries = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setEntries(data || [])
    } catch (error) {
      console.error('Error fetching entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEntry = async () => {
    if (!newContent.trim() || !user?.id) return

    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          title: newTitle || `${new Date().toLocaleDateString('tr-TR')} Günlüğü`,
          content: newContent,
          mood: newMood || null,
        })
        .select()
        .single()

      if (error) throw error
      
      setEntries([data, ...entries])
      setShowNewModal(false)
      resetForm()
    } catch (error) {
      console.error('Error saving entry:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleAnalyze = async () => {
    if (!newContent.trim()) return

    setAnalyzing(true)
    try {
      const response = await fetch('/api/journal/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent }),
      })

      const data = await response.json()
      if (data.analysis) {
        // Show analysis result
        alert(data.analysis)
      }
    } catch (error) {
      console.error('Error analyzing:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleDeleteEntry = async (id: string) => {
    if (!confirm('Bu günlük girdisini silmek istediğinize emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id)

      if (error) throw error
      setEntries(entries.filter((e) => e.id !== id))
      setSelectedEntry(null)
    } catch (error) {
      console.error('Error deleting entry:', error)
    }
  }

  const resetForm = () => {
    setNewTitle('')
    setNewContent('')
    setNewMood('')
  }

  const filteredEntries = entries.filter(
    (entry) =>
      entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedEntries = filteredEntries.reduce((acc, entry) => {
    const date = new Date(entry.created_at).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(entry)
    return acc
  }, {} as Record<string, JournalEntry[]>)

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
              {t.nav.journal} 📔
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Düşüncelerini ve duygularını kaydet
            </p>
          </div>
          <Button variant="gradient" onClick={() => setShowNewModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Günlük
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
              placeholder="Günlüklerinde ara..."
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
            <BookOpen className="mx-auto h-6 w-6 text-emerald-500" />
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {entries.length}
            </p>
            <p className="text-xs text-slate-500">Toplam Girdi</p>
          </Card>
          <Card className="p-4 text-center">
            <Calendar className="mx-auto h-6 w-6 text-blue-500" />
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {Object.keys(groupedEntries).length}
            </p>
            <p className="text-xs text-slate-500">Ay</p>
          </Card>
          <Card className="p-4 text-center">
            <Heart className="mx-auto h-6 w-6 text-rose-500" />
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {entries.filter((e) => e.mood === 'great').length}
            </p>
            <p className="text-xs text-slate-500">Mutlu Gün</p>
          </Card>
        </motion.div>

        {/* Entries List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredEntries.length === 0 ? (
            <Card className="py-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
                Henüz günlük girdiniz yok
              </h3>
              <p className="mt-2 text-slate-500">
                İlk günlüğünüzü yazmaya başlayın
              </p>
              <Button
                variant="gradient"
                className="mt-4"
                onClick={() => setShowNewModal(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                İlk Günlüğü Yaz
              </Button>
            </Card>
          ) : (
            Object.entries(groupedEntries).map(([month, monthEntries]) => (
              <div key={month}>
                <h3 className="mb-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {month}
                </h3>
                <div className="space-y-3">
                  {monthEntries.map((entry, index) => {
                    const moodInfo = moodEmojis.find((m) => m.value === entry.mood)
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card
                          className="cursor-pointer p-4 transition-all hover:shadow-md"
                          onClick={() => setSelectedEntry(entry)}
                          hoverable
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {moodInfo && (
                                  <span className="text-xl">{moodInfo.emoji}</span>
                                )}
                                <h4 className="font-medium text-slate-900 dark:text-white">
                                  {entry.title}
                                </h4>
                              </div>
                              <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                                {entry.content}
                              </p>
                              <p className="mt-2 text-xs text-slate-400">
                                {new Date(entry.created_at).toLocaleDateString('tr-TR', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-slate-400" />
                          </div>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </motion.div>
      </div>

      {/* New Entry Modal */}
      <Modal
        isOpen={showNewModal}
        onClose={() => {
          setShowNewModal(false)
          resetForm()
        }}
        title="Yeni Günlük"
        size="lg"
      >
        <div className="p-6 space-y-6">
          <Input
            label="Başlık (opsiyonel)"
            placeholder="Bugün nasıl geçti?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />

          {/* Mood Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Bugün nasıl hissediyorsun?
            </label>
            <div className="flex flex-wrap gap-2">
              {moodEmojis.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setNewMood(mood.value)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all ${
                    newMood === mood.value
                      ? 'bg-teal-100 text-teal-700 ring-2 ring-teal-500 dark:bg-teal-900/30 dark:text-teal-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <span>{mood.emoji}</span>
                  <span>{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Günlük
            </label>
            <textarea
              placeholder="Düşüncelerini buraya yaz..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={8}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleAnalyze}
              isLoading={analyzing}
              disabled={!newContent.trim() || analyzing}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI Analiz
            </Button>
            <Button
              variant="gradient"
              className="flex-1"
              onClick={handleSaveEntry}
              isLoading={saving}
              disabled={!newContent.trim() || saving}
            >
              Kaydet
            </Button>
          </div>
        </div>
      </Modal>

      {/* Entry Detail Modal */}
      <Modal
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        title={selectedEntry?.title || 'Günlük'}
        size="lg"
      >
        {selectedEntry && (
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {moodEmojis.find((m) => m.value === selectedEntry.mood) && (
                  <span className="text-2xl">
                    {moodEmojis.find((m) => m.value === selectedEntry.mood)?.emoji}
                  </span>
                )}
                <span className="text-sm text-slate-500">
                  {new Date(selectedEntry.created_at).toLocaleDateString('tr-TR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteEntry(selectedEntry.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{selectedEntry.content}</p>
            </div>

            {selectedEntry.ai_insights && (
              <Card className="mt-6 bg-gradient-to-br from-purple-50 to-teal-50 p-4 dark:from-purple-900/20 dark:to-teal-900/20">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">AI Analiz</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {selectedEntry.ai_insights}
                </p>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
