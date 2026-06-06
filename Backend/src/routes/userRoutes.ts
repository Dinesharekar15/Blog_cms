import express from "express"
import {
  followUser,
  getUserBlogs,
  getUserFollowers,
  getUserFollowings,
  getUserMetaData,
  unFollowUser,
  loggedInUserBolgs,
  loggedInUserProfile,
  searchUsers,
  searchPosts,
  updateProfile,
  changePassword,
} from "../controllers/user.js"
import { isUserAuthenticated } from "../middelwares/authmiddelware.js"

const router = express.Router()

// Logged-in user profile
router.get("/me", isUserAuthenticated, loggedInUserProfile)
router.get('/me/blogs', isUserAuthenticated, loggedInUserBolgs)
router.put('/me/update', isUserAuthenticated, updateProfile)
router.put('/me/change-password', isUserAuthenticated, changePassword)

// Search — must be BEFORE /:userId wildcard
router.get('/search/users', isUserAuthenticated, searchUsers)
router.get('/search/posts', isUserAuthenticated, searchPosts)

// Any user by ID
router.get('/:userId/metadata', isUserAuthenticated, getUserMetaData)
router.get("/:userId/followers", isUserAuthenticated, getUserFollowers)
router.get("/:userId/following", isUserAuthenticated, getUserFollowings)
router.get("/:userId/blogs", isUserAuthenticated, getUserBlogs)

// Follow / Unfollow
router.post('/:userId/follow', isUserAuthenticated, followUser)
router.delete('/:userId/follow', isUserAuthenticated, unFollowUser)

export default router