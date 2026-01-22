import express from "express"
import { followUser, getUserBlogs, getUserFollowers, getUserFollowings, getUserMetaData, unFollowUser, loggedInUserBolgs, loggedInUserProfile } from "../controllers/user.js"
import { isUserAuthenticated } from "../middelwares/authmiddelware.js"
const router=express.Router()

// Logged-in user
router.get("/me",isUserAuthenticated,loggedInUserProfile)
router.get('/me/blogs',isUserAuthenticated,loggedInUserBolgs)

// Any user
router.get('/:userId/metadata',isUserAuthenticated,getUserMetaData)
router.get("/:userId/followers",isUserAuthenticated,getUserFollowers)
router.get("/:userId/following",isUserAuthenticated,getUserFollowings)
router.get("/:userId/blogs", isUserAuthenticated, getUserBlogs);

// Follow / Unfollow (single resource)
router.post('/:userId/follow',isUserAuthenticated,followUser)
router.delete('/:userId/follow',isUserAuthenticated,unFollowUser)



export default router