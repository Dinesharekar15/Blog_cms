import express from "express"
import { userPost, userProfile } from "../controllers/user.js"
import { authMiddleware } from "../middelwares/authmiddelware.js"
const router=express.Router()

router.get("/profile",authMiddleware,userProfile)
router.get('/post',authMiddleware,userPost)
export default router