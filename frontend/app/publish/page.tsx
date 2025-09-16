'use client'

import { useState } from 'react';
import TiptapEditor from './components/TiptapEditor';

export default function PublishPage() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handlePublish = () => {
    // Handle publish logic here
    console.log('Publishing post:', { title, content });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Create New Post</h1>
          
          {/* Title Input */}
          <input
            type="text"
            placeholder="Enter your post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>

        {/* Editor */}
        <div className="mb-8">
          <TiptapEditor 
            content={content} 
            onChange={handleContentChange}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button className="px-6 py-2 text-gray-400 hover:text-white transition-colors">
            Save Draft
          </button>
          
          <button 
            onClick={handlePublish}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Publish Post
          </button>
        </div>
      </div>
    </div>
  );
}