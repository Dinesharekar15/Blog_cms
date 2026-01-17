import express from "express";
import { followUser, getUserBlogs, getUserFollowers, getUserFollowings, getUserMetaData, unFollowUser, userBolgs, userProfile } from "../controllers/user.js";
import { isUserAuthenticated } from "../middelwares/authmiddelware.js";
const router = express.Router();
router.get("/profile", isUserAuthenticated, userProfile);
router.get('/me/blogs', isUserAuthenticated, userBolgs);
router.get('/:userId/metadata', isUserAuthenticated, getUserMetaData);
router.post('/:userId/follow', isUserAuthenticated, followUser);
router.delete('/:userId/unfollow', isUserAuthenticated, unFollowUser);
router.get("/:userId/followers", isUserAuthenticated, getUserFollowers);
router.get("/:userId/followings", isUserAuthenticated, getUserFollowings);
router.get("/:userId/blogs", isUserAuthenticated, getUserBlogs);
export default router;
//# sourceMappingURL=userRoutes.js.map