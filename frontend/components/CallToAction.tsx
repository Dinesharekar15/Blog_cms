import React from 'react';
import { motion } from 'framer-motion';

const CallToAction: React.FC = () => {
  return (
    <section className="bg-zinc-950 text-white py-20 px-6 mb-10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">
          Start exploring articles now
        </h2>
        <p className="text-lg mb-8">
          Discover tips, stories, and tutorials crafted for curious minds.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <motion.button
            className="bg-orange-600 cursor-pointer text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-500 transition duration-300 w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
          >
            Read Blogs
          </motion.button>
          <a
            href="#"
            className="text-gray-300 hover:text-orange-400 transition duration-300"
          >
            Or subscribe for updates
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;