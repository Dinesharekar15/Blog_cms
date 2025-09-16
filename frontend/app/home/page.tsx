'use client'

import HomeLayout from '../components/HomeLayout';
import MainContentFeed from './components/MainContentFeed';

export default function HomePage() {
  return (
    <HomeLayout>
      {/* Scrollable Content Feed */}
      <MainContentFeed />
    </HomeLayout>
  );
}