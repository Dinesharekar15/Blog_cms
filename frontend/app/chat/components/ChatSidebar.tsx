'use client'

import { useState, useEffect, useCallback } from 'react';
import { fetchConversations, getOrCreateConversation } from '@/services/chatService';
import type { Conversation } from '@/services/chatService';
import { getSocket } from '@/lib/socket';

interface ChatSidebarProps {
  selectedConvId: number | null;
  onConversationSelect: (convId: number, otherUser: { id: number; name: string; profileImg: string | null }) => void;
  myId: number;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function Avatar({ name, profileImg, size = 'md' }: { name: string; profileImg: string | null; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-11 h-11 text-sm';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  // profileImg is a Cloudinary public_id (e.g. "blog_cms/abc123") — build the full URL
  const imgSrc = profileImg
    ? profileImg.startsWith('http')
      ? profileImg
      : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${profileImg}`
    : null;

  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={name}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0`}
      />
    );
  }
  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center font-semibold text-white flex-shrink-0`}>
      {initials}
    </div>
  );
}

export default function ChatSidebar({ selectedConvId, onConversationSelect, myId }: ChatSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: number; name: string; profileImg: string | null }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      const data = await fetchConversations();
      setConversations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Socket — update unread badge when new message arrives for another conv
  useEffect(() => {
    const socket = getSocket();
    const handleUnreadUpdate = ({ conversationId }: { conversationId: number }) => {
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId
            ? { ...c, unreadCount: c.id === selectedConvId ? 0 : c.unreadCount + 1 }
            : c
        )
      );
      // Reload to get correct last message preview
      loadConversations();
    };

    socket.on('unread_update', handleUnreadUpdate);
    return () => { socket.off('unread_update', handleUnreadUpdate); };
  }, [selectedConvId, loadConversations]);

  // Search users via API
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(
          `${base}/user/search/users?q=${encodeURIComponent(searchQuery)}`,
          { credentials: 'include' }
        );
        const data = await res.json();
        setSearchResults((data.users || []).filter((u: any) => u.id !== myId));
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery, myId]);

  const handleSelectUser = async (user: { id: number; name: string; profileImg: string | null }) => {
    setSearchQuery('');
    setSearchResults([]);
    try {
      const { conversation } = await getOrCreateConversation(user.id);
      onConversationSelect(conversation.id, user);
      // Refresh list so new conv appears
      loadConversations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectConversation = (conv: Conversation) => {
    setConversations(prev =>
      prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c)
    );
    onConversationSelect(conv.id, conv.otherUser);
  };

  const filtered = conversations.filter(c => {
    const matchesFilter = activeFilter === 'all' || (activeFilter === 'unread' && c.unreadCount > 0);
    const matchesSearch = c.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && (searchQuery.trim() ? matchesSearch : true);
  });

  return (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-700/50">
      {/* ── Header ── */}
      <div className="px-4 pt-5 pb-3 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white tracking-tight">Messages</h1>
          <button
            title="New conversation"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-orange-500 text-gray-400 hover:text-white transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Search bar */}
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search people..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
          />
          {isSearching && (
            <div className="absolute right-3 inset-y-0 flex items-center">
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5">
          {(['all', 'unread'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all duration-200 ${
                activeFilter === filter
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {filter}
              {filter === 'unread' && conversations.some(c => c.unreadCount > 0) && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeFilter === 'unread' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'
                }`}>
                  {conversations.filter(c => c.unreadCount > 0).reduce((sum, c) => sum + c.unreadCount, 0)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search Results Dropdown ── */}
      {searchResults.length > 0 && (
        <div className="mx-3 mt-2 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-xl shadow-black/30 z-10">
          <p className="px-3 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">People</p>
          {searchResults.map(user => (
            <button
              key={user.id}
              onClick={() => handleSelectUser(user)}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-700 transition-colors"
            >
              <Avatar name={user.name} profileImg={user.profileImg} size="sm" />
              <span className="text-sm text-white font-medium">{user.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Conversation List ── */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-auto-hide">
        {loading ? (
          <div className="space-y-3 p-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                <div className="w-11 h-11 rounded-full bg-gray-800 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-800 rounded w-3/4" />
                  <div className="h-2.5 bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-6">
            <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">
              {activeFilter === 'unread' ? 'No unread messages' : 'No conversations yet'}
            </p>
            <p className="text-xs text-gray-600 mt-1">Search for someone to start chatting</p>
          </div>
        ) : (
          <div className="space-y-0.5 px-2">
            {filtered.map(conv => {
              const isSelected = conv.id === selectedConvId;
              const hasUnread = conv.unreadCount > 0;

              return (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-500/15 to-transparent border border-orange-500/20'
                      : 'hover:bg-gray-800/60 border border-transparent'
                  }`}
                >
                  {/* Avatar with unread dot */}
                  <div className="relative">
                    <Avatar name={conv.otherUser.name} profileImg={conv.otherUser.profileImg} />
                    {hasUnread && (
                      <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-orange-500 rounded-full border-2 border-gray-900" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm truncate ${hasUnread || isSelected ? 'font-semibold text-white' : 'font-medium text-gray-300'}`}>
                        {conv.otherUser.name}
                      </span>
                      {conv.lastMessage && (
                        <span className="text-[11px] text-gray-500 flex-shrink-0">
                          {formatRelativeTime(conv.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className={`text-xs truncate flex items-center gap-1 ${hasUnread ? 'text-gray-300' : 'text-gray-500'}`}>
                        {/* Double-tick for sent messages */}
                        {conv.lastMessage?.isMine && (
                          <svg
                            className={`w-3.5 h-3.5 flex-shrink-0 ${conv.lastMessage.isRead ? 'text-orange-400' : 'text-gray-500'}`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M18 7l-9.9 9.9-4.5-4.5 1.4-1.4 3.1 3.1L16.6 5.6 18 7zm-2.5-2.5l-9.9 9.9-1.4-1.4 9.9-9.9 1.4 1.4z" />
                          </svg>
                        )}
                        {conv.lastMessage?.content ?? 'Start the conversation'}
                      </p>
                      {hasUnread && (
                        <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}