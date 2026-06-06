'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

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
  user: { id: number; name: string }
}

type SearchType = 'users' | 'posts'

// ─── Debounce ────────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

// ─── Avatar ──────────────────────────────────────────────────────────────────

function Avatar({ name, src }: { name: string; src?: string | null }) {
  const isValidUrl = src && (src.startsWith('http://') || src.startsWith('https://'))
  if (isValidUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
    )
  }
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center flex-shrink-0">
      <span className="text-white font-semibold text-sm">{name?.charAt(0)?.toUpperCase() || '?'}</span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<SearchType>('users')
  const [focused, setFocused] = useState(false)
  const [users, setUsers] = useState<UserResult[]>([])
  const [posts, setPosts] = useState<PostResult[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debouncedQuery = useDebounce(query, 300)

  // ── Fetch (tab passed directly — avoids stale closure) ────────────────────

  const fetchResults = useCallback(async (q: string, type: SearchType) => {
    if (!q.trim()) {
      setUsers([]); setPosts([]); setHasMore(false); setError(null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      if (type === 'users') {
        const res = await api.get(`/user/search/users?q=${encodeURIComponent(q)}`)
        setUsers(res.data.users || [])
        setHasMore(res.data.hasMore || false)
      } else {
        const res = await api.get(`/user/search/posts?q=${encodeURIComponent(q)}`)
        setPosts(res.data.posts || [])
        setHasMore(res.data.hasMore || false)
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { msg?: string } }; message?: string })
      setError(msg?.response?.data?.msg || 'Search failed')
    } finally {
      setLoading(false)
    }
  }, [])

  // Re-fetch whenever debounced query or tab changes
  useEffect(() => {
    fetchResults(debouncedQuery, searchType)
  }, [debouncedQuery, searchType, fetchResults])

  // ── Close on click outside ────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── ESC to close ──────────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setFocused(false); inputRef.current?.blur() }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // ── Handlers ──────────────────────────────────────────────────────────────

  function goToSearchPage() {
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}&type=${searchType}`)
    setFocused(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') goToSearchPage()
  }

  function handleUserClick(userId: number) {
    router.push(`/profile/${userId}`)
    setFocused(false); setQuery('')
  }

  function handlePostClick(postId: number) {
    router.push(`/blog/${postId}`)
    setFocused(false); setQuery('')
  }

  function handleTabChange(type: SearchType) {
    setSearchType(type)
    setUsers([]); setPosts([]); setHasMore(false)
  }

  // ── Derived ───────────────────────────────────────────────────────────────

  const showDropdown = focused
  const hasQuery = query.trim().length > 0
  const resultsCount = searchType === 'users' ? users.length : posts.length
  const hasResults = resultsCount > 0

  // Strip HTML tags from description for plain text preview
  function plainText(html: string, maxChars = 120) {
    const stripped = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    return stripped.length > maxChars ? stripped.slice(0, maxChars) + '…' : stripped
  }

  return (
    <>
      {/* ── Blur overlay ───────────────────────────────────────────────────── */}
      {focused && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px] transition-all duration-200"
          onClick={() => { setFocused(false); inputRef.current?.blur() }}
        />
      )}

      {/* ── Search container ───────────────────────────────────────────────── */}
      <div ref={containerRef} className="relative z-40 w-full max-w-xl mx-auto">

        {/* Input pill */}
        <div className={`
          flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200
          ${focused
            ? 'bg-gray-800 border-orange-500 shadow-xl shadow-orange-500/10'
            : 'bg-gray-800/60 border-gray-700 hover:border-gray-500'}
        `}>
          {/* Search icon */}
          <svg className={`w-4 h-4 flex-shrink-0 transition-colors ${focused ? 'text-orange-400' : 'text-gray-500'}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={`Search ${searchType}…`}
            className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm min-w-0"
          />

          {/* Loading spinner */}
          {loading && (
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          )}

          {/* Clear button */}
          {query && !loading && (
            <button
              onClick={() => { setQuery(''); setUsers([]); setPosts([]); inputRef.current?.focus() }}
              className="text-gray-500 hover:text-white transition-colors flex-shrink-0 p-0.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* ── Dropdown ─────────────────────────────────────────────────────── */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700/80 rounded-2xl shadow-2xl overflow-hidden">

            {/* Tab switcher */}
            <div className="flex items-center gap-1 px-3 pt-3 pb-2 border-b border-gray-800">
              {(['users', 'posts'] as SearchType[]).map(t => (
                <button
                  key={t}
                  onClick={() => handleTabChange(t)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-150 ${
                    searchType === t
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="max-h-[360px] overflow-y-auto">

              {/* Error */}
              {error && (
                <p className="px-4 py-3 text-sm text-red-400 text-center">⚠️ {error}</p>
              )}

              {/* Idle hint */}
              {!hasQuery && !error && (
                <p className="px-4 py-6 text-sm text-gray-500 text-center">
                  Start typing to search {searchType}…
                </p>
              )}

              {/* No results */}
              {hasQuery && !loading && !hasResults && !error && (
                <p className="px-4 py-6 text-sm text-gray-500 text-center">
                  No {searchType} found for <span className="text-orange-400 font-medium">&ldquo;{query}&rdquo;</span>
                </p>
              )}

              {/* ── User results ──────────────────────────────────────────── */}
              {searchType === 'users' && users.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800/70 transition-colors text-left group border-b border-gray-800/60 last:border-0"
                >
                  <Avatar name={user.name} src={user.profileImg} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate group-hover:text-orange-300 transition-colors">
                      {user.name}
                    </p>
                    {user.bio && (
                      <p className="text-gray-500 text-xs truncate mt-0.5">{user.bio}</p>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-orange-400 flex-shrink-0 transition-colors"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}

              {/* ── Post results ─────────────────────────────────────────── */}
              {searchType === 'posts' && posts.map(post => (
                <button
                  key={post.id}
                  onClick={() => handlePostClick(post.id)}
                  className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-800/70 transition-colors text-left group border-b border-gray-800/60 last:border-0"
                >
                  {/* Post icon / thumbnail */}
                  <div className="w-9 h-9 mt-0.5 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {post.imageUrl && (post.imageUrl.startsWith('http://') || post.imageUrl.startsWith('https://')) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.imageUrl} alt="" className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    ) : (
                      <span className="text-base">📝</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium leading-snug group-hover:text-orange-300 transition-colors line-clamp-1">
                      {post.title}
                    </p>
                    <p className="text-gray-500 text-xs leading-relaxed mt-0.5 line-clamp-2">
                      {plainText(post.description)}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">by {post.user.name}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* See more on search page */}
            {hasQuery && hasMore && !loading && (
              <div className="border-t border-gray-800">
                <button
                  onClick={goToSearchPage}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-orange-400 hover:text-orange-300 hover:bg-gray-800/40 transition-colors"
                >
                  See all results for &ldquo;{query}&rdquo;
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            )}

            {/* Footer hint */}
            {hasQuery && hasResults && (
              <div className="px-4 py-2 bg-gray-800/30 border-t border-gray-800 flex items-center gap-3 text-xs text-gray-600">
                <span><kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">↵</kbd> to see all results</span>
                <span><kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">Esc</kbd> to close</span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
