'use client'

import { useState, useEffect } from 'react';
import HomeLayout from '../components/HomeLayout';
import ChatSidebar from './components/ChatSidebar';
import MainChatWindow from './components/MainChatWindow';

interface OtherUser {
  id: number;
  name: string;
  profileImg: string | null;
}

export default function ChatPage() {
  const [selectedConvId, setSelectedConvId] = useState<number | null>(null);
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const [myId, setMyId] = useState<number>(0);
  const [isMobileViewOpen, setIsMobileViewOpen] = useState(false);

  // Get logged-in user ID from /api/v1/user/me
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${base}/user/me`, { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        setMyId(data?.formatted?.id ?? data?.user?.id ?? 0);
      } catch (err) {
        console.error('Failed to get logged-in user:', err);
      }
    };
    fetchMe();
  }, []);

  const handleConversationSelect = (convId: number, user: OtherUser) => {
    setSelectedConvId(convId);
    setOtherUser(user);
    setIsMobileViewOpen(true);
  };

  const handleBack = () => {
    setIsMobileViewOpen(false);
  };

  return (
    <HomeLayout>
      {/*
        Fixed-position chat panel — anchored to the viewport.
        top-14 = clears the fixed 56px header
        left-0 md:left-16 lg:left-64 = mirrors the fixed sidebar widths
        right-0 bottom-0 = fills to screen edges
        This is the same pattern used by SidebarNavigation itself.
      */}
      <div className="fixed top-14 left-0 md:left-16 lg:left-64 right-0 bottom-0 flex overflow-hidden bg-gray-900">

        {/* ── Left Chat Sidebar ── */}
        <div
          className={`w-full md:w-80 lg:w-[340px] flex-shrink-0 border-r border-gray-700/50 ${
            isMobileViewOpen ? 'hidden md:flex' : 'flex'
          } flex-col`}
        >
          {myId > 0 && (
            <ChatSidebar
              selectedConvId={selectedConvId}
              onConversationSelect={handleConversationSelect}
              myId={myId}
            />
          )}
        </div>

        {/* ── Right Chat Window ── */}
        <div
          className={`flex-1 ${
            !isMobileViewOpen ? 'hidden md:flex' : 'flex'
          } flex-col min-h-0`}
        >
          <MainChatWindow
            conversationId={selectedConvId}
            otherUser={otherUser}
            myId={myId}
            onBack={handleBack}
            showBackButton={isMobileViewOpen}
          />
        </div>

      </div>
    </HomeLayout>
  );
}