import { httpClient } from './client';
import { API_ROUTES } from '@/config/constants';
import type { Session, SessionDetail } from '@/types';

export const sessionsService = {
  create: () =>
    httpClient.post<Session>(API_ROUTES.SESSIONS, { title: null }),

  get: (id: string) =>
    httpClient.get<SessionDetail>(API_ROUTES.SESSION(id)),

  delete: (id: string) =>
    httpClient.del<void>(API_ROUTES.SESSION(id)),
};
