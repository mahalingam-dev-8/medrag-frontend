# MedRAG Assistant: Frontend

The React app for MedRAG, a medical document assistant that answers questions from uploaded PDFs and cites the source of every answer.

**[▶ Watch the demo](https://www.loom.com/share/ca3d9b4ca0e64aa39f77bb86b2a96ec6)** · **[Live app](https://medrag-frontend-lilac.vercel.app)** · **[Backend repo](https://github.com/mahalingam-dev-8/medrag-backend)**

> The backend runs on a free instance. If it has been idle, the first request can take up to a minute.

## Features

- Ask a question and watch the answer stream in over SSE, with citations back to the source document and page.
- Past chat sessions are listed in the sidebar and loaded from the backend, with localStorage as a fallback.
- Upload PDFs by drag and drop, and delete documents you no longer need.
- Answers are rendered as Markdown, so lists and tables from the model display properly.

## Tech stack

React 19 · TypeScript · Vite · React Router 7 · Tailwind CSS 4 · shadcn/ui · react-markdown · react-dropzone · Vercel

## Project structure

```
src/
├── config/          # environment variables and API routes
├── features/
│   ├── chat/        # chat UI and the useChat hook
│   ├── documents/   # document list, drop zone, useDocuments hook
│   └── sessions/    # sidebar and the useSessions hook
├── layouts/         # shared layout with the sidebar
├── pages/           # ChatPage, DocumentsPage
├── services/api/    # HTTP client and one service per resource
├── types/           # shared TypeScript types
└── lib/             # small utilities
```

<details>
<summary><b>Run locally</b></summary>

Needs Node.js 18+ and the [backend](https://github.com/mahalingam-dev-8/medrag-backend) running.

```bash
npm install
echo "VITE_API_URL=http://localhost:8000" > .env
npm run dev          # http://localhost:5173
```

In production, set `VITE_API_URL` in the Vercel project settings to the deployed backend. `vercel.json` rewrites every path to `index.html` so client-side routes work on refresh.

</details>
