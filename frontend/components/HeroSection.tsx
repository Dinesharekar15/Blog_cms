'use client'
import { motion } from 'framer-motion';

interface HeroSectionProps {
  headline: string;
  subheading: string;
  ctaText: string;
  onCtaClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ headline, subheading, ctaText, onCtaClick }) => {
  return (
    <motion.section
      className="bg-zinc-950 text-white py-20 px-5"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold text-orange-400 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {headline}
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-white mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {subheading}
        </motion.p>
        <motion.button
          className="bg-orange-400 text-zinc-950 font-semibold py-3 px-8 rounded-full shadow-md hover:bg-orange-200 transition-transform transform hover:scale-105"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.1 }}
          onClick={onCtaClick}
        >
          {ctaText}
        </motion.button>
      </div>
    </motion.section>
  );
};

export default HeroSection;