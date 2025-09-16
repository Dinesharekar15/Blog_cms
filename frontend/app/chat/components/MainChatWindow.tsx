'use client'

import { useState } from 'react';

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

interface Message {
  id: string;
  sender: {
    name: string;
    avatar: string;
    isYou?: boolean;
  };
  content: {
    type: 'text' | 'image' | 'card';
    text?: string;
    imageUrl?: string;
    cardData?: {
      title: string;
      description: string;
      imageUrl: string;
      link: string;
    };
  };
  timestamp: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  isLiked?: boolean;
}

interface MainChatWindowProps {
  chat?: Chat;
  onBack: () => void;
  showBackButton: boolean;
}

export default function MainChatWindow({ chat, onBack, showBackButton }: MainChatWindowProps) {
  const [messageText, setMessageText] = useState('');

  // Mock message data
  const messages: Message[] = [
    {
      id: '1',
      sender: {
        name: 'Sarah Chen',
        avatar: '👩‍💻'
      },
      content: {
        type: 'text',
        text: 'Thanks for the latest post! Really enjoyed the insights on modern web development.'
      },
      timestamp: '2:34 PM',
      engagement: {
        likes: 12,
        comments: 3,
        shares: 1
      },
      isLiked: true
    },
    {
      id: '2',
      sender: {
        name: 'Marcus Williams',
        avatar: '👨‍💼'
      },
      content: {
        type: 'card',
        cardData: {
          title: 'Building a $10M SaaS: Lessons from 5 Years of Failures',
          description: 'Every entrepreneur talks about their successes, but today I\'m sharing the brutal failures...',
          imageUrl: '💼',
          link: '#'
        }
      },
      timestamp: '2:45 PM',
      engagement: {
        likes: 24,
        comments: 8,
        shares: 5
      }
    },
    {
      id: '3',
      sender: {
        name: 'You',
        avatar: '👤',
        isYou: true
      },
      content: {
        type: 'text',
        text: 'Great insights Marcus! I particularly resonated with your points about customer validation. Have you considered writing a follow-up about pivoting strategies?'
      },
      timestamp: '3:12 PM',
      engagement: {
        likes: 8,
        comments: 2,
        shares: 0
      }
    },
    {
      id: '4',
      sender: {
        name: 'Elena Rodriguez',
        avatar: '🎨'
      },
      content: {
        type: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=300&fit=crop',
        text: 'Just finished this new design concept. What do you think?'
      },
      timestamp: '3:28 PM',
      engagement: {
        likes: 15,
        comments: 6,
        shares: 3
      }
    }
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Handle send message logic here
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleLike = (messageId: string) => {
    // Handle like toggle logic here
    console.log('Toggling like for message:', messageId);
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Select a chat</h3>
          <p className="text-gray-400">Choose a conversation from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors md:hidden"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-lg">
            {chat.avatar}
          </div>
          
          <div>
            <h2 className="font-semibold text-white">{chat.name}</h2>
            {chat.type === 'group' && (
              <p className="text-sm text-gray-400">{chat.participants} participants</p>
            )}
          </div>
        </div>
        
        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className="flex space-x-3">
            {/* Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-sm flex-shrink-0">
              {message.sender.avatar}
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              {/* Sender Info */}
              <div className="flex items-center space-x-2 mb-2">
                <h4 className={`text-sm font-medium ${
                  message.sender.isYou ? 'text-orange-400' : 'text-white'
                }`}>
                  {message.sender.name}
                </h4>
                <span className="text-xs text-gray-400">{message.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div className="bg-gray-800 rounded-lg p-4 mb-3 border border-gray-700">
                {message.content.type === 'text' && (
                  <p className="text-gray-300 leading-relaxed">{message.content.text}</p>
                )}

                {message.content.type === 'image' && (
                  <div>
                    {message.content.text && (
                      <p className="text-gray-300 mb-3">{message.content.text}</p>
                    )}
                    <img 
                      src={message.content.imageUrl} 
                      alt="Shared image"
                      className="rounded-lg max-w-full h-auto"
                    />
                  </div>
                )}

                {message.content.type === 'card' && message.content.cardData && (
                  <div className="border border-gray-600 rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex space-x-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          {message.content.cardData.imageUrl}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-white mb-1 line-clamp-2">
                            {message.content.cardData.title}
                          </h5>
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {message.content.cardData.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Engagement */}
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <button 
                  onClick={() => toggleLike(message.id)}
                  className={`flex items-center space-x-1 hover:text-orange-400 transition-colors ${
                    message.isLiked ? 'text-orange-400' : ''
                  }`}
                >
                  <svg className="w-4 h-4" fill={message.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{message.engagement.likes}</span>
                </button>
                
                <button className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{message.engagement.comments}</span>
                </button>
                
                <button className="flex items-center space-x-1 hover:text-green-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>{message.engagement.shares}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="flex items-end space-x-3">
          {/* Attachment Button */}
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className={`p-3 rounded-lg transition-colors flex-shrink-0 ${
              messageText.trim() 
                ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}