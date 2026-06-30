// NEXT_PUBLIC_BACKEND_URL already includes "/api/v1" (e.g. http://localhost:5000/api/v1)
// so we must NOT append /api/v1 again in fetch calls below.
const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api/v1";

const defaultOptions: RequestInit = {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OtherUser {
  id: number;
  name: string;
  profileImg: string | null;
}

export interface LastMessage {
  content: string;
  senderId: number;
  isRead: boolean;
  isMine: boolean;
  createdAt: string;
}

export interface Conversation {
  id: number;
  otherUser: OtherUser;
  lastMessage: LastMessage | null;
  unreadCount: number;
  updatedAt: string;
}

export interface MessageSender {
  id: number;
  name: string;
  profileImg: string | null;
}

export interface ChatMessage {
  id: number;
  content: string;
  senderId: number;
  sender: MessageSender;
  isRead: boolean;
  createdAt: string;
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function fetchConversations(): Promise<Conversation[]> {
  const res = await fetch(`${API_BASE}/chat/conversations`, defaultOptions);
  if (!res.ok) throw new Error("Failed to fetch conversations");
  const data = await res.json();
  return data.conversations;
}

export async function getOrCreateConversation(
  userId: number
): Promise<{ conversation: { id: number }; otherUser: OtherUser }> {
  const res = await fetch(
    `${API_BASE}/chat/conversations/${userId}`,
    { ...defaultOptions, method: "POST" }
  );
  if (!res.ok) throw new Error("Failed to get/create conversation");
  return res.json();
}

export async function fetchMessages(
  conversationId: number,
  cursor?: number
): Promise<{ messages: ChatMessage[]; hasMore: boolean; nextCursor: number | null }> {
  const params = cursor ? `?cursor=${cursor}` : "";
  const res = await fetch(
    `${API_BASE}/chat/conversations/${conversationId}/messages${params}`,
    defaultOptions
  );
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

export async function markConversationRead(conversationId: number): Promise<void> {
  await fetch(
    `${API_BASE}/chat/conversations/${conversationId}/read`,
    { ...defaultOptions, method: "PATCH" }
  );
}
