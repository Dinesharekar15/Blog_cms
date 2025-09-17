'use client'

import HeaderNavigation from './components/landing/HeaderNavigation';
import HeroSection from './components/landing/HeroSection';
import FeatureSection from './components/landing/FeatureSection';
import TestimonialSection from './components/landing/TestimonialSection';
import CreatorDirectorySection from './components/landing/CreatorDirectorySection';
import FooterSection from './components/landing/FooterSection';

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
