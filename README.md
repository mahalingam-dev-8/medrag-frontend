# MedRAG Assistant — Frontend

React + TypeScript + Tailwind CSS frontend for the MedRAG medical document assistant.

**Backend repo:** [mahalingam-dev-8/medrag-backend](https://github.com/mahalingam-dev-8/medrag-backend)

---

## Demo

![MedRAG Assistant](https://github.com/user-attachments/assets/984d20c8-c6ae-42e3-8bfe-2650f2747326)

---

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — build tool and dev server
- **React Router DOM v7** — client-side routing
- **Tailwind CSS v4** + **shadcn/ui** — styling and components
- **react-markdown** + **remark-gfm** — markdown rendering for assistant responses
- **react-dropzone** — document upload

---

## Features

- **Chat** — send questions and receive AI-generated answers with source citations
- **Streaming** — typewriter effect for responses; SSE streaming via `/chat/stream/`
- **Session history** — sidebar lists all sessions, loaded from the backend on startup
- **Document management** — upload PDFs and delete ingested documents
- **Persistent sessions** — session list synced with backend; localStorage used as fallback

---

## Project Structure

```
src/
├── config/          # Environment variables and API route constants
├── features/
│   ├── chat/        # Chat UI components and useChat hook
│   ├── documents/   # Document list, drop zone, useDocuments hook
│   └── sessions/    # Sidebar, useSessions hook
├── layouts/         # AppLayout (shared sidebar + outlet)
├── pages/           # ChatPage, DocumentsPage
├── services/api/    # httpClient, chatService, sessionsService, documentsService
├── types/           # Shared TypeScript interfaces
└── lib/             # Utility functions
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Backend running (see [medrag-backend](https://github.com/mahalingam-dev-8/medrag-backend))

### Install and Run

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` and expects the backend at `http://localhost:8000` by default.

### Environment Variables

Create a `.env` file at the project root:

```env
VITE_API_URL=http://localhost:8000
```

For production, set `VITE_API_URL` to your deployed backend URL (e.g. `https://api-linga.onrender.com`).

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Deployment

Deployed on **Vercel**. A `vercel.json` rewrite rule handles SPA routing:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Set `VITE_API_URL` in Vercel project environment variables to point to the production backend.
