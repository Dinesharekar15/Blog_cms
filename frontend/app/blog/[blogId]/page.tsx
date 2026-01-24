"use client";
import HomeLayout from "@/app/components/HomeLayout";
import { useParams } from "next/navigation";
import { useBlogs } from "@/context/BlogContext";
import { useEffect, useRef, useState } from "react";
import { CldImage } from "next-cloudinary";
import { timeAgo } from "@/lib/timeago";
import { UserHoverCard } from "@/app/components/UserHoverCard";
export default function BlogDetailPage() {
  const param = useParams() as { blogId: string };
  const id = Number(param.blogId);

  const [commentClick, setCommentClick] = useState(false);
  const [commentText, setCommentText] = useState("");
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const [isPosting, setIsPosting] = useState(false);

  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  if (isNaN(id)) {
    return <p>Invalid blog</p>;
  }

  const { blogs, addComment, comments, loadcommnets, likeBlog, unlikeBlog ,handelFollow,loadingUserId} =
    useBlogs();

  const blog = blogs.find((b: any) => b.id === id);
  console.log("Blog:", blog);
  const blogComment = comments[id] || [];
  console.log("comments:", blogComment);

  useEffect(() => {
    loadcommnets(id);
  }, [id]);

  if (!blog) return <p>Loading...</p>;

  
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      setIsPosting(true);
      await addComment(id, commentText);
      setCommentText("");
      setCommentClick(false);
    } finally {
      setIsPosting(false);
    }
  };
  const handleAddReply = async (parentId: number) => {
    await addComment(id, replyText, parentId);
    setReplyText("");
    setReplyTo(null);
  };

  return (
    <HomeLayout>
      <div className="flex-1 bg-gray-900">
        {/* Scrollable Content Area */}
        <div className="h-screen overflow-y-auto scrollbar-auto-hide">
          <div className=" max-w-2xl mx-auto p-6 space-y-6 pb-24 md:pb-6">
            <article
              key={blog.id}
              className=" rounded-lg border  p-6 border-none"
            >
              {/* Author Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="cursor-pointer w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg">
                    {blog.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="cursor-pointer flex items-center space-x-2">
                      <h3 className="text-white font-semibold text-sm hover:text-blue-400 transition-colors duration-200">
                        {/* {blog.user.name} */}
                        <UserHoverCard hoverduser={blog.user} onFollow={handelFollow} loadingUserId={loadingUserId}/>
                      </h3>
                    </div>
                    <p className="text-gray-400 text-xs">
                      {blog.user.email} · {timeAgo(blog.createdAt)}{" "}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4 flex flex-col ">
                <h2 className="text-white font-bold text-xl mb-2 leading-tight">
                  {blog.title}
                </h2>
                <div
                  className="text-gray-300 text-sm leading-relaxed mb-4"
                  dangerouslySetInnerHTML={{ __html: blog.description }}
                />

                {/* Content Image/Media */}
                <div>
                  {blog.imageUrl && (
                    <div className="w-full  bg-gray-700 rounded-lg  mb-4">
                      <CldImage
                        src={blog.imageUrl}
                        width={800}
                        height={800}
                        crop="fill"
                        gravity="center"
                        alt={blog.title}
                        className="rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

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
                      className={`cursor-pointer w-7 h-7 transition-colors ${
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

                  <button
                    onClick={() => {
                      setCommentClick(true);
                      setTimeout(() => {
                        commentRef.current?.focus();
                      }, 50);
                    }}
                    className="  flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                  >
                    <svg
                      className="w-7 h-7 cursor-pointer"
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

                  <button className=" flex items-center space-x-2 text-gray-400 hover:text-green-500 transition-colors duration-200">
                    <svg
                      className="w-7 h-7 cursor-pointer"
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
              {/* Comment Input Box */}
              <div className="mt-8">
                <div
                  className={`border rounded-xl transition-all duration-200 ${
                    commentClick ? "border-gray-500" : "border-gray-700"
                  }`}
                >
                  <textarea
                    ref={commentRef}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onFocus={() => setCommentClick(true)}
                    placeholder="Add a comment..."
                    rows={commentClick ? 4 : 1}
                    className="w-full bg-transparent text-white p-3 resize-none outline-none"
                  />
                </div>

                {commentClick && (
                  <div className="flex justify-end space-x-3 mt-3">
                    <button
                      onClick={() => {
                        setCommentClick(false);
                        setCommentText("");
                      }}
                      className="cursor-pointer px-4 py-1 text-sm text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleAddComment}
                      disabled={!commentText.trim() || isPosting}
                      className="cursor-pointer px-4 py-1 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50"
                    >
                      {isPosting ? (
                        <>
                          <svg
                            className="w-4 h-4 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              strokeWidth="4"
                              className="opacity-25"
                            />
                            <path
                              d="M12 2a10 10 0 0110 10"
                              strokeWidth="4"
                              className="opacity-75"
                            />
                          </svg>
                          {/* <span>Posting...</span> */}
                        </>
                      ) : (
                        "Comment"
                      )}
                    </button>
                  </div>
                )}
              </div>
              {/* Comments */}
              <div className="mt-8 space-y-6">
                {blogComment.map((c: any) => (
                  <div key={c.id} className="space-y-2">
                    {/* Avatar + Name + Time in one row */}
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-semibold ">
                        {c.user.name.charAt(0).toUpperCase()}
                      </div>

                      <p className="text-white text-sm font-semibold cursor-pointer hover:text-blue-400 transition-colors duration-200">
                        <UserHoverCard hoverduser={c.user} onFollow={handelFollow} loadingUserId={loadingUserId}/>
                      </p>

                      <p className="text-gray-400 text-xs">
                        {timeAgo(c.createdAt)}
                      </p>
                    </div>

                    {/* Content below */}
                    <p className="text-gray-300 text-sm ml-12">{c.content}</p>

                    <div className="mt-1 ml-12">
                      <button
                        onClick={() => setReplyTo(c.id)}
                        className="cursor-pointer flex items-center space-x-1 text-xs text-gray-400 hover:text-blue-400 transition">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h7a4 4 0 014 4v7m0 0l-4-4m4 4l4-4"
                          />
                        </svg>
                        <span>Reply</span>
                      </button>
                    </div>
                    {replyTo === c.id && (
                      <div className="ml-12 mt-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to ${c.user.name}`}
                          rows={2}
                          className="w-full bg-gray-800 text-white p-2 rounded-lg text-sm outline-none"
                        />

                        <div className="flex justify-end mt-2 space-x-2">
                          <button
                            onClick={() => {
                              setReplyTo(null);
                              setReplyText("");
                            }}
                            className="text-sm text-gray-400 hover:text-white"
                          >
                            Cancel
                          </button>

                          <button
                            onClick={() => handleAddReply(c.id)}
                            className="text-sm bg-blue-500 px-3 py-1 rounded-full text-white hover:bg-blue-600"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    <div className="ml-12 mt-4 space-y-4">
                      {c.replies.map((r: any) => (
                        <div key={r.id} className="space-y-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">
                              {r.user.name.charAt(0).toUpperCase()}
                            </div>

                            <p className="text-sm text-white font-semibold cursor-pointer hover:text-blue-400 transition-colors duration-200">
                             <UserHoverCard hoverduser={r.user} onFollow={handelFollow} loadingUserId={loadingUserId}/>
                            </p>

                            <p className="text-xs text-gray-400">
                              {timeAgo(r.createdAt)}
                            </p>
                          </div>

                          <p className="text-sm text-gray-300 ml-11">
                            {r.content}
                          </p>
                          
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
