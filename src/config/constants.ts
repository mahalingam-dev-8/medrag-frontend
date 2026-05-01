export const STORAGE_KEYS = {
  SESSIONS: 'medrag_sessions',
} as const;

export const API_ROUTES = {
  // Sessions
  SESSIONS: '/api/v1/sessions/',
  SESSION: (id: string) => `/api/v1/sessions/${id}/`,
  SESSION_CHAT: (id: string) => `/api/v1/sessions/${id}/chat/`,
  // Chat
  STREAM_CHAT: '/api/v1/chat/stream/',
  // Documents
  DOCUMENTS: '/api/v1/documents/',
  DOCUMENT: (id: string) => `/api/v1/documents/${id}/`,
  DOCUMENT_INGEST: '/api/v1/documents/ingest',
} as const;
