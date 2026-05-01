import { useCallback, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar, useSessions } from '@/features/sessions';
import { sessionsService } from '@/services';

export type SessionsContext = ReturnType<typeof useSessions>;

export default function AppLayout() {
  const navigate = useNavigate();
  const sessions = useSessions();
  const creating = useRef(false);

  const handleNewChat = useCallback(async () => {
    if (creating.current) return;
    creating.current = true;
    try {
      const session = await sessionsService.create();
      sessions.addSession(session);
      navigate(`/chat/${session.id}`);
    } catch {
      navigate('/chat');
    } finally {
      creating.current = false;
    }
  }, [navigate, sessions]);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar
        sessions={sessions.sessions}
        onNewChat={handleNewChat}
        onDeleteSession={sessions.removeSession}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Outlet context={sessions} />
      </div>
    </div>
  );
}
