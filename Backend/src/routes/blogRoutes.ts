import express from 'express'
import { addComment, allBlogs, creatBlog, likeBlog } from '../controllers/blog.js'
import { isUserAuthenticated  } from '../middelwares/authmiddelware.js'
import { upload } from '../middelwares/upload.js'
const router=express.Router()

router.post('/publish',isUserAuthenticated,upload.single("image") ,creatBlog)
router.get("/",isUserAuthenticated,allBlogs)
router.post("/:blogId/like",isUserAuthenticated,likeBlog)
router.post("/:blogId/comment",isUserAuthenticated,addComment)

export default router 