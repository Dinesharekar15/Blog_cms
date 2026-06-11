'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import HomeLayout from '../components/HomeLayout'
import { api } from '@/lib/api'
import { getProfileImageUrl } from '@/lib/cloudinary'

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
  const sizeClass = size === 'lg' ? 'w-12 h-12 text-xl' : size === 'md' ? 'w-10 h-10 text-base' : 'w-7 h-7 text-xs'
  const imgUrl = getProfileImageUrl(src)
  if (imgUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imgUrl} alt={name} className={`${sizeClass} rounded-full object-cover flex-shrink-0`}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
    )
  }
  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center flex-shrink-0`}>
      <span className="text-white font-bold">{name?.charAt(0)?.toUpperCase() || '?'}</span>
    </div>
  )
}

function plainText(html: string, maxChars = 180) {
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
      <div className="w-full max-w-3xl mx-auto px-4 py-8">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white">
            {query ? (
              <>Results for <span className="text-orange-400">&ldquo;{query}&rdquo;</span></>
            ) : 'Search'}
          </h1>
        </div>

        {/* ── Type tabs ─────────────────────────────────────────────────── */}
        <div className="flex gap-1 mb-6 bg-gray-800/50 p-1 rounded-xl w-fit border border-gray-700/50">
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

        {/* ── Result count ──────────────────────────────────────────────── */}
        {searched && query && (
          <p className="text-sm text-gray-400 mb-4">
            {hasResults
              ? <><span className="text-white font-semibold">{results.length}</span> {searchType} found</>
              : <>No {searchType} found for <span className="text-orange-400 font-medium">&ldquo;{query}&rdquo;</span></>
            }
          </p>
        )}

        {/* ── Loading ───────────────────────────────────────────────────── */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* ── Empty / initial state ─────────────────────────────────────── */}
        {!loading && !searched && !query && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✨</div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">What are you looking for?</h3>
            <p className="text-gray-500 text-sm">Use the search bar above to find users or posts</p>
          </div>
        )}

        {!loading && searched && !hasResults && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🔍</div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No results found</h3>
            <p className="text-gray-500 text-sm">Try a different keyword or switch tabs</p>
          </div>
        )}

        {/* ── User results ──────────────────────────────────────────────── */}
        {!loading && searchType === 'users' && users.length > 0 && (
          <div className="space-y-3">
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => router.push(`/profile/${user.id}`)}
                className="w-full flex items-center gap-4 p-4 bg-gray-800 hover:bg-gray-800/80 border border-gray-700 hover:border-orange-500/50 rounded-xl transition-all group text-left"
              >
                <Avatar name={user.name} src={user.profileImg} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-base group-hover:text-orange-300 transition-colors truncate">
                    {user.name}
                  </p>
                  {user.bio && (
                    <p className="text-gray-400 text-sm mt-0.5 line-clamp-1">{user.bio}</p>
                  )}
                </div>
                <span className="flex-shrink-0 px-4 py-1.5 bg-gray-700 group-hover:bg-orange-500 text-white text-sm font-medium rounded-full transition-colors">
                  View Profile
                </span>
              </button>
            ))}
          </div>
        )}

        {/* ── Post results ──────────────────────────────────────────────── */}
        {!loading && searchType === 'posts' && posts.length > 0 && (
          <div className="divide-y divide-gray-800">
            {posts.map(post => (
              <button
                key={post.id}
                onClick={() => router.push(`/blog/${post.id}`)}
                className="w-full flex gap-4 py-5 hover:bg-gray-800/40 transition-colors group text-left px-2 rounded-xl"
              >
                {/* Author + meta row */}
                <div className="flex-1 min-w-0">
                  {/* Author */}
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar name={post.user.name} src={post.user.profileImg} size="sm" />
                    <span className="text-gray-400 text-xs font-medium">{post.user.name}</span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-gray-500 text-xs">{timeAgo(post.createdAt)}</span>
                  </div>

                  {/* Title + description */}
                  <h3 className="text-white font-bold text-base group-hover:text-orange-300 transition-colors line-clamp-2 mb-1 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                    {plainText(post.description)}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>❤️ {post._count.like}</span>
                    <span>💬 {post._count.comment}</span>
                  </div>
                </div>

                {/* Thumbnail */}
                {post.imageUrl && (
                  <div className="w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        post.imageUrl.startsWith('http')
                          ? post.imageUrl
                          : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_200,c_limit/${post.imageUrl}`
                      }
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>
                )}
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
    <HomeLayout showSidebar={false}>
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <SearchContent />
      </Suspense>
    </HomeLayout>
  )
}