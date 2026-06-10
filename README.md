# ShopEasy Assistant

A mini AI-powered customer support chat agent for a fictional e-commerce store.

**Live Demo:** [https://easy-shop-assistant-spur.vercel.app](https://easy-shop-assistant-spur.vercel.app)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL (NeonDB) |
| ORM | Prisma |
| LLM | Groq (Llama 3.3 70B) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Getting Started Locally

### Prerequisites
- Node.js 18+
- A PostgreSQL database (NeonDB free tier works)
- A Groq API key — get one free at [console.groq.com](https://console.groq.com)

---

### Backend Setup

```bash
cd backend
npm install        # also runs prisma generate via postinstall
```

Create a `.env` file in the `backend/` folder:

```env
DATABASE_URL=your_neon_postgres_connection_url
GROQ_API_KEY=your_groq_api_key
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start the dev server:

```bash
npm run dev        # runs on http://localhost:3000
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:3000
```

Start the dev server:

```bash
npm run dev        # runs on http://localhost:5173
```

---

## Architecture Overview

### Backend

```
backend/
├── src/
│   ├── index.ts              # Express app entry point, CORS, middleware
│   ├── routes/
│   │   └── chat.ts           # POST /chat/message, GET /chat/messages/:sessionId
│   └── services/
│       └── llm.ts            # generateReply() — Groq API integration
├── lib/
│   └── prisma.ts             # Prisma client instance
└── prisma/
    └── schema.prisma         # DB schema — Conversation + Message models
```

### Frontend

```
frontend/src/
├── api/
│   └── chat.ts               # API client — sendMessage(), fetchHistory()
├── hooks/
│   └── useChat.ts            # All state logic — messages, sessionId, loading, errors
└── components/
    ├── ChatWidget.tsx         # Main container
    ├── MessageList.tsx        # Scrollable message list + typing indicator
    ├── MessageBubble.tsx      # Individual message bubble
    └── ChatInput.tsx         # Input box + send button
```

---

## LLM Notes

**Provider:** Groq (using `llama-3.3-70b-versatile` model)

Groq was chosen over OpenAI for its **free tier and extremely fast inference** — ideal for a real-time chat experience.

**Prompting approach:**
- System prompt defines the agent's role, tone, and hard rules
- FAQ knowledge (shipping, returns, support hours) is hardcoded directly in the system prompt for simplicity
- Last 5 messages of conversation history are included for context
- Temperature set to 0.7 for a balance of consistency and natural responses
- Max 500 character input enforced on both frontend and backend
- Max 1024 output tokens to control cost
- Max 500 character input enforced on both frontend and backend
- Max 1024 output tokens to control cost

---

## Data Model

```prisma
model Conversation {
  id        String    @id @default(cuid())
  createdAt DateTime  @default(now())
  messages  Message[]
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  sender         String       # "user" | "ai"
  text           String
  timeStamp      DateTime     @default(now())
  conversation   Conversation @relation(fields: [conversationId], references: [id])
}
```

Sessions are persisted in the browser's `localStorage` — on page reload, the frontend fetches message history via `GET /chat/messages/:sessionId` and restores the conversation.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/chat/message` | Send a message, get AI reply |
| GET | `/chat/messages/:sessionId` | Fetch conversation history |

---

## Trade-offs & If I Had More Time

**Trade-offs made:**
- Used Groq (Llama) instead of OpenAI — free and faster, but less reliable for edge cases.
- FAQ knowledge is hardcoded in the system prompt — simple but not scalable. A real system would store this in the DB and inject it dynamically.
- Only last 5 messages sent as history — keeps costs low but loses context in very long conversations.
- No auth — sessions are identified by a client-side `localStorage` ID only for not to lost in reloads reload.
- NeonDB free tier auto-suspends after 5 minutes of inactivity — first request after sleep takes ~1 second longer.
- added a button in the UI(new chat) icase user wants to go for fresh chat.

**If I had more time:**
- Add rate limiting per session to prevent abuse.
- Write unit tests for `generateReply()` and integration tests for the chat route.
- Add proper auth so users can access their chat history across devices.
- Implement Redis caching for frequently asked questions to reduce LLM API costs.
