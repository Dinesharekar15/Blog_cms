import express from "express";
import { userPost, userProfile } from "../controllers/user.js";
import { authMiddleware } from "../middelwares/authmiddelware.js";
const router = express.Router();
router.get("/profile", authMiddleware, userProfile);
router.get('/blogs', authMiddleware, userPost);
export default router;
//# sourceMappingURL=userRoutes.js.map