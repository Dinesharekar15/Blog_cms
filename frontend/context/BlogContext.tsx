"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { blogService } from "@/services/BlogService";

const BlogContext = createContext<any>(null);

export interface Blog {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  like: number;
  isLiked: boolean;
}

export const BlogProvider = ({ children }: { children: React.ReactNode }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [comments, setComments] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState(false);

  const loadBlogs = async () => {
    try {
     setLoading(true);
    const data = await blogService.getAll();
    setBlogs(data.formattedBlog || data);
    } catch (error) {
    console.error("Failed to load blogs", error);
    }finally{
      setLoading(false)
    }
  };

  const likeBlog = async (blogId: number) => {
    setBlogs((prev) =>
      prev.map((b) =>
        b.id === blogId ? { ...b, isLiked: true, like: b.like + 1 } : b
      )
    );

    try {
      await blogService.likeblog(blogId);
    } catch (error) {
      await loadBlogs();
    }
  };
  const unlikeBlog = async (blogId: number) => {

    setBlogs((prev) =>
      prev.map((b) =>
        b.id === blogId ? { ...b, isLiked: false, like: b.like - 1 } : b
      )
    );
    try {
          await blogService.unlike(blogId);

    } catch (error) {
      loadBlogs();
    }
  };

  const addComment = async (
    blogId: number,
    content: string,
    parentId?: number
  ) => {
    await blogService.addcomment(blogId, content, parentId);
    loadcommnets(blogId);
  };

  const loadcommnets = async (blogId: number) => {
    const data = await blogService.getComment(blogId);
    setComments((prev) => ({
      ...prev,
      [blogId]: data.comments,
    }));
  };

  useEffect(() => {
    loadBlogs();
  },[]);

  return (
    <BlogContext.Provider
      value={{
        blogs,
        setBlogs,
        comments,
        loading,
        likeBlog,
        unlikeBlog,
        addComment,
        loadcommnets,
        loadBlogs
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
export const useBlogs = () => useContext(BlogContext);
