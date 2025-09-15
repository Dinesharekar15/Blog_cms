'use client';

import React, { useState, useEffect, useCallback } from 'react';
import BlogEditor from './components/BlogEditor';
import Button from '../components/ui/Button';
import EditorStats from './components/EditorStats';

export interface PostData {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  category: string;
  featuredImage: string;
  status: 'draft' | 'published' | 'scheduled';
  publishDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function PublishPage() {
  const [postData, setPostData] = useState<PostData>({
    title: '',
    content: '',
    excerpt: '',
    tags: [],
    category: '',
    featuredImage: '',
    status: 'draft',
  });

  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [tagInput, setTagInput] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | undefined>();

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (saveStatus === 'unsaved' && (postData.title || postData.content)) {
        handleSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(autoSave);
  }, [postData, saveStatus]);

  // Calculate word count and character count
  useEffect(() => {
    const textContent = postData.content.replace(/<[^>]*>/g, ''); // Strip HTML
    const words = textContent.split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharacterCount(textContent.length);
  }, [postData.content]);

  const updatePostData = useCallback((updates: Partial<PostData>) => {
    setPostData(prev => ({ ...prev, ...updates }));
    setSaveStatus('unsaved');
  }, []);

  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    try {
      // TODO: Implement API call to save post
      console.log('Saving post:', postData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const now = new Date();
      updatePostData({ updatedAt: now });
      setSaveStatus('saved');
      setLastSaved(now);
      
      // Show success notification
      console.log('Post saved successfully');
    } catch (error) {
      console.error('Failed to save post:', error);
      setSaveStatus('unsaved');
      // Show error notification
    }
  }, [postData]);

  const handlePublish = useCallback(async () => {
    if (!postData.title || !postData.content) {
      alert('Please add a title and content before publishing');
      return;
    }

    setIsPublishing(true);
    setSaveStatus('saving');
    
    try {
      const publishData = { 
        ...postData, 
        status: 'published' as const,
        publishDate: new Date(),
        updatedAt: new Date()
      };
      
      // TODO: Implement API call to publish post
      console.log('Publishing post:', publishData);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      setPostData(publishData);
      setSaveStatus('saved');
      
      // Show success notification
      alert('Post published successfully!');
    } catch (error) {
      console.error('Failed to publish post:', error);
      setSaveStatus('unsaved');
      alert('Failed to publish post. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  }, [postData]);

  const handleAddTag = () => {
    if (tagInput.trim() && !postData.tags.includes(tagInput.trim())) {
      updatePostData({ 
        tags: [...postData.tags, tagInput.trim()] 
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updatePostData({ 
      tags: postData.tags.filter(tag => tag !== tagToRemove) 
    });
  };

  const getReadingTime = (words: number): number => {
    const wordsPerMinute = 200;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">Create New Post</h1>
            
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className={`w-2 h-2 rounded-full ${
                saveStatus === 'saved' ? 'bg-green-500' : 
                saveStatus === 'saving' ? 'bg-yellow-500 animate-pulse' : 
                'bg-red-500'
              }`} />
              <span>
                {saveStatus === 'saved' ? 'All changes saved' : 
                 saveStatus === 'saving' ? 'Saving...' : 
                 'Unsaved changes'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="bg-gray-700 hover:bg-gray-600 hover:text-white text-gray-600 border-gray-600"
            >
              {saveStatus === 'saving' ? 'Saving...' : 'Save Draft'}
            </Button>
            
            <Button
              variant="primary"
              onClick={handlePublish}
              disabled={!postData.title || !postData.content || isPublishing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPublishing ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Editor Area */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Title Input */}
            <div>
              <input
                type="text"
                placeholder="Enter your post title..."
                value={postData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  updatePostData({ title: e.target.value })
                }
                className="w-full text-3xl font-bold bg-gray-800 border-gray-700 text-white placeholder-gray-400 border-none outline-none focus:ring-2 focus:ring-blue-500 p-4 rounded-md"
              />
            </div>

            {/* TinyMCE Editor */}
            <div className="bg-gray-800 rounded-lg p-1">
              <BlogEditor
                initialValue={postData.content}
                onContentChange={(content) => updatePostData({ content })}
                placeholder="Start writing your blog post..."
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-6 space-y-6">
          {/* Post Status */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Post Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`capitalize font-medium ${
                  postData.status === 'published' ? 'text-green-400' :
                  postData.status === 'draft' ? 'text-yellow-400' : 
                  'text-blue-400'
                }`}>
                  {postData.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Words:</span>
                <span className="text-white">{wordCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Reading time:</span>
                <span className="text-white">{getReadingTime(wordCount)}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Category</h3>
            <select
              value={postData.category}
              onChange={(e) => updatePostData({ category: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              <option value="technology">Technology</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="travel">Travel</option>
              <option value="food">Food</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setTagInput(e.target.value)
                  }
                  onKeyPress={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  variant="secondary"
                  onClick={handleAddTag}
                  className="bg-gray-700 hover:text-white hover:bg-gray-600 text-gray-600 border-gray-600"
                >
                  Add
                </Button>
              </div>
              
              {postData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {postData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-600 text-white"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-blue-200 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Featured Image</h3>
            <input
              type="url"
              placeholder="Image URL..."
              value={postData.featuredImage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                updatePostData({ featuredImage: e.target.value })
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {postData.featuredImage && (
              <div className="mt-2">
                <img
                  src={postData.featuredImage}
                  alt="Featured"
                  className="w-full h-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Excerpt</h3>
            <textarea
              placeholder="Write a brief excerpt..."
              value={postData.excerpt}
              onChange={(e) => updatePostData({ excerpt: e.target.value })}
              className="w-full h-24 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Editor Stats */}
      <EditorStats
        wordCount={wordCount}
        characterCount={characterCount}
        readingTime={getReadingTime(wordCount)}
        saveStatus={saveStatus}
        lastSaved={lastSaved}
      />
    </div>
  );
}