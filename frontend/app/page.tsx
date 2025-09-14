'use client'

import HeaderNavigation from './components/HeaderNavigation';
import HeroSection from './components/HeroSection';
import FeatureSection from './components/FeatureSection';
import TestimonialSection from './components/TestimonialSection';
import CreatorDirectorySection from './components/CreatorDirectorySection';
import FooterSection from './components/FooterSection';

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-orange-50/20">
      <HeaderNavigation />
      <HeroSection />
      <FeatureSection />
      <TestimonialSection />
      <CreatorDirectorySection />
      <FooterSection />
    </div>
  );
}
