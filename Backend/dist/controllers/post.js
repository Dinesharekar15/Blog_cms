import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const creatPost = asyncHandler(async (req, res) => {
    const { title, description, imageUrl, videoUrl } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const post = await prisma.blog.create({
            data: {
                title,
                description,
                imageUrl,
                videoUrl,
                userId,
            },
        });
        if (!post) {
            res.json({ msg: "Post creation failed " });
            return;
        }
        res.json({ msg: "post created succefully ", post });
    }
    catch (error) {
        res.json({ mag: "error at post creation ", err: error });
        return;
    }
});
const allposts = asyncHandler(async (req, res) => {
    const posts = await prisma.blog.findMany({});
    res.status(200).json({ posts });
});
export { allposts, creatPost };
//# sourceMappingURL=post.js.map