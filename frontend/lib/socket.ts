import { io, Socket } from "socket.io-client";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// Strip any path (e.g. "/api/v1") — socket.io must connect to the base origin,
// not an API path (which would be misinterpreted as a Socket.IO namespace)
const SOCKET_URL = (() => {
  try {
    return new URL(BACKEND_URL).origin; // e.g. "http://localhost:5000"
  } catch {
    return "http://localhost:5000";
  }
})();

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true, // sends the auth_token cookie automatically
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
    });
  }

  return socket;
}

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect();
  }
  socket = null;
}

export function joinConversation(conversationId: number) {
  getSocket().emit("join_conversation", conversationId);
}

export function leaveConversation(conversationId: number) {
  getSocket().emit("leave_conversation", conversationId);
}

export function sendSocketMessage(conversationId: number, content: string) {
  getSocket().emit("send_message", { conversationId, content });
}

export function emitReadMessages(conversationId: number) {
  getSocket().emit("read_messages", conversationId);
}
