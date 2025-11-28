'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/locales'
import { useAuthStore } from '@/stores'
import { Card, Button, Input, Modal, LoadingSpinner, Avatar } from '@/components/ui'
import { 
  Plus, 
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Image as ImageIcon,
  Send,
  Trash2,
  Users,
  TrendingUp,
  Sparkles
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface Post {
  id: string
  user_id: string
  content: string
  image_url?: string
  category: string
  likes_count: number
  comments_count: number
  created_at: string
  user?: {
    full_name: string
    avatar_url?: string
    username?: string
  }
  liked?: boolean
}

interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  user?: {
    full_name: string
    avatar_url?: string
  }
}

const categories = [
  { id: 'all', label: 'Tümü', emoji: '✨' },
  { id: 'fortune', label: 'Fallar', emoji: '🔮' },
  { id: 'dream', label: 'Rüyalar', emoji: '🌙' },
  { id: 'meditation', label: 'Meditasyon', emoji: '🧘' },
  { id: 'astrology', label: 'Astroloji', emoji: '⭐' },
  { id: 'general', label: 'Genel', emoji: '💬' },
]

export default function CommunityPage() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const supabase = createClient()

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showNewModal, setShowNewModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])

  // New post form state
  const [newContent, setNewContent] = useState('')
  const [newCategory, setNewCategory] = useState('general')
  const [newImage, setNewImage] = useState<string | null>(null)
  const [posting, setPosting] = useState(false)

  // Comment state
  const [newComment, setNewComment] = useState('')
  const [loadingComments, setLoadingComments] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [selectedCategory])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('community_posts')
        .select(`
          *,
          user:profiles(full_name, avatar_url, username)
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory)
      }

      const { data, error } = await query

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async (postId: string) => {
    setLoadingComments(true)
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          *,
          user:profiles(full_name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleCreatePost = async () => {
    if (!newContent.trim() || !user?.id) return

    setPosting(true)
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          content: newContent,
          category: newCategory,
          image_url: newImage,
        })
        .select(`
          *,
          user:profiles(full_name, avatar_url, username)
        `)
        .single()

      if (error) throw error
      
      setPosts([data, ...posts])
      setShowNewModal(false)
      setNewContent('')
      setNewCategory('general')
      setNewImage(null)
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setPosting(false)
    }
  }

  const handleLike = async (post: Post) => {
    if (!user?.id) return

    try {
      if (post.liked) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id)
      } else {
        await supabase
          .from('post_likes')
          .insert({
            post_id: post.id,
            user_id: user.id,
          })
      }

      setPosts(posts.map((p) =>
        p.id === post.id
          ? { 
              ...p, 
              liked: !p.liked, 
              likes_count: p.liked ? p.likes_count - 1 : p.likes_count + 1 
            }
          : p
      ))
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleComment = async () => {
    if (!newComment.trim() || !selectedPost || !user?.id) return

    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          post_id: selectedPost.id,
          user_id: user.id,
          content: newComment,
        })
        .select(`
          *,
          user:profiles(full_name, avatar_url)
        `)
        .single()

      if (error) throw error
      
      setComments([...comments, data])
      setNewComment('')

      // Update comment count
      setPosts(posts.map((p) =>
        p.id === selectedPost.id
          ? { ...p, comments_count: p.comments_count + 1 }
          : p
      ))
    } catch (error) {
      console.error('Error creating comment:', error)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Bu gönderiyi silmek istediğinize emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId)

      if (error) throw error
      setPosts(posts.filter((p) => p.id !== postId))
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    fetchComments(post.id)
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t.nav.community} 👥
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Deneyimlerini paylaş
            </p>
          </div>
          <Button variant="gradient" onClick={() => setShowNewModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Paylaş
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4"
        >
          <Card className="p-4 text-center">
            <Users className="mx-auto h-6 w-6 text-teal-500" />
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              1.2K
            </p>
            <p className="text-xs text-slate-500">Üye</p>
          </Card>
          <Card className="p-4 text-center">
            <TrendingUp className="mx-auto h-6 w-6 text-purple-500" />
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {posts.length}
            </p>
            <p className="text-xs text-slate-500">Gönderi</p>
          </Card>
          <Card className="p-4 text-center">
            <Sparkles className="mx-auto h-6 w-6 text-amber-500" />
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              456
            </p>
            <p className="text-xs text-slate-500">Bugün</p>
          </Card>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <span>{category.emoji}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Posts Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : posts.length === 0 ? (
            <Card className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
                Henüz gönderi yok
              </h3>
              <p className="mt-2 text-slate-500">
                İlk gönderiyi sen paylaş!
              </p>
              <Button
                variant="gradient"
                className="mt-4"
                onClick={() => setShowNewModal(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Gönderi Paylaş
              </Button>
            </Card>
          ) : (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden">
                  {/* Post Header */}
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={post.user?.avatar_url}
                        fallback={post.user?.full_name || 'User'}
                        size="md"
                      />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {post.user?.full_name || 'Anonim'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(post.created_at).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs dark:bg-slate-700">
                        {categories.find((c) => c.id === post.category)?.emoji}{' '}
                        {categories.find((c) => c.id === post.category)?.label}
                      </span>
                      {post.user_id === user?.id && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-3">
                    <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                      {post.content}
                    </p>
                  </div>

                  {/* Post Image */}
                  {post.image_url && (
                    <div className="relative aspect-video w-full">
                      <Image
                        src={post.image_url}
                        alt="Post image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center gap-6 border-t border-slate-100 p-4 dark:border-slate-800">
                    <button
                      onClick={() => handleLike(post)}
                      className={`flex items-center gap-2 ${
                        post.liked
                          ? 'text-rose-500'
                          : 'text-slate-500 hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${post.liked ? 'fill-current' : ''}`} />
                      <span className="text-sm">{post.likes_count}</span>
                    </button>
                    <button
                      onClick={() => openPostDetail(post)}
                      className="flex items-center gap-2 text-slate-500 hover:text-teal-500"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm">{post.comments_count}</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-500 hover:text-blue-500">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* New Post Modal */}
      <Modal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="Yeni Gönderi"
        size="lg"
      >
        <div className="p-6 space-y-6">
          {/* Category Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Kategori
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.filter((c) => c.id !== 'all').map((category) => (
                <button
                  key={category.id}
                  onClick={() => setNewCategory(category.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all ${
                    newCategory === category.id
                      ? 'bg-teal-100 text-teal-700 ring-2 ring-teal-500 dark:bg-teal-900/30 dark:text-teal-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <span>{category.emoji}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              İçerik
            </label>
            <textarea
              placeholder="Düşüncelerini paylaş..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              <ImageIcon className="mr-2 h-4 w-4" />
              Resim Ekle
            </Button>
            <Button
              variant="gradient"
              className="flex-1"
              onClick={handleCreatePost}
              isLoading={posting}
              disabled={!newContent.trim() || posting}
            >
              Paylaş
            </Button>
          </div>
        </div>
      </Modal>

      {/* Post Detail Modal */}
      <Modal
        isOpen={!!selectedPost}
        onClose={() => {
          setSelectedPost(null)
          setComments([])
        }}
        title="Gönderi"
        size="lg"
      >
        {selectedPost && (
          <div className="max-h-[70vh] overflow-y-auto">
            {/* Post Content */}
            <div className="p-6">
              <div className="flex items-center gap-3">
                <Avatar
                  src={selectedPost.user?.avatar_url}
                  fallback={selectedPost.user?.full_name || 'User'}
                  size="md"
                />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {selectedPost.user?.full_name || 'Anonim'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(selectedPost.created_at).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                {selectedPost.content}
              </p>

              {selectedPost.image_url && (
                <div className="mt-4 relative aspect-video w-full overflow-hidden rounded-xl">
                  <Image
                    src={selectedPost.image_url}
                    alt="Post image"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="border-t border-slate-100 dark:border-slate-800">
              <h4 className="p-4 font-medium text-slate-900 dark:text-white">
                Yorumlar ({selectedPost.comments_count})
              </h4>

              {loadingComments ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : comments.length === 0 ? (
                <p className="px-4 pb-4 text-center text-slate-500">
                  Henüz yorum yok
                </p>
              ) : (
                <div className="space-y-4 px-4 pb-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar
                        src={comment.user?.avatar_url}
                        fallback={comment.user?.full_name || 'User'}
                        size="sm"
                      />
                      <div className="flex-1 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {comment.user?.full_name || 'Anonim'}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {comment.content}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {new Date(comment.created_at).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <div className="flex gap-3 border-t border-slate-100 p-4 dark:border-slate-800">
                <Avatar
                  src={user?.profile?.avatar_url}
                  fallback={user?.profile?.full_name || 'User'}
                  size="sm"
                />
                <div className="flex flex-1 gap-2">
                  <Input
                    placeholder="Yorum yaz..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleComment()
                      }
                    }}
                  />
                  <Button
                    variant="gradient"
                    onClick={handleComment}
                    disabled={!newComment.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
