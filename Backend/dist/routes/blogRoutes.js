import express from 'express';
import { addComment, allBlogs, allCommentOfBlog, creatBlog, getOneBlog, likeBlog, unlikeBlog } from '../controllers/blog.js';
import { isUserAuthenticated } from '../middelwares/authmiddelware.js';
import { upload } from '../middelwares/upload.js';
const router = express.Router();
router.post('/publish', isUserAuthenticated, upload.single("image"), creatBlog);
router.get("/", isUserAuthenticated, allBlogs);
router.get("/:blogId", isUserAuthenticated, getOneBlog);
router.post("/:blogId/like", isUserAuthenticated, likeBlog);
router.delete("/:blogId/like", isUserAuthenticated, unlikeBlog);
router.post("/:blogId/comment", isUserAuthenticated, addComment);
router.get("/:blogId/comment", isUserAuthenticated, allCommentOfBlog);
export default router;
//# sourceMappingURL=blogRoutes.js.map