import React from 'react';
import Sidebar from '../../components/Sidebar';
import BlogCard from '../../components/BlogCard';

const dummyBlogs = [
  {
    name: 'John Doe',
    date: 'September 13, 2025',
    content: 'This is an example blog post content.',
  },
  {
    name: 'Jane Smith',
    date: 'September 12, 2025',
    content: 'Exploring the wonders of Next.js and Tailwind CSS!',
  },
  {
    name: 'Alex Johnson',
    date: 'September 11, 2025',
    content: 'How to build a modern blog with React.',
  },
  {
    name: 'Emily Brown',
    date: 'September 10, 2025',
    content: 'Tips for writing engaging blog posts.',
  },
  {
    name: 'Michael Lee',
    date: 'September 9, 2025',
    content: 'Understanding responsive design in web apps.',
  },
  {
    name: 'Sarah Kim',
    date: 'September 8, 2025',
    content: 'The power of CSS transitions and animations.',
  },
  {
    name: 'David Clark',
    date: 'September 7, 2025',
    content: 'Why TypeScript makes your code safer.',
  },
  {
    name: 'Olivia Martinez',
    date: 'September 6, 2025',
    content: 'Building scalable UIs with component architecture.',
  },
  {
    name: 'Chris Evans',
    date: 'September 5, 2025',
    content: 'How to add social proof to your blog.',
  },
  {
    name: 'Sophia Turner',
    date: 'September 4, 2025',
    content: 'Newsletter strategies for growing your audience.',
  },
];

const HomePage: React.FC = () => {
  return (
    <div className="flex bg-zinc-950 text-white min-h-screen">
      {/* Sidebar (Desktop) & Top Navbar (Mobile) */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:ml-40">
        {/* Top Post Input Box */}
        <div className="flex items-center space-x-4 bg-zinc-800 p-4 rounded-lg mb-6 max-w-xl mx-auto mt-16 md:mt-0 cursor-pointer transition-colors duration-200 hover:bg-zinc-900 hover:scale-105">
          <div className="w-10 h-10 bg-gray-500 rounded-full"></div>
          <div className="flex-1 bg-zinc-900 p-2 rounded-lg text-gray-400">
            What’s on your mind?
          </div>
        </div>

        {/* Blog Cards */}
        <div className="flex flex-col items-center space-y-6 max-w-xl mx-auto">
          {dummyBlogs.map((blog, idx) => (
            <BlogCard key={idx} name={blog.name} date={blog.date} content={blog.content} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;