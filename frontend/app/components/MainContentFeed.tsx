'use client'

export default function MainContentFeed() {
  const blogPosts = [
    {
      id: 1,
      author: {
        name: "Sarah Chen",
        username: "@sarahchen",
        avatar: "👩‍💻",
        isVerified: true
      },
      content: {
        title: "The Psychology of Remote Work: Why Some Thrive While Others Struggle",
        excerpt: "After two years of remote work research, I've discovered the key factors that determine success in distributed teams. It's not what you think...",
        image: "📊",
        readTime: "8 min read",
        category: "Business"
      },
      engagement: {
        likes: 234,
        comments: 45,
        shares: 12,
        saves: 89
      },
      isSubscribed: false,
      publishedAt: "2 hours ago"
    },
    {
      id: 2,
      author: {
        name: "Marcus Williams",
        username: "@marcusw",
        avatar: "👨‍💼",
        isVerified: false
      },
      content: {
        title: "Building a $10M SaaS: Lessons from 5 Years of Failures",
        excerpt: "Every entrepreneur talks about their successes, but today I'm sharing the brutal failures that almost destroyed my company and how we survived...",
        image: "💼",
        readTime: "12 min read",
        category: "Entrepreneurship"
      },
      engagement: {
        likes: 567,
        comments: 89,
        shares: 34,
        saves: 156
      },
      isSubscribed: true,
      publishedAt: "5 hours ago"
    },
    {
      id: 3,
      author: {
        name: "Elena Rodriguez",
        username: "@elenart",
        avatar: "🎨",
        isVerified: true
      },
      content: {
        title: "The Renaissance of Digital Art: NFTs Beyond the Hype",
        excerpt: "While the world debates NFTs, a quiet revolution is happening in digital art creation. New tools are changing how artists think about their craft...",
        image: "🖼️",
        readTime: "6 min read",
        category: "Art & Culture"
      },
      engagement: {
        likes: 445,
        comments: 67,
        shares: 28,
        saves: 123
      },
      isSubscribed: false,
      publishedAt: "1 day ago"
    },
    {
      id: 4,
      author: {
        name: "David Kim",
        username: "@devdavid",
        avatar: "👨‍💻",
        isVerified: false
      },
      content: {
        title: "Why I Deleted All My Social Media (And You Should Too)",
        excerpt: "Six months ago, I deleted Instagram, Twitter, and LinkedIn. Here's what happened to my productivity, mental health, and relationships...",
        image: "📱",
        readTime: "10 min read",
        category: "Lifestyle"
      },
      engagement: {
        likes: 789,
        comments: 134,
        shares: 67,
        saves: 234
      },
      isSubscribed: false,
      publishedAt: "2 days ago"
    },
    {
      id: 5,
      author: {
        name: "Maya Patel",
        username: "@mayawellness",
        avatar: "🧘‍♀️",
        isVerified: true
      },
      content: {
        title: "Ancient Meditation Techniques for Modern Anxiety",
        excerpt: "Combining 3000-year-old practices with neuroscience research, I've developed a meditation framework that actually works for busy professionals...",
        image: "🧠",
        readTime: "7 min read",
        category: "Health & Wellness"
      },
      engagement: {
        likes: 334,
        comments: 56,
        shares: 23,
        saves: 145
      },
      isSubscribed: true,
      publishedAt: "3 days ago"
    }
  ];

  return (
    <div className="flex-1 bg-gray-900">
      {/* Scrollable Content Area */}
      <div className="h-screen overflow-y-auto scrollbar-auto-hide">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-all duration-200"
            >
              {/* Author Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg">
                    {post.author.avatar}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-semibold text-sm">{post.author.name}</h3>
                      {post.author.isVerified && (
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs">{post.author.username} · {post.publishedAt}</p>
                  </div>
                </div>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    post.isSubscribed
                      ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {post.isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              </div>

              {/* Content */}
              <div className="mb-4">
                <h2 className="text-white font-bold text-xl mb-2 leading-tight">{post.content.title}</h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">{post.content.excerpt}</p>
                
                {/* Content Image/Media */}
                <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-6xl">{post.content.image}</span>
                </div>

                {/* Meta Information */}
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                    {post.content.category}
                  </span>
                  <span>{post.content.readTime}</span>
                </div>
              </div>

              {/* Engagement Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-6">
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-sm">{post.engagement.likes}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-sm">{post.engagement.comments}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-green-500 transition-colors duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <span className="text-sm">{post.engagement.shares}</span>
                  </button>
                </div>
                
                <button className="flex items-center space-x-2 text-gray-400 hover:text-yellow-500 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span className="text-sm">{post.engagement.saves}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}