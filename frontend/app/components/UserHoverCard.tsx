// components/UserHoverCard.tsx
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { getProfileImageUrl } from "@/lib/cloudinary";
import { useAuthGate } from "@/context/AuthGateContext";

export function UserHoverCard({ hoverduser, onFollow, loadingUserId }: { hoverduser: any; onFollow: (userId: number) => void; loadingUserId: number | null }) {
  const { user } = useUser();
  const { openAuthGate } = useAuthGate();
  const profileUrl = getProfileImageUrl(hoverduser.profileImg);

  return (
    <HoverCard>
      {/* TRIGGER: The Name */}
      <HoverCardTrigger asChild>
        <button className="text-white font-semibold text-sm hover:text-blue-400 hover:underline transition-colors duration-200 text-left">
          {hoverduser.name}
        </button>
      </HoverCardTrigger>

      {/* CONTENT: The Card that pops up */}
      <HoverCardContent className="w-80 bg-gray-900 border-gray-700 text-white p-4">

        {/* Avatar + Info Row */}
        <div className="flex items-start space-x-4">
          {/* Profile Photo */}
          <div className="flex-shrink-0 w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-xl ring-2 ring-orange-500/40">
            {profileUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileUrl}
                alt={hoverduser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              hoverduser.name?.charAt(0).toUpperCase()
            )}
          </div>

          {/* Name / Username / Bio */}
          <div className="flex-1 min-w-0 space-y-1">
            <h4 className="text-sm font-bold text-white truncate">
              {hoverduser.name}
            </h4>
            <p className="text-xs text-gray-400 truncate">
              @{hoverduser.username || hoverduser.email?.split("@")[0] || hoverduser.name}
            </p>
            <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
              {hoverduser.bio || "Tech enthusiast and writer."}
            </p>
            <div className="flex items-center pt-1">
              <CalendarDays className="mr-1.5 h-3 w-3 opacity-60" />
              <span className="text-xs text-gray-500">
                Joined {new Date(hoverduser.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex justify-around text-sm mt-4 border-t border-gray-700 pt-4">
          <div className="text-center">
            <div className="font-bold text-white">{hoverduser._count?.blogs ?? 0}</div>
            <div className="text-xs text-gray-500">Blogs</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-white">{hoverduser._count?.followers ?? 0}</div>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-white">{hoverduser._count?.following ?? 0}</div>
            <div className="text-xs text-gray-500">Following</div>
          </div>
        </div>

        {/* Follow Button */}
        {hoverduser.id !== user?.id && (
          <div className="mt-4">
            <Button
              disabled={loadingUserId === hoverduser.id}
              onClick={() => {
                if (!user) { openAuthGate(); return; }
                onFollow(hoverduser.id);
              }}
              className={`w-full cursor-pointer ${
                hoverduser.isFollowing
                  ? "bg-gray-600 text-gray-300 hover:bg-gray-500"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              {hoverduser.isFollowing ? "Following" : "Follow"}
            </Button>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}