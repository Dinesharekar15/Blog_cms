import { prisma } from "../lib/prisma.js";
// ─── Helper: normalise conversation so user1Id < user2Id always ──────────────
function getOrderedIds(a, b) {
    return a < b ? [a, b] : [b, a];
}
// ─── GET /api/v1/chat/conversations ──────────────────────────────────────────
// Returns all conversations for the logged-in user with last message + unread count
export const getConversations = async (req, res) => {
    const myId = req.user.id;
    try {
        const conversations = await prisma.conversation.findMany({
            where: {
                OR: [{ user1Id: myId }, { user2Id: myId }],
            },
            include: {
                user1: { select: { id: true, name: true, profileImg: true } },
                user2: { select: { id: true, name: true, profileImg: true } },
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                    select: {
                        id: true,
                        content: true,
                        senderId: true,
                        isRead: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: { updatedAt: "desc" },
        });
        const result = await Promise.all(conversations.map(async (conv) => {
            const otherUser = conv.user1Id === myId ? conv.user2 : conv.user1;
            const lastMsg = conv.messages[0] ?? null;
            // Count unread messages sent by the OTHER user
            const unreadCount = await prisma.directMessage.count({
                where: {
                    conversationId: conv.id,
                    senderId: { not: myId },
                    isRead: false,
                },
            });
            return {
                id: conv.id,
                otherUser,
                lastMessage: lastMsg
                    ? {
                        content: lastMsg.content,
                        senderId: lastMsg.senderId,
                        isRead: lastMsg.isRead,
                        createdAt: lastMsg.createdAt,
                        isMine: lastMsg.senderId === myId,
                    }
                    : null,
                unreadCount,
                updatedAt: conv.updatedAt,
            };
        }));
        return res.status(200).json({ conversations: result });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};
// ─── POST /api/v1/chat/conversations/:userId ─────────────────────────────────
// Find existing conversation or create a new one
export const getOrCreateConversation = async (req, res) => {
    const myId = req.user.id;
    const otherId = Number(req.params.userId);
    if (myId === otherId) {
        return res.status(400).json({ msg: "Cannot chat with yourself" });
    }
    try {
        // Check the other user exists
        const otherUser = await prisma.user.findUnique({
            where: { id: otherId },
            select: { id: true, name: true, profileImg: true, bio: true },
        });
        if (!otherUser)
            return res.status(404).json({ msg: "User not found" });
        const [user1Id, user2Id] = getOrderedIds(myId, otherId);
        // Upsert the conversation (create if not exists)
        const conversation = await prisma.conversation.upsert({
            where: { user1Id_user2Id: { user1Id, user2Id } },
            create: { user1Id, user2Id },
            update: {},
            include: {
                user1: { select: { id: true, name: true, profileImg: true } },
                user2: { select: { id: true, name: true, profileImg: true } },
            },
        });
        return res.status(200).json({ conversation, otherUser });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};
// ─── GET /api/v1/chat/conversations/:id/messages ─────────────────────────────
// Paginated message history for a conversation (newest first, cursor-based)
export const getMessages = async (req, res) => {
    const myId = req.user.id;
    const conversationId = Number(req.params.id);
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const LIMIT = 30;
    try {
        // Verify the requester is part of this conversation
        const conv = await prisma.conversation.findUnique({
            where: { id: conversationId },
        });
        if (!conv)
            return res.status(404).json({ msg: "Conversation not found" });
        if (conv.user1Id !== myId && conv.user2Id !== myId) {
            return res.status(403).json({ msg: "Forbidden" });
        }
        const messages = await prisma.directMessage.findMany({
            where: {
                conversationId,
                isDeleted: false,
                ...(cursor ? { id: { lt: cursor } } : {}),
            },
            include: {
                sender: { select: { id: true, name: true, profileImg: true } },
            },
            orderBy: { createdAt: "desc" },
            take: LIMIT + 1,
        });
        const hasMore = messages.length > LIMIT;
        const items = hasMore ? messages.slice(0, LIMIT) : messages;
        const nextCursor = hasMore ? (items.at(-1)?.id ?? null) : null;
        return res.status(200).json({
            messages: items.reverse(), // reverse to oldest-first for display
            hasMore,
            nextCursor,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};
// ─── PATCH /api/v1/chat/conversations/:id/read ───────────────────────────────
// Mark all messages in a conversation as read (those sent by the other user)
export const markAsRead = async (req, res) => {
    const myId = req.user.id;
    const conversationId = Number(req.params.id);
    try {
        await prisma.directMessage.updateMany({
            where: {
                conversationId,
                senderId: { not: myId },
                isRead: false,
            },
            data: { isRead: true },
        });
        return res.status(200).json({ msg: "Marked as read" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};
//# sourceMappingURL=chat.js.map