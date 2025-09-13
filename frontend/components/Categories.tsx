import React from 'react';
import { motion } from 'framer-motion';

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface CategoriesProps {
  categories: Category[];
}

const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  return (
    <motion.section
      className="bg-zinc-950 text-white py-20 px-5"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-orange-400">
          Explore Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col items-center bg-zinc-900 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={category.icon}
                alt={category.name}
                className="w-16 h-16 mb-4"
              />
              <h3 className="text-lg font-semibold text-orange-200">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Categories;