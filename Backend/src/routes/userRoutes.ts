import express from "express"
import { getUserMetaData, userPost, userProfile } from "../controllers/user.js"
import { isUserAuthenticated } from "../middelwares/authmiddelware.js"
const router=express.Router()

router.get("/profile",isUserAuthenticated,userProfile)
router.get('/blogs',isUserAuthenticated,userPost)
router.get('/blogs',isUserAuthenticated,userPost)
router.get('/metadata',isUserAuthenticated,getUserMetaData)
export default router