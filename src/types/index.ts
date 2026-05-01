export interface Source {
  chunk_id: string;
  document_id: string;
  source: string;
  page_number: number;
  similarity: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources: Source[];
}

export interface Session {
  id: string;
  title: string | null;
  is_active: boolean;
}

export interface SessionDetail extends Session {
  messages: Message[];
}

export interface Document {
  id: string;
  filename: string;
  created_at: string;
}
