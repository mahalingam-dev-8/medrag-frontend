import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/config/constants';
import { sessionsService } from '@/services';
import type { Session } from '@/types';

function load(): Session[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) ?? '[]') as Session[];
  } catch {
    return [];
  }
}

function persist(sessions: Session[]): void {
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
}

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>(load);

  useEffect(() => {
    sessionsService.list()
      .then(data => {
        const active = data.filter(s => s.is_active);
        setSessions(active);
        persist(active);
      })
      .catch(() => {/* keep localStorage fallback */});
  }, []);

  const addSession = useCallback((session: Session) =>
    setSessions(prev => {
      const updated = [session, ...prev.filter(s => s.id !== session.id)];
      persist(updated);
      return updated;
    }), []);

  const updateSession = useCallback((id: string, patch: Partial<Session>) =>
    setSessions(prev => {
      const updated = prev.map(s => (s.id === id ? { ...s, ...patch } : s));
      persist(updated);
      return updated;
    }), []);

  const removeSession = useCallback(async (id: string) => {
    try {
      await sessionsService.delete(id);
    } catch {
      // soft-delete may 404 — still remove from local list
    }
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== id);
      persist(updated);
      return updated;
    });
  }, []);

  return { sessions, addSession, updateSession, removeSession };
}
