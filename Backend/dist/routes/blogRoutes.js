import express from 'express';
import { allBlogs, creatBlog } from '../controllers/blog.js';
import { isUserAuthenticated } from '../middelwares/authmiddelware.js';
import { upload } from '../middelwares/upload.js';
const router = express.Router();
router.post('/publish', isUserAuthenticated, upload.single("image"), creatBlog);
router.get("/", allBlogs);
export default router;
//# sourceMappingURL=blogRoutes.js.map