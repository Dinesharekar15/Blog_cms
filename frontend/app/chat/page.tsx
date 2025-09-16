'use client'

import { useState } from 'react';
import SidebarNavigation from '../home/components/SidebarNavigation';
import ChatSidebar from './components/ChatSidebar';
import MainChatWindow from './components/MainChatWindow';
import ActivitySidebar from '../components/ActivitySidebar';
import SearchModal from '../components/SearchModal';

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
  const [isActivitySidebarOpen, setIsActivitySidebarOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

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

  const handleActivityToggle = () => {
    setIsActivitySidebarOpen(!isActivitySidebarOpen);
  };

  const handleActivityClose = () => {
    setIsActivitySidebarOpen(false);
  };

  const handleSearchToggle = () => {
    setIsSearchModalOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchModalOpen(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen flex overflow-hidden relative">
      {/* Desktop Left Sidebar Navigation */}
      <SidebarNavigation 
        onActivityClick={handleActivityToggle} 
        isActivityOpen={isActivitySidebarOpen}
        onSearchClick={handleSearchToggle}
      />
      
      {/* Chat Layout Container */}
      <div className="flex-1 ml-0 md:ml-16 lg:ml-64 flex h-screen relative">
        
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

      {/* Activity Sidebar */}
      <ActivitySidebar 
        isOpen={isActivitySidebarOpen}
        onClose={handleActivityClose}
      />

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={handleSearchClose} 
      />
    </div>
  );
}