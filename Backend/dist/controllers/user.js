import asyncHandler from "express-async-handler";
import { prisma } from "../lib/prisma.js";
const userProfile = asyncHandler(async (req, res) => {
    try {
        const id = req.user.id;
        const user = await prisma.user.findFirst({ where: { id } });
        if (!user) {
            res.json({ msg: "user not found error" });
            return;
        }
        res.status(201).json({
            user
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Insternal server error"
        });
    }
});
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
export { userProfile, userPost };
//# sourceMappingURL=user.js.map