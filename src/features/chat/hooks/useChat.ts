import { useCallback, useRef, useState } from 'react';
import { sessionChat, streamChat } from '@/services';
import type { Message, Source } from '@/types';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingSources, setStreamingSources] = useState<Source[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const loadMessages = useCallback((msgs: Message[]) => {
    setMessages(msgs);
    setStreamingContent('');
    setStreamingSources([]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setStreamingContent('');
    setError(null);
  }, []);

  const sendMessage = useCallback(async (sessionId: string, content: string) => {
    setError(null);
    abortRef.current?.abort();

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content, sources: [] };
    setMessages(prev => [...prev, userMsg]);

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setIsStreaming(true);
    setStreamingContent('');
    setStreamingSources([]);

    let accumulated = '';
    let accSources: Source[] = [];

    const callbacks = {
      signal: ctrl.signal,
      onToken: (token: string) => { accumulated += token; setStreamingContent(accumulated); },
      onSources: (sources: Source[]) => { accSources = sources; setStreamingSources(sources); },
    };

    try {
      await sessionChat(sessionId, content, callbacks);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        try {
          await streamChat(content, callbacks);
        } catch (fallback) {
          if ((fallback as Error).name !== 'AbortError') {
            setError((fallback as Error).message);
          }
        }
      }
    }

    if (accumulated) {
      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: accumulated, sources: accSources },
      ]);
    }

    setIsStreaming(false);
    setStreamingContent('');
    setStreamingSources([]);
  }, []);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    // sendMessage's catch block will commit whatever was accumulated
  }, []);

  const streamingMessage: Message | null =
    isStreaming && streamingContent
      ? { id: '__streaming__', role: 'assistant', content: streamingContent, sources: streamingSources }
      : null;

  return {
    messages,
    streamingMessage,
    isStreaming,
    error,
    setError,
    loadMessages,
    clearMessages,
    sendMessage,
    stopStreaming,
  };
}
