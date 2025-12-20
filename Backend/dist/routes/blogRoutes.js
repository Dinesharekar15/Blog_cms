import express from 'express';
import { creatBlog } from '../controllers/blog.js';
import { authMiddleware } from '../middelwares/authmiddelware.js';
import { upload } from '../middelwares/upload.js';
const router = express.Router();
router.post('/', authMiddleware, upload.single("image"), creatBlog);
export default router;
//# sourceMappingURL=blogRoutes.js.map