import { motion } from 'framer-motion';

interface Blog {
  id: number;
  title: string;
  description: string;
  image: string;
}

const FeaturedBlogs: React.FC<{ blogs: Blog[] }> = ({ blogs }) => {
  return (
    <motion.section
      className="bg-zinc-950 text-white py-20 px-5"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-4xl font-extrabold text-center mb-12 text-orange-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Featured Blogs
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              className="bg-zinc-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-orange-400 mb-3">{blog.title}</h3>
                <p className="text-zinc-100 mb-4">{blog.description}</p>
                <a
                  href="#"
                  className="text-orange-200 hover:text-orange-400 transition-colors"
                >
                  Read More
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedBlogs;