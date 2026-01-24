"use client";
import { useBlogs } from "@/context/BlogContext";
import { timeAgo } from "@/lib/timeago";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { CldImage } from "next-cloudinary";
import { useUser } from "@/context/UserContext";
import { UserHoverCard } from "./UserHoverCard";
type Blog = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  userId: number;
  user: {
    name: string;
    email: string;
  };
};


export default function MainContentFeed() {
  const {
    blogs,
    setBlogs,
    comment,
    loading,
    likeBlog,
    unlikeBlog,
    addComment,
    loadComments,
    loadBlogs
  } = useBlogs();
  const {user,followUser,unfollowUser}=useUser();
  const [loadingUserId,setLoadingUserId]=useState<any|null>(null)
  const handelFollow=async(userId:number,isFollowing:boolean)=>{
    if(loadingUserId===userId) return;
    setLoadingUserId(userId)
    setBlogs((prev:any)=>
      prev.map((blog:any)=>
        blog.user.id===userId
        ?{...blog,isFollowing:!isFollowing}
        :blog
      )
    )

    try {
  if (isFollowing) {
    await unfollowUser(userId);
  } else {
    await followUser(userId);
  }
} catch {
  // rollback UI if API fails
  setBlogs((prev:any) =>
    prev.map((blog:any) =>
      blog.user.id === userId
        ? { ...blog, isFollowing }
        : blog
    )
  );
} finally {
  setLoadingUserId(null);
}

  }
  return (
    <div className="flex-1 bg-gray-900">
      {/* Scrollable Content Area */}
      <div className="h-screen overflow-y-auto scrollbar-auto-hide">
        <div className="cursor-pointer max-w-2xl mx-auto p-6 space-y-6 pb-24 md:pb-6">
          {blogs.map((blog: any) => (
            
            <article
              key={blog.id}
              className=" mt-8 bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-all duration-200"
            >
              
              {/* Author Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="cursor-pointer w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg">
                    {blog.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="cursor-pointer flex items-center space-x-2">
                      {/* <h3>{blog.user.name}</h3> */}
                      <UserHoverCard blog={blog} onFollow={handelFollow} loadingUserId={loadingUserId} />
                    </div>
                    <p className="text-gray-400 text-xs">
                      {blog.user.email} · {timeAgo(blog.createdAt)}{" "}
                    </p>
                  </div>
                </div>
                {
                  blog.user.id!=user?.id && 
                  <button
                  disabled={loadingUserId===blog.user.id}
                  onClick={()=>{handelFollow(blog.user.id,blog.isFollowing)}}
                  className={` cursor-pointer px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    blog.isFollowing
                      ? "bg-gray-600 text-gray-300 hover:bg-gray-500"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  {blog.isFollowing ? "Following" : "Follow"}
                </button>
                }
                
              </div>
              <Link key={blog.id} href={`/blog/${blog.id}`}>

              {/* Content */}
              <div className="mb-4">
                <h2 className="text-white font-bold text-xl mb-2 leading-tight">
                  {blog.title}
                </h2>
                <div
                  className="text-gray-300 text-sm leading-relaxed mb-4"
                  dangerouslySetInnerHTML={{ __html: blog.description }}
                />

                {/* Content Image/Media */}

                {blog.imageUrl && (
                  <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                    <CldImage
                      src={blog.imageUrl}
                      width={800}
                      height={300}
                      crop="fill"
                      gravity="center"
                      alt={blog.title}
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div>
              </Link>

              {/* Engagement Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-none">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => {
                      {
                        blog.isLiked ? unlikeBlog(blog.id) : likeBlog(blog.id);
                      }
                    }}
                    className="flex items-center space-x-2 text-gray-400 hover:text-red-500  transition-colors duration-200 "
                  >
                    <svg
                      className={`cursor-pointer w-5 h-5 transition-colors ${
                        blog.isLiked
                          ? "fill-red-500 text-red-500"
                          : "fill-none text-gray-400"
                      }`}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>

                    <span className="text-sm">{blog.like}</span>
                  </button>
                  <Link key={blog.id} href={`/blog/${blog.id}`}>
                  <button className="flex cursor-pointer items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors duration-200">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"              
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span className="text-sm">{blog.comment}</span>
                  </button>
                  </Link>

                  <button className="flex items-center space-x-2 text-gray-400 hover:text-green-500 transition-colors duration-200">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
            
          ))}
        </div>
      </div>
    </div>
  );
}
