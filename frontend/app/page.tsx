'use client'
// Next.js + Tailwind + TypeScript Landing Page
// Create a professional and consistent landing page for a blog website.
// The design should:
// - Use TailwindCSS (and you can use shadcn/ui components + Framer Motion for interactivity).
// - Have consistent colors across all sections (pick a modern palette, e.g., blue + gray or purple + neutral).
// - Content should not stretch full width: use `max-w-5xl mx-auto` so it looks good on large monitors.
// - Sections should have enough spacing (padding like `py-20`).
// - Layout should be responsive and centered.
// - Add hover effects and smooth transitions for interactivity.

// Page Sections:
// 1. Hero Section: headline, short description, and CTA button ("Read Blogs").
// 2. Featured Blogs Section: grid of 3–4 latest blogs with title, short text, and "Read More" link.
// 3. Categories Section: grid of categories (e.g., Tech, Lifestyle, Coding) with icons.
// 4. About/Author Section: small intro about the blog/author with image/avatar.
// 5. Newsletter Section: input + subscribe button (simple design).
// 6. Footer: navigation links + social links.

// Make the design clean, modern, and professional.

import Categories from '../components/Categories';
import HeroSection from '../components/HeroSection';
import FeaturedBlogs from '../components/FeaturedBlogs';
import Testimonials from '../components/Testimonials';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

export default function Home() {
  const blogs = [
    {
      id: 1,
      title: 'Understanding React Hooks',
      description: 'A deep dive into React Hooks and how to use them effectively.',
      image: '../images/blog/1.jpeg',
    },
    {
      id: 2,
      title: 'CSS Grid vs Flexbox',
      description: 'When to use CSS Grid and Flexbox for layout design.',
      image: '../images/blog/2.jpeg',
    },
    {
      id: 3,
      title: 'Mastering JavaScript ES6+',
      description: 'Learn the modern features of JavaScript to write cleaner and more efficient code.',
      image: '../images/blog/3.jpeg',
    },
  ];

  const categories = [
    { id: 1, name: 'Tech', icon: '/icons/tech.svg' },
    { id: 2, name: 'Lifestyle', icon: '/icons/lifestyle.svg' },
    { id: 3, name: 'Coding', icon: '/icons/coding.svg' },
    { id: 4, name: 'Travel', icon: '/icons/travel.svg' },
  ];

  const handleCtaClick = () => {
    console.log('CTA button clicked!');
  };

  return (
    <main>
      <HeroSection
        headline="Welcome to Simplify"
        subheading="Ideas, Code & Stories"
        ctaText="Read Blogs"
        onCtaClick={handleCtaClick}
      />
      <FeaturedBlogs blogs={blogs} />
      <Categories categories={categories} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Testimonials />
      </motion.div>
      <CallToAction />
      <Footer />
    </main>
  );
}
