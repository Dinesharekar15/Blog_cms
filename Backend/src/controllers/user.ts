import asyncHandler from "express-async-handler";

import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

interface CustomRequest extends Request {
  user?: any;
}

const loggedInUserProfile = async (req: CustomRequest, res: Response) => {
  try {
    const id = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        profileImg: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            blogs: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const formatted = {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      profileImg: user.profileImg,
      followingCount: user._count.following,
      followersCount: user._count.followers,
      blogCount: user._count.blogs
    }

    return res.status(200).json({ formatted });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const loggedInUserBolgs = asyncHandler(async (req: CustomRequest, res: Response) => {
  const userId = req.user.id;
  console.log(userId);
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const blogs = await prisma.blog.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            profileImg: true,
            email: true,
          }
        },
        _count: {
          select: {
            like: true,
            comment: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    // console.log(userId)
    if (blogs.length === 0) {
      res.status(201).json({ msg: "No blogs posted", blogs: [] });
      return;
    }
    res.status(201).json({ blogs: blogs });
    return;
  } catch (error) {
    res.status(500).json({ msg: "Error during searching blogs", error });
    return;
  }
});

const getUserMetaData = async (req: CustomRequest, res: Response) => {
  const userId = Number(req.params.userId);
  const loggedInUserId = req.user.id;

  try {
    const isFollowing = await prisma.follower.findUnique({
      where: {
        followerId_followingId: {
          followerId: loggedInUserId,
          followingId: userId,
        },
      },
    });
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        profileImg: true,
        _count: {
          select: {
            followers: true,
            following: true,
            blogs: true,
          },
        },
      },
    });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const formattedData = {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      profileImg: user.profileImg,
      followersCount: user?._count.followers,
      followingCount: user?._count.following,
      blogsCount: user?._count.blogs,
      isFollowing: Boolean(isFollowing),
    };
    res.status(200).json({ formattedData });
  } catch (error) {
    res.status(500).json({ mag: "Internal Server Error" });
  }
};

const followUser = async (req: CustomRequest, res: Response) => {
  const userId = Number(req.params.userId);
  const loggedInUserId = req.user.id;

  if (userId === loggedInUserId) {
    return res.status(400).json({ msg: "You cannot follow yourself" });
  }

  try {
    await prisma.follower.create({
      data: {
        followerId: loggedInUserId,
        followingId: userId,
      },
    });

    return res.status(200).json({ msg: "Followed user successfully" });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({ msg: "You already follow this user" });
    }
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const unFollowUser = async (req: CustomRequest, res: Response) => {
  const userId = Number(req.params.userId);
  const loggedInUserId = req.user.id;

  if (userId === loggedInUserId) {
    return res.status(400).json({ msg: "You cannot unfollow yourself" });
  }
  console.log("userIdBackend:", userId)
  try {
    await prisma.follower.delete({
      where: {
        followerId_followingId: {
          followerId: loggedInUserId,
          followingId: userId,
        },
      },
    });

    return res.status(200).json({ msg: "Unfollowed user successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getUserFollowers = async (req: CustomRequest, res: Response) => {
  const userId = Number(req.params.userId);
  const loggedInUserId = req.user.id
  try {
    const followers = await prisma.follower.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: {
          select: {
            id: true,
            email: true,
            name: true,
            profileImg: true,
          },
        },

      },
      orderBy: {
        id: "desc"
      }
    });
    const formattedFollowers = await Promise.all(
      followers.map(async (f) => {
        const isFollowing = await prisma.follower.findUnique({
          where: {
            followerId_followingId: {
              followerId: loggedInUserId,
              followingId: userId
            }
          }
        })
        return {
          ...f.follower,
          isFollowing: Boolean(isFollowing)
        }
      })
    )



    res.status(200).json({
      count: formattedFollowers.length,
      followers: formattedFollowers,
    });
  } catch (error) {

    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });

  }
};


const getUserFollowings = async (req: CustomRequest, res: Response) => {
  const userId = Number(req.params.userId);
  const loggedInUserId = req.user.id
  try {
    const followings = await prisma.follower.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: {
          select: {
            id: true,
            email: true,
            name: true,
            profileImg: true,
          },
        },

      },
      orderBy: {
        id: "desc"
      }
    });
    const formattedFollowings = await Promise.all(
      followings.map(async (f) => {
        const isFollowing = await prisma.follower.findUnique({
          where: {
            followerId_followingId: {
              followerId: loggedInUserId,
              followingId: userId
            }
          }
        })
        return {
          ...f.following,
          isFollowing: Boolean(isFollowing)
        }
      })
    )
    res.status(200).json({
      count: formattedFollowings.length,
      followings: formattedFollowings
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};


const getUserBlogs = async (req: CustomRequest, res: Response) => {
  const userId = Number(req.params.userId);

  try {
    const blogs = await prisma.blog.findMany({
      where: {
        userId, // get only this user's blogs
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImg: true,
          },
        },
        _count: {
          select: {
            like: true,
            comment: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};


const searchUsers = async (req: CustomRequest, res: Response) => {
  const q = String(req.query.q || "").trim();
  const LIMIT = 10;

  if (!q) return res.status(200).json({ users: [], hasMore: false });

  try {
    const users = await prisma.user.findMany({
      where: {
        name: { contains: q, mode: "insensitive" },
        // Note: isVerified filter removed so users can find anyone to chat with.
        // You can re-add it for the public blog search page if needed.
      },
      select: { id: true, name: true, profileImg: true, bio: true },
      take: LIMIT + 1,
      orderBy: { name: "asc" },
    });

    const hasMore = users.length > LIMIT;
    return res.status(200).json({ users: users.slice(0, LIMIT), hasMore });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const searchPosts = async (req: CustomRequest, res: Response) => {
  const q = String(req.query.q || "").trim();
  const LIMIT = 10;

  if (!q) return res.status(200).json({ posts: [], hasMore: false });

  try {
    const posts = await prisma.blog.findMany({
      where: { title: { contains: q, mode: "insensitive" } },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        createdAt: true,
        user: { select: { id: true, name: true, profileImg: true } },
        _count: { select: { like: true, comment: true } },
      },
      take: LIMIT + 1,
      orderBy: { createdAt: "desc" },
    });

    const hasMore = posts.length > LIMIT;
    return res.status(200).json({ posts: posts.slice(0, LIMIT), hasMore });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const updateProfile = async (req: CustomRequest, res: Response) => {
  const id = req.user?.id;
  const { name, bio, profileImg } = req.body;

  try {
    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(name?.trim() && { name: name.trim() }),
        ...(bio !== undefined && { bio: bio.trim() || null }),
        ...(profileImg !== undefined && { profileImg: profileImg || null }),
      },
      select: { id: true, name: true, email: true, bio: true, profileImg: true },
    });
    return res.status(200).json({ msg: "Profile updated", user: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const changePassword = async (req: CustomRequest, res: Response) => {
  const id = req.user?.id;
  const { oldPassword, newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ msg: "New password must be at least 6 characters" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id }, select: { password: true } });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const valid = await (await import("bcrypt")).default.compare(oldPassword, user.password);
    if (!valid) return res.status(401).json({ msg: "Current password is incorrect" });

    const hashed = await (await import("bcrypt")).default.hash(newPassword, 10);
    await prisma.user.update({ where: { id }, data: { password: hashed } });

    return res.status(200).json({ msg: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export { loggedInUserProfile, loggedInUserBolgs, getUserMetaData, followUser, unFollowUser, getUserFollowers, getUserFollowings, getUserBlogs, searchUsers, searchPosts, updateProfile, changePassword };
