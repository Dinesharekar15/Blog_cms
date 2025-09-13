import React from 'react';
import { HeartIcon, ChatAlt2Icon, ShareIcon } from '@heroicons/react/outline';

interface BlogCardProps {
  name: string;
  date: string;
  content: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ name, date, content }) => (
  <div className="bg-zinc-800 p-4 rounded-lg w-full">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gray-500 rounded-full"></div>
        <div>
          <h3 className="font-bold">{name}</h3>
          <p className="text-sm text-gray-400">{date}</p>
        </div>
      </div>
      <button className="bg-orange-400 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-500 transition-transform duration-200 hover:scale-105">
        Subscribe
      </button>
    </div>
    <p className="text-gray-300 mb-4">{content}</p>
    <div className="flex items-center space-x-6 text-gray-400">
      <button className="hover:text-orange-400 cursor-pointer transition-transform duration-200 hover:scale-105">
        <HeartIcon className="w-6 h-6" />
      </button>
      <button className="hover:text-orange-400 cursor-pointer transition-transform duration-200 hover:scale-105">
        <ChatAlt2Icon className="w-6 h-6" />
      </button>
      <button className="hover:text-orange-400 cursor-pointer transition-transform duration-200 hover:scale-105">
        <ShareIcon className="w-6 h-6" />
      </button>
    </div>
  </div>
);

export default BlogCard;
