import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "This blog has completely changed the way I approach web development. Highly recommended!",
    name: "John Doe",
    role: "Frontend Developer",
    avatar: "/images/avatar1.jpg",
  },
  {
    quote: "The insights shared here are invaluable. I’ve learned so much in such a short time!",
    name: "Jane Smith",
    role: "UI/UX Designer",
    avatar: "/images/avatar2.jpg",
  },
  {
    quote: "A must-read for anyone in tech. The content is top-notch and always relevant.",
    name: "Alex Johnson",
    role: "Software Engineer",
    avatar: "/images/avatar3.jpg",
  },
];

const Testimonials: React.FC = () => {
  return (
    <motion.section
      className="bg-zinc-950 text-gray-100 py-20 px-5"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-orange-400 mb-10">
          What Readers Say
        </h2>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-zinc-900 p-6 rounded-lg border border-orange-500 shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <p className="text-lg italic mb-4">“{testimonial.quote}”</p>
              <div className="flex items-center mt-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-2 border-orange-500 mr-4"
                />
                <div className="text-left">
                  <h4 className="font-bold text-gray-100">{testimonial.name}</h4>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Testimonials;