'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { fetchMessages, markConversationRead } from '@/services/chatService';
import type { ChatMessage } from '@/services/chatService';
import {
  getSocket,
  joinConversation,
  leaveConversation,
  sendSocketMessage,
  emitReadMessages,
} from '@/lib/socket';

// Dynamically import EmojiPicker to avoid SSR issues
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

interface OtherUser {
  id: number;
  name: string;
  profileImg: string | null;
}

interface MainChatWindowProps {
  conversationId: number | null;
  otherUser: OtherUser | null;
  myId: number;
  onBack: () => void;
  showBackButton: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMsgTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDateDivider(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

function Avatar({ name, profileImg, size = 'sm' }: { name: string; profileImg: string | null; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-sm' };
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  // profileImg is a Cloudinary public_id — build the full URL
  const imgSrc = profileImg
    ? profileImg.startsWith('http')
      ? profileImg
      : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${profileImg}`
    : null;

  if (imgSrc) {
    return <img src={imgSrc} alt={name} className={`${sizes[size]} rounded-full object-cover flex-shrink-0`} />;
  }
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center font-semibold text-white flex-shrink-0`}>
      {initials}
    </div>
  );
}

// Group messages by date
function groupByDate(messages: ChatMessage[]): Array<{ date: string; messages: ChatMessage[] }> {
  const groups: Record<string, ChatMessage[]> = {};
  messages.forEach(msg => {
    const date = new Date(msg.createdAt).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
  });
  return Object.entries(groups).map(([date, messages]) => ({ date, messages }));
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MainChatWindow({
  conversationId,
  otherUser,
  myId,
  onBack,
  showBackButton,
}: MainChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' });
  }, []);

  // Load messages on conversation change
  const loadMessages = useCallback(async (convId: number) => {
    setLoadingMessages(true);
    setMessages([]);
    try {
      const data = await fetchMessages(convId);
      setMessages(data.messages);
      setHasMore(data.hasMore);
      setNextCursor(data.nextCursor);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Load older messages on scroll up
  const loadOlder = useCallback(async () => {
    if (!conversationId || !nextCursor || loadingMessages) return;
    setLoadingMessages(true);
    try {
      const data = await fetchMessages(conversationId, nextCursor);
      setMessages(prev => [...data.messages, ...prev]);
      setHasMore(data.hasMore);
      setNextCursor(data.nextCursor);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  }, [conversationId, nextCursor, loadingMessages]);

  // Join room + load messages when conversation changes
  useEffect(() => {
    if (!conversationId) return;

    joinConversation(conversationId);
    loadMessages(conversationId);

    // Mark as read
    markConversationRead(conversationId);
    emitReadMessages(conversationId);

    return () => { leaveConversation(conversationId); };
  }, [conversationId, loadMessages]);

  // Scroll to bottom after initial load
  useEffect(() => {
    if (messages.length > 0 && !loadingMessages) {
      scrollToBottom(false);
    }
  }, [conversationId, loadingMessages]);

  // Socket: incoming messages
  useEffect(() => {
    const socket = getSocket();

    const handleMessageReceived = (data: { conversationId: number; message: ChatMessage }) => {
      if (data.conversationId !== conversationId) return;
      setMessages(prev => [...prev, data.message]);
      // If the message is from the other user, mark as read
      if (data.message.senderId !== myId) {
        emitReadMessages(data.conversationId);
        markConversationRead(data.conversationId);
      }
      setTimeout(() => scrollToBottom(true), 50);
    };

    // Read receipt — update isRead on our sent messages
    const handleMessagesRead = (data: { conversationId: number }) => {
      if (data.conversationId !== conversationId) return;
      setMessages(prev =>
        prev.map(m => (m.senderId === myId ? { ...m, isRead: true } : m))
      );
    };

    socket.on('message_received', handleMessageReceived);
    socket.on('messages_read', handleMessagesRead);
    return () => {
      socket.off('message_received', handleMessageReceived);
      socket.off('messages_read', handleMessagesRead);
    };
  }, [conversationId, myId, scrollToBottom]);

  // Send message
  const handleSend = useCallback(() => {
    if (!conversationId || !messageText.trim() || isSending) return;
    setIsSending(true);
    sendSocketMessage(conversationId, messageText.trim());
    setMessageText('');
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsSending(false);
    setTimeout(() => scrollToBottom(true), 50);
  }, [conversationId, messageText, isSending, scrollToBottom]);

  // Enter to send, Shift+Enter for newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`;
  };

  // Insert emoji at cursor position in textarea
  const handleEmojiClick = useCallback((emojiData: { emoji: string }) => {
    const ta = textareaRef.current;
    if (!ta) {
      setMessageText(prev => prev + emojiData.emoji);
      return;
    }
    const start = ta.selectionStart ?? ta.value.length;
    const end = ta.selectionEnd ?? ta.value.length;
    const newText = ta.value.slice(0, start) + emojiData.emoji + ta.value.slice(end);
    setMessageText(newText);
    // Restore cursor position after emoji
    requestAnimationFrame(() => {
      ta.selectionStart = start + emojiData.emoji.length;
      ta.selectionEnd = start + emojiData.emoji.length;
      ta.focus();
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`;
    });
  }, []);

  // Close emoji picker when clicking outside
  useEffect(() => {
    if (!showEmojiPicker) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target as Node) &&
        !emojiButtonRef.current?.contains(e.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  // ─── Empty state ────────────────────────────────────────────────────────────
  if (!conversationId || !otherUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-800/50 rounded-full flex items-center justify-center">
            <svg className="w-9 h-9 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Your messages</h3>
          <p className="text-sm text-gray-500">Search for someone or select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  const groupedMessages = groupByDate(messages);

  return (
    <div className="flex flex-col h-full bg-gray-950">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors md:hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <Avatar name={otherUser.name} profileImg={otherUser.profileImg} size="md" />

          <div>
            <h2 className="font-semibold text-white text-sm leading-tight">{otherUser.name}</h2>
            <p className="text-xs text-green-400 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors" title="View profile">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors" title="More options">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-auto-hide"
      >
        {/* Load more button */}
        {hasMore && (
          <div className="flex justify-center mb-4">
            <button
              onClick={loadOlder}
              disabled={loadingMessages}
              className="text-xs text-orange-400 hover:text-orange-300 bg-gray-800 hover:bg-gray-700 px-4 py-1.5 rounded-full transition-all disabled:opacity-50"
            >
              {loadingMessages ? 'Loading...' : 'Load earlier messages'}
            </button>
          </div>
        )}

        {loadingMessages && messages.length === 0 && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`flex gap-2 animate-pulse ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                <div className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0" />
                <div className={`h-10 bg-gray-800 rounded-2xl ${i % 2 === 0 ? 'w-48' : 'w-36'}`} />
              </div>
            ))}
          </div>
        )}

        {groupedMessages.map(({ date, messages: dayMessages }) => (
          <div key={date}>
            {/* Date divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-800" />
              <span className="text-[11px] text-gray-500 font-medium px-2">
                {formatDateDivider(dayMessages[0].createdAt)}
              </span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>

            {/* Messages */}
            <div className="space-y-1">
              {dayMessages.map((msg, idx) => {
                const isMine = msg.senderId === myId;
                const prevMsg = idx > 0 ? dayMessages[idx - 1] : null;
                const showAvatar = !isMine && (prevMsg?.senderId !== msg.senderId);
                const isConsecutive = prevMsg?.senderId === msg.senderId;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'} ${isConsecutive ? 'mt-0.5' : 'mt-3'}`}
                  >
                    {/* Avatar for received messages */}
                    {!isMine && (
                      <div className="w-8 flex-shrink-0">
                        {showAvatar ? (
                          <Avatar name={msg.sender.name} profileImg={msg.sender.profileImg} size="sm" />
                        ) : null}
                      </div>
                    )}

                    {/* Bubble */}
                    <div className={`max-w-[65%] ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                          isMine
                            ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-br-sm shadow-lg shadow-orange-500/20'
                            : 'bg-gray-800 text-gray-100 rounded-bl-sm border border-gray-700/50'
                        }`}
                      >
                        {msg.content}
                      </div>

                      {/* Time + read receipt */}
                      <div className={`flex items-center gap-1 px-1 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-[10px] text-gray-600">{formatMsgTime(msg.createdAt)}</span>
                        {isMine && (
                          <span title={msg.isRead ? 'Read' : 'Delivered'}>
                            {msg.isRead ? (
                              // Double blue/orange ticks — read
                              <svg className="w-3.5 h-3.5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18 7l-9.9 9.9-4.5-4.5 1.4-1.4 3.1 3.1L16.6 5.6 18 7zm-2.5-2.5l-9.9 9.9-1.4-1.4 9.9-9.9 1.4 1.4z" />
                              </svg>
                            ) : (
                              // Single gray tick — delivered
                              <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                              </svg>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input area ── */}
      <div className="relative px-4 pt-3 pb-16 md:pb-3 bg-gray-900 border-t border-gray-700/50 flex-shrink-0">

        {/* Emoji Picker — floats above the input bar */}
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-full left-2 mb-2 z-50 shadow-2xl rounded-2xl overflow-hidden"
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme={'dark' as any}
              skinTonesDisabled
              searchDisabled={false}
              height={380}
              width={320}
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}

        <div className="flex items-end gap-2">
          {/* Emoji toggle button */}
          <button
            ref={emojiButtonRef}
            onClick={() => setShowEmojiPicker(prev => !prev)}
            className={`p-2 rounded-xl transition-colors flex-shrink-0 mb-0.5 ${
              showEmojiPicker
                ? 'bg-orange-500/20 text-orange-400'
                : 'hover:bg-gray-800 text-gray-500 hover:text-gray-300'
            }`}
            title="Emoji"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={messageText}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${otherUser.name}...`}
              rows={1}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 resize-none transition-all leading-relaxed"
              style={{ minHeight: '44px', maxHeight: '140px' }}
            />
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!messageText.trim() || isSending}
            className={`p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 mb-0.5 ${
              messageText.trim()
                ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-95'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-gray-700 mt-1.5 ml-1">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}