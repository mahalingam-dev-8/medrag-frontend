import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Plus, MessageSquare, Trash2, FileText, Menu, X, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Session } from '@/types';

interface SidebarProps {
  sessions: Session[];
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
}

function SidebarContent({
  sessions,
  onNewChat,
  onDeleteSession,
  onClose,
}: SidebarProps & { onClose?: () => void }) {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col bg-gray-900 text-white">
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-400" />
          <span className="text-sm font-semibold text-gray-100">MedRAG</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="rounded-md p-1 text-gray-400 hover:bg-gray-700">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="p-3">
        <button
          onClick={() => { onNewChat(); onClose?.(); }}
          className="flex w-full items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
        >
          <Plus className="h-4 w-4" />
          New chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-2">
        {sessions.length > 0 && (
          <p className="px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wider text-gray-500">
            Recents
          </p>
        )}
        {sessions.map(session => (
          <div
            key={session.id}
            className={cn(
              'group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
              sessionId === session.id
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            )}
          >
            <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-70" />
            <Link
              to={`/chat/${session.id}`}
              onClick={onClose}
              className="flex-1 truncate py-0.5 leading-none"
              title={session.title ?? 'New Chat'}
            >
              {session.title ?? 'New Chat'}
            </Link>
            <button
              onClick={e => {
                e.preventDefault();
                onDeleteSession(session.id);
                if (sessionId === session.id) navigate('/chat');
              }}
              className="rounded p-0.5 text-gray-500 opacity-0 transition-all hover:text-red-400 group-hover:opacity-100"
              title="Delete chat"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {sessions.length === 0 && (
          <p className="px-3 py-4 text-center text-xs text-gray-600">No chats yet</p>
        )}
      </div>

      <div className="border-t border-gray-800 p-3">
        <Link
          to="/documents"
          onClick={onClose}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-200"
        >
          <FileText className="h-4 w-4" />
          Documents
        </Link>
      </div>
    </div>
  );
}

export function Sidebar(props: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-3 top-3 z-40 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white shadow-md md:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 shadow-xl transition-transform duration-200 md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent {...props} onClose={() => setMobileOpen(false)} />
      </aside>

      <aside className="hidden md:flex md:w-64 md:shrink-0 md:flex-col">
        <SidebarContent {...props} />
      </aside>
    </>
  );
}
