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
    try {
        let imageUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`, {
                folder: "blogs"
            });
            imageUrl = result.secure_url;
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
export { creatBlog };
//# sourceMappingURL=blog.js.map