// components/UserHoverCard.tsx
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useBlogs } from "@/context/BlogContext";
import { useState } from "react";

export function UserHoverCard({ hoverduser,onFollow,loadingUserId}: { hoverduser: any,onFollow:(userId:number)=>void,loadingUserId:number|null} ) {
    const {user,followUser,unfollowUser}=useUser();
    const {blogs,setBlogs}=useBlogs();
    
  return (
    <HoverCard>
      {/* TRIGGER: The Name */}
      <HoverCardTrigger asChild>
        <button className="text-white font-semibold text-sm hover:text-blue-400 hover:underline transition-colors duration-200 text-left">
          {hoverduser.name}
        </button>
      </HoverCardTrigger>

      {/* CONTENT: The Card that pops up */}
      <HoverCardContent className="w-80 bg-gray-900 border-gray-700 text-white">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src={hoverduser.avatar || ""} />
            <AvatarFallback>{hoverduser.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-white">@{hoverduser.username || hoverduser.name}</h4>
            <p className="text-sm text-gray-400">
              {/* Fallback bio if you don't have one in DB yet */}
              {hoverduser.bio || "Tech enthusiast and writer."}
            </p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">
                Joined {new Date(hoverduser.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex justify-between text-sm mt-4 border-t border-gray-700 pt-4">
  <div className="text-center">
    <div className="font-bold text-white">
      {hoverduser._count?.blogs ?? 0}
    </div>
    <div className="text-xs text-gray-500">Blogs</div>
  </div>

  <div className="text-center">
    <div className="font-bold text-white">
      {hoverduser._count?.followers ?? 0}
    </div>
    <div className="text-xs text-gray-500">Followers</div>
  </div>

  <div className="text-center">
    <div className="font-bold text-white">
      {hoverduser._count?.following ?? 0}
    </div>
    <div className="text-xs text-gray-500">Following</div>
  </div>
</div>

        {/* Action Button */}
        <div className="mt-4">
            {
                hoverduser.id!=user?.id &&
                <Button disabled={loadingUserId===hoverduser.id} onClick={()=>onFollow(hoverduser.id)} className={`w-full cursor-pointer ${
                    hoverduser.isFollowing
                      ? "bg-gray-600 text-gray-300 hover:bg-gray-500"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}>
                {hoverduser.isFollowing ? "Following" : "Follow"}
             </Button>
            }
             
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}