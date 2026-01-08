import express from "express";
import { userPost, userProfile } from "../controllers/user.js";
import { isUserAuthenticated } from "../middelwares/authmiddelware.js";
const router = express.Router();
router.get("/profile", isUserAuthenticated, userProfile);
router.get('/blogs', isUserAuthenticated, userPost);
export default router;
//# sourceMappingURL=userRoutes.js.map