"use client";
import HomeLayout from "@/app/components/HomeLayout";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import DOMPurify from "dompurify";
import { userService } from "@/services/UserService";
import { timeAgo } from "@/lib/timeago";

type Tab = "posts" | "followers" | "following";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();

  if (!params?.userId) return null;
  const profileUserId = Number(params.userId);

  const { user } = useUser();

  const [profile, setProfile] = useState<any>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const isOwnProfile = user?.id === profileUserId;

  const sanitize = (html: string) => {
    if (typeof window === "undefined") return html;
    return DOMPurify.sanitize(html);
  };

  // ─── Load profile data ─────────────────────────────────────────────────────
  const loadProfile = async () => {
    try {
      setLoading(true);
      const [meta, blogsRes] = await Promise.all([
        userService.getUserMetaData(profileUserId),
        userService.getUserBlogs(profileUserId),
      ]);
      setProfile(meta.formattedData);
      setBlogs(blogsRes.blogs || []);
    } finally {
      setLoading(false);
    }
  };

  // ─── Load followers/following lazily when tab clicked ──────────────────────
  const loadFollowers = async () => {
    if (followers.length > 0) return;
    try {
      const res = await userService.getUserFollowers(profileUserId);
      setFollowers(res.followers || []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadFollowing = async () => {
    if (following.length > 0) return;
    try {
      const res = await userService.getUserFollowing(profileUserId);
      setFollowing(res.followings || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadProfile();
    // reset followers/following cache when userId changes
    setFollowers([]);
    setFollowing([]);
    setActiveTab("posts");
  }, [profileUserId]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "followers") loadFollowers();
    if (tab === "following") loadFollowing();
  };

  // ─── Follow / Unfollow ─────────────────────────────────────────────────────
  const handleFollow = async () => {
    if (!profile || followLoading) return;
    setFollowLoading(true);

    const isFollowing = profile.isFollowing;

    // Optimistic update
    setProfile((prev: any) => ({
      ...prev,
      isFollowing: !isFollowing,
      followersCount: prev.followersCount + (isFollowing ? -1 : 1),
    }));

    try {
      if (isFollowing) {
        await userService.unfollowUser(profileUserId);
      } else {
        await userService.followUser(profileUserId);
      }
      // Invalidate followers cache so it refreshes next time the tab is opened
      setFollowers([]);
    } catch {
      // Rollback on error
      setProfile((prev: any) => ({
        ...prev,
        isFollowing: isFollowing,
        followersCount: prev.followersCount + (isFollowing ? 1 : -1),
      }));
    } finally {
      setFollowLoading(false);
    }
  };

  // ─── Loading skeleton ──────────────────────────────────────────────────────
  if (loading || !profile) {
    return (
      <HomeLayout>
        <div className="flex justify-center items-center h-screen text-gray-400">
          Loading profile…
        </div>
      </HomeLayout>
    );
  }

  const tabClass = (tab: Tab) =>
    `pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${activeTab === tab
      ? "border-orange-500 text-orange-500"
      : "border-transparent text-gray-400 hover:text-white"
    }`;

  return (
    <HomeLayout>
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* ── PROFILE HEADER ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          {/* Avatar */}
          <div className="w-24 h-24 shrink-0 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
            {profile.name.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2">
              <h1 className="text-2xl font-bold text-white">{profile.name}</h1>

              {/* Follow / Edit button */}
              {isOwnProfile ? (
                <button
                  onClick={() => router.push("/settings/profile")}
                  className="px-5 py-1.5 rounded-full border border-gray-500 text-sm text-gray-300 hover:border-white hover:text-white transition-all"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all disabled:opacity-50 ${profile.isFollowing
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-500"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                    }`}
                >
                  {followLoading ? "…" : profile.isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>

            <p className="text-gray-400 text-sm mb-4">
              {profile.bio || "No bio yet."}
            </p>

            {/* Stats row — clickable */}
            <div className="flex justify-center sm:justify-start gap-8 text-sm">
              <button onClick={() => handleTabChange("posts")} className="text-center hover:opacity-80 transition-opacity">
                <span className="block text-white font-bold text-lg">{profile.blogsCount}</span>
                <span className="text-gray-400">Posts</span>
              </button>
              <button onClick={() => handleTabChange("followers")} className="text-center hover:opacity-80 transition-opacity">
                <span className="block text-white font-bold text-lg">{profile.followersCount}</span>
                <span className="text-gray-400">Followers</span>
              </button>
              <button onClick={() => handleTabChange("following")} className="text-center hover:opacity-80 transition-opacity">
                <span className="block text-white font-bold text-lg">{profile.followingCount}</span>
                <span className="text-gray-400">Following</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── TABS ──────────────────────────────────────────────────────── */}
        <div className="flex gap-8 border-b border-gray-700 mb-6">
          <button className={tabClass("posts")} onClick={() => handleTabChange("posts")}>Posts</button>
          <button className={tabClass("followers")} onClick={() => handleTabChange("followers")}>Followers</button>
          <button className={tabClass("following")} onClick={() => handleTabChange("following")}>Following</button>
        </div>

        {/* ── TAB CONTENT ───────────────────────────────────────────────── */}

        {/* POSTS */}
        {activeTab === "posts" && (
          <div className="space-y-6">
            {blogs.length === 0 ? (
              <p className="text-center text-gray-500 py-12">No posts yet.</p>
            ) : (
              blogs.map((blog: any) => (
                <Link key={blog.id} href={`/blog/${blog.id}`} className="block">
                  <article className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-orange-500/50 transition-all duration-200 group">
                    <h2 className="text-white font-bold text-lg mb-2 group-hover:text-orange-400 transition-colors">
                      {blog.title}
                    </h2>
                    <div
                      className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-3"
                      dangerouslySetInnerHTML={{ __html: sanitize(blog.description) }}
                    />
                    {blog.imageUrl && (
                      <div className="w-full h-44 bg-gray-700 rounded-lg overflow-hidden mb-3">
                        <CldImage
                          src={blog.imageUrl}
                          width={800}
                          height={300}
                          crop="fill"
                          gravity="center"
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-5 text-gray-500 text-xs mt-1">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {blog._count?.like ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {blog._count?.comment ?? 0}
                      </span>
                      <span className="ml-auto">{timeAgo(blog.createdAt)}</span>
                    </div>
                  </article>
                </Link>
              ))
            )}
          </div>
        )}

        {/* FOLLOWERS */}
        {activeTab === "followers" && (
          <div className="space-y-3">
            {followers.length === 0 ? (
              <p className="text-center text-gray-500 py-12">No followers yet.</p>
            ) : (
              followers.map((f: any) => (
                <UserRow key={f.id} person={f} currentUser={user} onProfileClick={(id) => router.push(`/profile/${id}`)} />
              ))
            )}
          </div>
        )}

        {/* FOLLOWING */}
        {activeTab === "following" && (
          <div className="space-y-3">
            {following.length === 0 ? (
              <p className="text-center text-gray-500 py-12">Not following anyone yet.</p>
            ) : (
              following.map((f: any) => (
                <UserRow key={f.id} person={f} currentUser={user} onProfileClick={(id) => router.push(`/profile/${id}`)} />
              ))
            )}
          </div>
        )}

      </div>
    </HomeLayout>
  );
}

// ── UserRow sub-component ──────────────────────────────────────────────────────
function UserRow({ person, currentUser, onProfileClick }: {
  person: any;
  currentUser: any;
  onProfileClick: (id: number) => void;
}) {
  const isYou = currentUser?.id === person.id;

  return (
    <div className="flex items-center gap-4 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 hover:border-gray-600 transition-all">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center font-bold text-white shrink-0">
        {person.name?.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <button
          onClick={() => onProfileClick(person.id)}
          className="text-white font-semibold text-sm hover:text-orange-400 transition-colors truncate block text-left"
        >
          {person.name}
        </button>
        <p className="text-gray-500 text-xs truncate">{person.email}</p>
      </div>

      {/* Badge */}
      {isYou && (
        <span className="text-xs text-gray-500 italic">You</span>
      )}
    </div>
  );
}
