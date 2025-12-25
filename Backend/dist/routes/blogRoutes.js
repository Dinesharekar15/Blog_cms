import express from 'express';
import { allBlogs, creatBlog } from '../controllers/blog.js';
import { authMiddleware } from '../middelwares/authmiddelware.js';
import { upload } from '../middelwares/upload.js';
const router = express.Router();
router.post('/publish', authMiddleware, upload.single("image"), creatBlog);
router.get("/", allBlogs);
export default router;
//# sourceMappingURL=blogRoutes.js.map