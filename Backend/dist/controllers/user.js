import asyncHandler from "express-async-handler";
import { prisma } from "../lib/prisma.js";
const userProfile = async (req, res) => {
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
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
const userBolgs = asyncHandler(async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ msg: "Error during searching blogs", error });
        return;
    }
});
const getUserMetaData = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ mag: "Internal Server Error" });
    }
};
const followUser = async (req, res) => {
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
    }
    catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({ msg: "You already follow this user" });
        }
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};
const unFollowUser = async (req, res) => {
    const userId = Number(req.params.userId);
    const loggedInUserId = req.user.id;
    if (userId === loggedInUserId) {
        return res.status(400).json({ msg: "You cannot unfollow yourself" });
    }
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};
const getUserFollowers = async (req, res) => {
    const userId = Number(req.params.userId);
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
        const formattedFollowers = followers.map((f) => f.follower);
        res.status(200).json({
            count: formattedFollowers.length,
            followers: formattedFollowers
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};
const getUserFollowings = async (req, res) => {
    const userId = Number(req.params.userId);
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
        const formattedFollowings = followings.map((f) => f.following);
        res.status(200).json({
            count: formattedFollowings.length,
            followings: formattedFollowings
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};
const getUserBlogs = async (req, res) => {
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};
export { userProfile, userBolgs, getUserMetaData, followUser, unFollowUser, getUserFollowers, getUserFollowings, getUserBlogs };
//# sourceMappingURL=user.js.map