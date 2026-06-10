const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export interface Message {
  id?: string;
  sender: "user" | "ai";
  text: string;
  timeStamp?: string;
}

export interface SendMessageResponse {
  reply: string;
  sessionId: string;
}

export interface FetchHistoryResponse {
  messages: Message[];
}

export async function sendMessage(
  message: string,
  sessionId?: string
): Promise<SendMessageResponse> {
  const res = await fetch(`${BASE_URL}/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error ?? "Something went wrong. Please try again.");
  }

  return data as SendMessageResponse;
}

export async function fetchHistory(
  sessionId: string
): Promise<FetchHistoryResponse> {
  const res = await fetch(`${BASE_URL}/chat/messages/${sessionId}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to load chat history.");
  }

  return data as FetchHistoryResponse;
}