'use client'

import HomeLayout from '../components/HomeLayout';
import BlogCard from './components/BlogCard';

export default function HomePage() {
  return (
    <HomeLayout>
      {/* Scrollable Content Feed */}
      <BlogCard />
      
    </HomeLayout>
  );
}