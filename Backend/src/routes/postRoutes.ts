import express from 'express'
import { creatPost,allposts } from '../controllers/post.js'
import { authmiddelware } from '../middelwares/authmiddelware.js'
const router=express.Router()

router.post('/publish',authmiddelware,creatPost)
router.get('/',allposts)

export default router 