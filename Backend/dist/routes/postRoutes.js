import express from 'express';
import { creatPost, allposts } from '../controllers/post.js';
import { authMiddleware } from '../middelwares/authmiddelware.js';
const router = express.Router();
router.post('/publish', authMiddleware, creatPost);
router.get('/', allposts);
export default router;
//# sourceMappingURL=postRoutes.js.map