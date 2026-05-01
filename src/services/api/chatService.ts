import { env } from '@/config/env';
import { API_ROUTES } from '@/config/constants';
import type { Message, Source } from '@/types';

export interface ChatCallbacks {
  onToken: (token: string) => void;
  onSources?: (sources: Source[]) => void;
  signal?: AbortSignal;
}

/**
 * Chat against a session — supports both SSE streaming and plain JSON responses.
 * When the backend returns JSON, the answer is drip-fed via onToken to produce
 * a typewriter effect identical to real SSE streaming.
 */
export async function sessionChat(
  sessionId: string,
  message: string,
  callbacks: ChatCallbacks
): Promise<Message> {
  const res = await fetch(`${env.apiUrl}${API_ROUTES.SESSION_CHAT(sessionId)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: message }),
    signal: callbacks.signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  const ct = res.headers.get('content-type') ?? '';
  if (ct.includes('text/event-stream')) return readSSE(res, callbacks);

  const data = await res.json() as { answer: string; sources?: Source[]; session_id?: string };
  const msg: Message = {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: data.answer,
    sources: data.sources ?? [],
  };
  if (msg.sources.length) callbacks.onSources?.(msg.sources);
  await typewriter(msg.content, callbacks.onToken, callbacks.signal);
  return msg;
}

/**
 * Stateless streaming via the dedicated stream endpoint.
 * Used as a fallback when the session endpoint is unavailable.
 */
export async function streamChat(
  message: string,
  callbacks: ChatCallbacks
): Promise<Message> {
  const res = await fetch(`${env.apiUrl}${API_ROUTES.STREAM_CHAT}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: message }),
    signal: callbacks.signal,
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return readSSE(res, callbacks);
}

// Drip-feed content in small chunks to produce a typewriter effect.
// 5 chars per 10 ms ≈ 500 chars/sec — fast enough to feel live, slow enough to read.
async function typewriter(
  content: string,
  onToken: (token: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const CHUNK = 5;
  const TICK_MS = 10;
  for (let i = 0; i < content.length; i += CHUNK) {
    if (signal?.aborted) return;
    onToken(content.slice(i, i + CHUNK));
    await new Promise<void>(r => setTimeout(r, TICK_MS));
  }
}

async function readSSE(res: Response, callbacks: ChatCallbacks): Promise<Message> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let content = '';
  let sources: Source[] = [];
  let done = false;

  while (!done) {
    const { done: streamDone, value } = await reader.read();
    if (streamDone) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data: ')) continue;
      const payload = trimmed.slice(6);
      if (payload === '[DONE]') { done = true; break; }

      try {
        const parsed = JSON.parse(payload) as { content?: string; sources?: Source[] };
        if (parsed.content) { content += parsed.content; callbacks.onToken(parsed.content); }
        if (parsed.sources) { sources = parsed.sources; callbacks.onSources?.(sources); }
      } catch {
        content += payload;
        callbacks.onToken(payload);
      }
    }
  }

  return { id: crypto.randomUUID(), role: 'assistant', content, sources };
}
