import { Router } from "express";
import { isUserAuthenticated } from "../middelwares/authmiddelware.js";
import { getConversations, getOrCreateConversation, getMessages, markAsRead, } from "../controllers/chat.js";
const router = Router();
// All chat routes require authentication
router.use(isUserAuthenticated);
// GET  /api/v1/chat/conversations            — list all conversations
router.get("/conversations", getConversations);
// POST /api/v1/chat/conversations/:userId    — get or create DM with a user
router.post("/conversations/:userId", getOrCreateConversation);
// GET  /api/v1/chat/conversations/:id/messages  — paginated message history
router.get("/conversations/:id/messages", getMessages);
// PATCH /api/v1/chat/conversations/:id/read — mark messages as read
router.patch("/conversations/:id/read", markAsRead);
export default router;
//# sourceMappingURL=chatRoutes.js.map