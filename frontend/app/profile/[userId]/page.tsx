"use client";
import HomeLayout from "@/app/components/HomeLayout";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useBlogs } from "@/context/BlogContext";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/timeago";
import { UserHoverCard } from "@/app/components/UserHoverCard";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
if (!params?.userId) {
  return null;
}
const profileUserId = Number(params.userId);

  const { user, getUserMetaData, getUserBlogs, followUser, unfollowUser } =
    useUser();

  const { loadingUserId, handelFollow ,likeBlog,unlikeBlog} = useBlogs();

  const [profile, setProfile] = useState<any>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = user?.id === profileUserId;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const meta = await getUserMetaData(profileUserId);
        const blogsRes = await getUserBlogs(profileUserId);

        setProfile(meta);
        setBlogs(blogsRes.blogs || []);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [profileUserId]);

  if (loading || !profile) {
    
    return (
      <HomeLayout>
      <div className="flex justify-center items-center h-screen text-gray-400">
        Loading profile…
      </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
     
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* PROFILE HEADER */}
      <div className="flex items-center gap-6 mb-10">
        <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-3xl text-white">
          {profile.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
          <p className="text-gray-400 text-sm mt-1">
            {profile.bio || "No bio available"}
          </p>

          {/* STATS */}
          <div className="flex gap-6 mt-4 text-sm">
            <div>
              <span className="font-semibold text-white">
                {profile.blogsCount}
              </span>{" "}
              <span className="text-gray-400">Blogs</span>
            </div>
            <div>
              <span className="font-semibold text-white">
                {profile.followersCount}
              </span>{" "}
              <span className="text-gray-400">Followers</span>
            </div>
            <div>
              <span className="font-semibold text-white">
                {profile.followingCount}
              </span>{" "}
              <span className="text-gray-400">Following</span>
            </div>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <div>
          {isOwnProfile ? (
            <Button
              variant="secondary"
              onClick={() => router.push("/settings/profile")}
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              disabled={loadingUserId === profile.id}
              onClick={() => handelFollow(profile.id)}
              className={
                profile.isFollowing
                  ? "bg-gray-600 hover:bg-gray-500"
                  : "bg-orange-500 hover:bg-orange-600"
              }
            >
              {profile.isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>
      </div>

      {/* USER BLOGS */}
      <div className="flex-1 bg-gray-900">
            {/* Scrollable Content Area */}
            <div className="h-screen overflow-y-auto scrollbar-auto-hide">
              <div className="cursor-pointer max-w-2xl mx-auto p-6 space-y-6 pb-24 md:pb-6">
                {blogs.map((blog: any) => (
                  
                  <article
                    key={blog.id}
                    className=" mt-8 bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-all duration-200"
                  >
                    
                    
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
    </div>
    </HomeLayout>
  );
}
