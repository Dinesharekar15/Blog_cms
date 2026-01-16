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
const userPost = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    console.log(userId);
    if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const blogs = await prisma.blog.findMany({ where: { userId } });
        // console.log(userId)
        if (blogs.length === 0) {
            res.status(201).json({ msg: "No blogs posted", blogs: [] });
            return;
        }
        res.status(201).json({ blogs: blogs });
        return;
    }
    catch (error) {
        res.status(500).json({ msg: 'Error during searching blogs', error });
        return;
    }
});
const getUserMetaData = async (req, res) => {
    const userId = Number(req.body.id);
    try {
        const data = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                name: true,
                email: true,
                bio: true,
                profileImg: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        blogs: true
                    }
                }
            }
        });
        const formattedData = {
            ...data,
            followers: data?._count.followers,
            following: data?._count.following,
            blogsCount: data?._count.blogs
        };
        res.status(400).json({ formattedData });
    }
    catch (error) {
        res.status(500).json({ mag: "Internal Server Error" });
    }
};
export { userProfile, userPost, getUserMetaData };
//# sourceMappingURL=user.js.map