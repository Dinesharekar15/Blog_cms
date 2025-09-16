'use client'

import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChatSidebar from './components/ChatSidebar';
import MainChatWindow from './components/MainChatWindow';

interface Chat {
  id: string;
  name: string;
  type: 'direct' | 'group';
  avatar: string;
  lastMessage: {
    text: string;
    timestamp: string;
    sender: string;
    unread?: boolean;
  };
  participants: number;
}

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<string>('1');
  const [isMobileViewOpen, setIsMobileViewOpen] = useState(false);

  // Mock chat data
  const chats: Chat[] = [
    {
      id: '1',
      name: 'Dinesh Arekar Subscriber Chat',
      type: 'group',
      avatar: '👥',
      lastMessage: {
        text: 'Thanks for the latest post! Really enjoyed the insights on modern web development.',
        timestamp: '2 min ago',
        sender: 'Sarah Chen',
        unread: true
      },
      participants: 156
    },
    {
      id: '2', 
      name: 'Sarah Chen',
      type: 'direct',
      avatar: '👩‍💻',
      lastMessage: {
        text: 'Are you planning to write about AI tools soon?',
        timestamp: '1 hour ago',
        sender: 'Sarah Chen'
      },
      participants: 2
    },
    {
      id: '3',
      name: 'Tech Writers Community',
      type: 'group', 
      avatar: '💻',
      lastMessage: {
        text: 'Marcus Williams shared a new article about remote work productivity',
        timestamp: '3 hours ago',
        sender: 'Marcus Williams'
      },
      participants: 89
    },
    {
      id: '4',
      name: 'Marcus Williams',
      type: 'direct',
      avatar: '👨‍💼',
      lastMessage: {
        text: 'Great collaboration on the startup guide!',
        timestamp: '1 day ago',
        sender: 'Marcus Williams'
      },
      participants: 2
    },
    {
      id: '5',
      name: 'Creative Minds Hub',
      type: 'group',
      avatar: '🎨',
      lastMessage: {
        text: 'Elena Rodriguez: Just posted some new design inspiration',
        timestamp: '2 days ago',
        sender: 'Elena Rodriguez',
        unread: true
      },
      participants: 234
    }
  ];

  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    setIsMobileViewOpen(true);
  };

  const handleBackToList = () => {
    setIsMobileViewOpen(false);
  };

  return (
    <DashboardLayout>
      {/* Chat Layout Container */}
      <div className="flex-1 flex h-screen relative">
        
        {/* Left Chat List - Hidden on mobile when chat is open */}
        <div className={`w-full md:w-80 lg:w-96 bg-gray-800 border-r border-gray-700 flex-shrink-0 ${
          isMobileViewOpen ? 'hidden md:flex' : 'flex'
        } flex-col`}>
          <ChatSidebar 
            chats={chats}
            selectedChatId={selectedChatId}
            onChatSelect={handleChatSelect}
          />
        </div>

        {/* Main Chat Window - Full width on mobile, flexible on desktop */}
        <div className={`flex-1 ${
          !isMobileViewOpen ? 'hidden md:flex' : 'flex'
        } flex-col`}>
          <MainChatWindow 
            chat={selectedChat}
            onBack={handleBackToList}
            showBackButton={isMobileViewOpen}
          />
        </div>

      </div>
    </DashboardLayout>
  );
}