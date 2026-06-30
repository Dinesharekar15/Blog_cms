import express from "express"
import { createServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import cors from "cors"
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import type { Response, Request } from "express"
import dotenv from 'dotenv'

import authRoutes from "./routes/authRoutes.js"
import blogRoutes from "./routes/blogRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import { prisma } from "./lib/prisma.js"

dotenv.config()

const app = express()
const httpServer = createServer(app)

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"

// ─── Socket.IO setup ──────────────────────────────────────────────────────────
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
})

// Authenticate socket connections using the JWT cookie
io.use((socket, next) => {
  const cookieHeader = socket.handshake.headers.cookie || ""
  const tokenMatch = cookieHeader.match(/auth_token=([^;]+)/)
  const token = tokenMatch?.[1]

  if (!token) return next(new Error("No auth token"))

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    socket.data.userId = decoded.id
    next()
  } catch {
    next(new Error("Invalid token"))
  }
})

io.on("connection", (socket) => {
  const userId: number = socket.data.userId
  console.log(`[Socket] User ${userId} connected — ${socket.id}`)

  // Join a conversation room
  socket.on("join_conversation", (conversationId: number) => {
    socket.join(`conv_${conversationId}`)
  })

  // Leave a conversation room
  socket.on("leave_conversation", (conversationId: number) => {
    socket.leave(`conv_${conversationId}`)
  })

  // Send a message
  socket.on(
    "send_message",
    async (data: { conversationId: number; content: string }) => {
      const { conversationId, content } = data

      if (!content?.trim()) return

      try {
        // Verify user is a member of this conversation
        const conv = await prisma.conversation.findUnique({
          where: { id: conversationId },
        })
        if (!conv || (conv.user1Id !== userId && conv.user2Id !== userId)) return

        // Persist message to DB
        const message = await prisma.directMessage.create({
          data: {
            conversationId,
            senderId: userId,
            content: content.trim(),
          },
          include: {
            sender: { select: { id: true, name: true, profileImg: true } },
          },
        })

        // Update conversation updatedAt so it sorts to top
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() },
        })

        // Emit the new message to everyone in the room (sender + receiver)
        io.to(`conv_${conversationId}`).emit("message_received", {
          conversationId,
          message: {
            id: message.id,
            content: message.content,
            senderId: message.senderId,
            sender: message.sender,
            isRead: message.isRead,
            createdAt: message.createdAt,
          },
        })

        // Notify other user's personal room for sidebar unread update
        const otherUserId =
          conv.user1Id === userId ? conv.user2Id : conv.user1Id
        io.to(`user_${otherUserId}`).emit("unread_update", { conversationId })
      } catch (err) {
        console.error("[Socket] send_message error:", err)
      }
    }
  )

  // Mark messages as read — emit read receipt to the other user
  socket.on("read_messages", async (conversationId: number) => {
    try {
      const conv = await prisma.conversation.findUnique({
        where: { id: conversationId },
      })
      if (!conv) return

      await prisma.directMessage.updateMany({
        where: {
          conversationId,
          senderId: { not: userId },
          isRead: false,
        },
        data: { isRead: true },
      })

      // Tell the original sender their messages were read
      const otherUserId = conv.user1Id === userId ? conv.user2Id : conv.user1Id
      io.to(`user_${otherUserId}`).emit("messages_read", { conversationId })
    } catch (err) {
      console.error("[Socket] read_messages error:", err)
    }
  })

  // Each user also joins their personal room for cross-conversation notifications
  socket.join(`user_${userId}`)

  socket.on("disconnect", () => {
    console.log(`[Socket] User ${userId} disconnected`)
  })
})

// ─── Express middleware ───────────────────────────────────────────────────────
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}))

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes)
app.use("/api/v1/user", userRoutes)
app.use('/api/v1/blog', blogRoutes)
app.use('/api/v1/chat', chatRoutes)

app.get('/', async (req: Request, res: Response) => {
  res.status(200).json({ msg: "Blog CMS API is running" })
})

// ─── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`Server + Socket.IO listening on port ${PORT}`)
})
