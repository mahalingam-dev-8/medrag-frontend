import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { MessageList, MessageInput, useChat } from '@/features/chat';
import { sessionsService } from '@/services';
import type { SessionsContext } from '@/layouts/AppLayout';

export default function ChatPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { addSession, updateSession } = useOutletContext<SessionsContext>();

  const { messages, streamingMessage, isStreaming, error, setError, loadMessages, clearMessages, sendMessage, stopStreaming } = useChat();

  const [isLoading, setIsLoading] = useState(false);
  const pendingSessionId = useRef<string | null>(null);
  const titleFetched = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      clearMessages();
      pendingSessionId.current = null;
      titleFetched.current = false;
      return;
    }

    titleFetched.current = false;
    setIsLoading(true);
    sessionsService
      .get(sessionId)
      .then(detail => {
        loadMessages(detail.messages ?? []);
        if (detail.title) {
          updateSession(detail.id, { title: detail.title });
          titleFetched.current = true;
        }
      })
      .catch(err => setError(`Could not load session: ${(err as Error).message}`))
      .finally(() => setIsLoading(false));
  }, [sessionId, clearMessages, loadMessages, updateSession, setError]);

  const handleSend = useCallback(
    async (content: string) => {
      let sid = sessionId ?? pendingSessionId.current;

      if (!sid) {
        try {
          const session = await sessionsService.create();
          sid = session.id;
          pendingSessionId.current = sid;
          addSession(session);
          navigate(`/chat/${sid}`, { replace: true });
        } catch (err) {
          setError(`Failed to create session: ${(err as Error).message}`);
          return;
        }
      }

      const isFirstMessage = !titleFetched.current;
      await sendMessage(sid, content);

      if (isFirstMessage) {
        titleFetched.current = true;
        sessionsService.get(sid).then(detail => {
          if (detail.title) updateSession(sid!, { title: detail.title });
        }).catch(() => {});
      }
    },
    [sessionId, addSession, navigate, sendMessage, setError, updateSession]
  );

  return (
    <>
      {isLoading && (
        <div className="h-0.5 w-full overflow-hidden bg-blue-100">
          <div className="h-full w-2/5 animate-[loading_1.5s_ease-in-out_infinite] bg-blue-500" />
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between border-b border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-4 text-lg leading-none text-red-400 hover:text-red-600"
          >
            &times;
          </button>
        </div>
      )}

      <MessageList messages={messages} streamingMessage={streamingMessage} isStreaming={isStreaming} />
      <MessageInput onSend={handleSend} onStop={stopStreaming} isStreaming={isStreaming} disabled={isLoading} />
    </>
  );
}
