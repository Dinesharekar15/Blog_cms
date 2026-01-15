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
  const [blog, setBlog] = useState<Blog[]>([]);
  const [comment, setComment] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState(false);

  const loadBlogs = async () => {
    setLoading(true);
    const data = await blogService.getAll();
    setBlog(data.formattedBlog || data);
    setLoading(false);
  };

  const likeBlog = async (blogId: number) => {
    setBlog((prev) =>
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

    setBlog((prev) =>
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
    loadcommnet(blogId);
  };

  const loadcommnet = async (blogId: number) => {
    const data = await blogService.getComment(blogId);
    setComment((prev) => ({
      ...prev,
      [blogId]: data.comments,
    }));
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  return (
    <BlogContext.Provider
      value={{
        blog,
        comment,
        loading,
        likeBlog,
        unlikeBlog,
        addComment,
        loadcommnet,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
export const useBlogs = () => useContext(BlogContext);
