import asyncHandler from 'express-async-handler';
import { prisma } from '../lib/prisma.js';
const creatPost = asyncHandler(async (req, res) => {
    const { title, description, imageUrl } = req.body;
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
                userId,
            },
        });
        if (!post) {
            res.status(500).json({ msg: "Post creation failed " });
            return;
        }
        res.json({ msg: "post created succefully ", post: {
                id: post.id,
                title: post.title
            } });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ mag: "error at post creation ", err: error });
        return;
    }
});
const allposts = asyncHandler(async (req, res) => {
    const posts = await prisma.blog.findMany({});
    res.status(200).json({ posts });
});
export { allposts, creatPost };
//# sourceMappingURL=post.js.map