import React from 'react';
import { motion } from 'framer-motion';

const AboutAuthor: React.FC = () => {
  return (
    <motion.section
      className="bg-zinc-950 text-white py-20 px-5"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-orange-400 mb-6">
          About the Author
        </h2>
        <p className="text-lg text-zinc-100 mb-8">
          Hi, I’m Dinesh 👋. I write about Web Development, Tech Trends, and Programming tips. My goal is to simplify complex topics and share my knowledge with the world.
        </p>
        <div className="flex justify-center">
          <img
            src="/images/author.jpg"
            alt="Author"
            className="w-40 h-40 rounded-full border-4 border-orange-400 shadow-lg"
          />
        </div>
      </div>
    </motion.section>
  );
};

export default AboutAuthor;