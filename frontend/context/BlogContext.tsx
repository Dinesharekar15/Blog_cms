"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { blogService } from "@/services/BlogService";
import { useUser } from "./UserContext";
const BlogContext = createContext<any>(null);
export interface BlogUser {
  id: number;
  name: string;
  email: string;
  isFollowing: boolean;
  _count: {
    followers: number;
    following: number;
    blogs: number;
  };
}


export interface Blog {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  like: number;
  isLiked: boolean;
  user: BlogUser;
}


export const BlogProvider = ({ children }: { children: React.ReactNode }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [comments, setComments] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState(false);
  const {user,followUser,unfollowUser}=useUser();
  const [loadingUserId,setLoadingUserId]=useState<any|null>(null)

  const handelFollow = async (userId: number) => {
  if (loadingUserId === userId) return;

  const currentIsFollowing = blogs.find((b: any) => b.user.id === userId)?.user.isFollowing;

  if (currentIsFollowing === undefined) return;

  setLoadingUserId(userId);

  // optimistic update
  setBlogs((prev: any[]) =>
    prev.map((blog: any) => {
      if (blog.user.id !== userId) return blog;

      return {
        ...blog,
        user: {
          ...blog.user,
          isFollowing: !currentIsFollowing,
          _count: {
            ...blog.user._count,
            followers:
              blog.user._count.followers +
              (currentIsFollowing ? -1 : 1),
          },
        },
      };
    })
  );

  try {
    if (currentIsFollowing) {
      await unfollowUser(userId);
    } else {
      await followUser(userId);
    }
  } catch {
    // rollback
    setBlogs((prev: any[]) =>
      prev.map((blog: any) =>
        blog.user.id === userId
          ? {
              ...blog,
              user: {
                ...blog.user,
                isFollowing: currentIsFollowing,
                _count: {
                  ...blog.user._count,
                  followers:
                    blog.user._count.followers +
                    (currentIsFollowing ? 1 : -1),
                },
              },
            }
          : blog
      )
    );
  } finally {
    setLoadingUserId(null);
  }
};


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
        loadBlogs,
        loadingUserId,
        handelFollow
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
export const useBlogs = () => useContext(BlogContext);
