"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useBlogs } from "@/context/BlogContext";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/timeago";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
if (!params?.userId) {
  return null;
}
const profileUserId = Number(params.userId);

  const { user, getUserMetaData, getUserBlogs, followUser, unfollowUser } =
    useUser();

  const { loadingUserId, handelFollow } = useBlogs();

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
      <div className="flex justify-center items-center h-screen text-gray-400">
        Loading profile…
      </div>
    );
  }

  return (
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
      <div className="space-y-6">
        {blogs.length === 0 ? (
          <p className="text-gray-400 text-center">
            No blogs posted yet.
          </p>
        ) : (
          blogs.map((blog) => (
            <article
              key={blog.id}
              className="border border-gray-700 rounded-lg p-6 bg-gray-900"
            >
              <h2 className="text-lg font-semibold text-white mb-2">
                {blog.title}
              </h2>

              <div
                className="text-gray-300 text-sm mb-4"
                dangerouslySetInnerHTML={{ __html: blog.description }}
              />

              <div className="flex justify-between text-xs text-gray-400">
                <span>{timeAgo(blog.createdAt)}</span>
                <span>
                  ❤️ {blog._count.like} · 💬 {blog._count.comment}
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
