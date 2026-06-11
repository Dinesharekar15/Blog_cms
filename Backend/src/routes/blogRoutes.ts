import express from 'express'
import { addComment, allBlogs, allCommentOfBlog, creatBlog, getOneBlog, likeBlog, unlikeBlog } from '../controllers/blog.js'
import { isUserAuthenticated, optionalAuth } from '../middelwares/authmiddelware.js'
import { upload } from '../middelwares/upload.js'
const router=express.Router()

router.post('/publish',isUserAuthenticated,upload.single("image") ,creatBlog)
router.get("/",optionalAuth,allBlogs)             // public — guests can read
router.get("/:blogId",optionalAuth,getOneBlog)    // public — guests can read
router.post("/:blogId/like",isUserAuthenticated,likeBlog)
router.delete("/:blogId/like",isUserAuthenticated,unlikeBlog)
router.post("/:blogId/comment",isUserAuthenticated,addComment)
router.get("/:blogId/comment",optionalAuth,allCommentOfBlog)

export default router 