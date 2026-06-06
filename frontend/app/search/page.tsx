'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import DashboardLayout from '../components/DashboardLayout'
import { api } from '@/lib/api'

// ─── Types ───────────────────────────────────────────────────────────────────

interface UserResult {
  id: number
  name: string
  profileImg?: string | null
  bio?: string | null
}

interface PostResult {
  id: number
  title: string
  description: string
  imageUrl?: string | null
  createdAt: string
  user: { id: number; name: string; profileImg?: string | null }
  _count: { like: number; comment: number }
}

type SearchType = 'users' | 'posts'

// ─── Avatar ──────────────────────────────────────────────────────────────────

function Avatar({ name, src, size = 'md' }: { name: string; src?: string | null; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'w-14 h-14 text-xl' : size === 'md' ? 'w-10 h-10 text-base' : 'w-8 h-8 text-sm'
  const isValid = src && (src.startsWith('http://') || src.startsWith('https://'))
  if (isValid) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={name} className={`${sizeClass} rounded-full object-cover flex-shrink-0`}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
    )
  }
  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center flex-shrink-0`}>
      <span className="text-white font-bold">{name?.charAt(0)?.toUpperCase() || '?'}</span>
    </div>
  )
}

function plainText(html: string, maxChars = 200) {
  const stripped = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return stripped.length > maxChars ? stripped.slice(0, maxChars) + '…' : stripped
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

// ─── Search Content ───────────────────────────────────────────────────────────

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<SearchType>('users')
  const [users, setUsers] = useState<UserResult[]>([])
  const [posts, setPosts] = useState<PostResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  // Initialise from URL on mount
  useEffect(() => {
    const q = searchParams.get('q') || ''
    const type = (searchParams.get('type') || 'users') as SearchType
    setQuery(q)
    setSearchType(type)
    if (q.trim()) runSearch(q, type)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  async function runSearch(q: string, type: SearchType) {
    if (!q.trim()) return
    setLoading(true)
    setSearched(false)
    try {
      if (type === 'users') {
        const res = await api.get(`/user/search/users?q=${encodeURIComponent(q)}`)
        setUsers(res.data.users || [])
        setPosts([])
      } else {
        const res = await api.get(`/user/search/posts?q=${encodeURIComponent(q)}`)
        setPosts(res.data.posts || [])
        setUsers([])
      }
    } catch {
      setUsers([]); setPosts([])
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  function handleSearch() {
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}&type=${searchType}`)
  }

  function handleTabSwitch(type: SearchType) {
    setSearchType(type)
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}&type=${type}`)
    }
  }

  const results = searchType === 'users' ? users : posts
  const hasResults = results.length > 0

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <h1 className="text-2xl font-bold text-white mb-6">Search</h1>

        {/* ── Search bar ─────────────────────────────────────────────────── */}
        <div className="flex gap-2 mb-6">
          <div className="flex-1 relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 w-5 h-5"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch() }}
              placeholder="Search for users or posts…"
              className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors flex-shrink-0"
          >
            Search
          </button>
        </div>

        {/* ── Type tabs ──────────────────────────────────────────────────── */}
        <div className="flex gap-1 mb-8 bg-gray-800/50 p-1 rounded-xl w-fit border border-gray-700/50">
          {(['users', 'posts'] as SearchType[]).map(t => (
            <button
              key={t}
              onClick={() => handleTabSwitch(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-150 ${
                searchType === t
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Results count ──────────────────────────────────────────────── */}
        {searched && query && (
          <p className="text-sm text-gray-400 mb-4">
            {hasResults
              ? <><span className="text-white font-semibold">{results.length}</span> {searchType} found for <span className="text-orange-400 font-medium">&ldquo;{query}&rdquo;</span></>
              : <>No {searchType} found for <span className="text-orange-400 font-medium">&ldquo;{query}&rdquo;</span></>
            }
          </p>
        )}

        {/* ── Loading ────────────────────────────────────────────────────── */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* ── Empty state ────────────────────────────────────────────────── */}
        {!loading && searched && !hasResults && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🔍</div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No results found</h3>
            <p className="text-gray-500 text-sm">Try a different keyword or switch tab</p>
          </div>
        )}

        {/* ── Initial empty state ────────────────────────────────────────── */}
        {!loading && !searched && !query && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✨</div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">What are you looking for?</h3>
            <p className="text-gray-500 text-sm">Search for users or posts above</p>
          </div>
        )}

        {/* ── User results ───────────────────────────────────────────────── */}
        {!loading && searchType === 'users' && users.length > 0 && (
          <div className="space-y-3">
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => router.push(`/profile/${user.id}`)}
                className="w-full flex items-center gap-4 p-4 bg-gray-800 hover:bg-gray-800/80 border border-gray-700 hover:border-gray-600 rounded-xl transition-all group text-left"
              >
                <Avatar name={user.name} src={user.profileImg} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-base group-hover:text-orange-300 transition-colors">
                    {user.name}
                  </p>
                  {user.bio && (
                    <p className="text-gray-400 text-sm mt-0.5 line-clamp-2">{user.bio}</p>
                  )}
                </div>
                <div className="flex-shrink-0 px-4 py-1.5 bg-gray-700 hover:bg-orange-500 text-white text-sm font-medium rounded-full transition-colors">
                  View Profile
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── Post results ───────────────────────────────────────────────── */}
        {!loading && searchType === 'posts' && posts.length > 0 && (
          <div className="space-y-3">
            {posts.map(post => (
              <button
                key={post.id}
                onClick={() => router.push(`/blog/${post.id}`)}
                className="w-full flex gap-4 p-4 bg-gray-800 hover:bg-gray-800/80 border border-gray-700 hover:border-gray-600 rounded-xl transition-all group text-left"
              >
                {/* Thumbnail */}
                {post.imageUrl && (post.imageUrl.startsWith('http://') || post.imageUrl.startsWith('https://')) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-24 h-20 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                ) : (
                  <div className="w-24 h-20 rounded-lg bg-gray-700 border border-gray-600 flex items-center justify-center flex-shrink-0 text-2xl">
                    📝
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-base group-hover:text-orange-300 transition-colors line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2 leading-relaxed">
                    {plainText(post.description)}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Avatar name={post.user.name} src={post.user.profileImg} size="sm" />
                      <span>{post.user.name}</span>
                    </div>
                    <span>·</span>
                    <span>{timeAgo(post.createdAt)}</span>
                    <span>·</span>
                    <span>❤️ {post._count.like}</span>
                    <span>💬 {post._count.comment}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SearchPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <SearchContent />
      </Suspense>
    </DashboardLayout>
  )
}