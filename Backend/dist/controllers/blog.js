import asyncHandler from "express-async-handler";
import { prisma } from "../lib/prisma.js";
import cloudinary from "../lib/cloudinary.js";
const creatBlog = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        res.status(500).json({ msg: "Title is required" });
        return;
    }
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    // console.log("title:",title,"description:",description)
    try {
        let imageUrl = null;
        if (req.file) {
            // console.log('yes')
            const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`, {
                folder: "blogs",
            });
            imageUrl = result.public_id;
        }
        const blog = await prisma.blog.create({
            data: {
                title,
                description,
                imageUrl,
                userId,
            },
        });
        res.status(201).json({
            msg: "post created succefully ",
            post: {
                id: blog.id,
                title: blog.title,
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ mag: "error at post creation ", err: error });
        return;
    }
});
//for home page
const allBlogs = asyncHandler(async (req, res) => {
    const userId = Number(req.user?.id);
    try {
        const blogs = await prisma.blog.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: { select: { like: true, comment: true } },
                like: userId ? { where: { userId } } : false,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        //isFollowing Logic
        let followingSet = new Set();
        if (userId) {
            const authorIds = blogs.map((b) => (b.user.id));
            const followingRelationship = await prisma.follower.findMany({
                where: {
                    followerId: userId,
                    followingId: { in: authorIds }
                },
                select: {
                    followingId: true
                }
            });
            followingSet = new Set(followingRelationship.map((f) => (f.followingId)));
        }
        const formattedBlog = blogs.map((blog) => ({
            ...blog,
            like: blog._count.like,
            comment: blog._count.comment,
            isLiked: blog.like?.length > 0,
            isFollowing: userId ? followingSet.has(blog.user.id) : false
        }));
        res.status(200).json({ msg: "All Bogs ", formattedBlog });
        return;
    }
    catch (error) {
        console.log(error.msg);
        res.status(500).json({ msg: "Internal server error" });
        return;
    }
});
//For BlogDetail page
const getOneBlog = async (req, res) => {
    const blogId = Number(req.params.blogId);
    const userId = Number(req.user?.id);
    if (isNaN(blogId)) {
        res.status(400).json({ msg: "Invalid blog id" });
        return;
    }
    try {
        const blog = await prisma.blog.findUnique({
            where: {
                id: blogId,
            },
            include: {
                user: {
                    select: { name: true, email: true },
                },
                like: userId ? { where: { userId } } : false,
                _count: { select: { like: true, comment: true } },
                comment: {
                    where: { parentId: null },
                    include: {
                        user: {
                            select: { name: true, id: true },
                        },
                        replies: {
                            include: { user: { select: { name: true, id: true } } },
                        },
                    },
                    orderBy: { createdAt: "desc" }
                },
            },
        });
        if (!blog) {
            res.status(404).json({ msg: "Blog Not Found" });
            return;
        }
        const response = {
            ...blog,
            likeCount: blog._count.like,
            commentCount: blog._count.comment,
            isLiked: blog.like?.length > 0
        };
        res.status(200).json({ response });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Server Error " });
    }
};
const likeBlog = async (req, res) => {
    const blogId = Number(req.params.blogId);
    const userId = Number(req.user?.id);
    try {
        const blog = await prisma.like.findMany({
            where: {
                userId,
                blogId,
            },
        });
        if (blog.length > 0) {
            res.status(400).json({ msg: "Post allready liked" });
            return;
        }
        await prisma.like.create({
            data: {
                userId,
                blogId,
            },
        });
        const likecounts = await prisma.like.count({
            where: {
                blogId,
            },
        });
        res.status(200).json({
            msg: "Blog Liked",
            likecounts,
        });
    }
    catch (error) {
        console.log(error.msg);
        res.status(500).json({ msg: "Like failed" });
        return;
    }
};
const unlikeBlog = async (req, res) => {
    const userId = Number(req.user?.id);
    const blogId = Number(req.params.blogId);
    try {
        await prisma.like.deleteMany({
            where: {
                userId,
                blogId,
            },
        });
        res.status(200).json({ msg: "Like Removed " });
    }
    catch (error) {
        console.log(error.msg);
        res.status(500).json({ msg: "Error :", error });
    }
};
const addComment = async (req, res) => {
    const userId = Number(req.user?.id);
    const blogId = Number(req.params.blogId);
    const { content, parentId } = req.body;
    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                userId,
                blogId,
                parentId: parentId || null,
            },
            include: {
                user: {
                    select: { id: true, name: true },
                },
            },
        });
        res.status(201).json({ msg: "Comment Added", comment: comment });
    }
    catch (error) {
        console.log(error.msg);
        res.status(500).json({ msg: "Fail to add comment" });
    }
};
const allCommentOfBlog = async (req, res) => {
    const blogId = Number(req.params.blogId);
    try {
        const comments = await prisma.comment.findMany({
            where: {
                blogId,
                parentId: null,
            },
            include: {
                user: { select: { id: true, name: true } },
                replies: {
                    include: {
                        user: { select: { id: true, name: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ msg: "Comments fetched", comments });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};
export { creatBlog, allBlogs, likeBlog, addComment, unlikeBlog, allCommentOfBlog, getOneBlog, };
//# sourceMappingURL=blog.js.map