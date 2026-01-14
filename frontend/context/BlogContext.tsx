import { createContext, useState, useEffect, useContext } from "react";
import { blogService } from "@/services/BlogService";

const BlogContext = createContext<any>(null);

export const BlogProvider = async ({
  childern,
}: {
  childern: React.ReactNode;
}) => {
  const [blog, setBlog] = useState([]);
  const [comment, setComment] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState(false);

  const loadBlogs = async () => {
    setLoading(true);
    const data = await blogService.getAll();
    setBlog(data.formattedBlog || data);
    setLoading(false);
  };

  const likeBlog = async (blogId: number) => {
    await blogService.likeblog(blogId);
    await loadBlogs();
  };
  const unlikeBlog = async (blogId: number) => {
    await blogService.unlike(blogId);
    await loadBlogs();
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
      {childern}
    </BlogContext.Provider>
  );
};
export const useBlogs=()=>useContext(BlogContext)