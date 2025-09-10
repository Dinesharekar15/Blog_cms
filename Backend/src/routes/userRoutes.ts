import express from "express"
import { userPost, userProfile } from "../controllers/user.js"
import { authmiddelware } from "../middelwares/authmiddelware.js"
const router=express.Router()

router.get("/profile",authmiddelware,userProfile)
router.get('/post',authmiddelware,userPost)
export default router