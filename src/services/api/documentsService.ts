import { httpClient } from './client';
import { API_ROUTES } from '@/config/constants';
import type { Document } from '@/types';

export const documentsService = {
  list: () =>
    httpClient.get<Document[]>(API_ROUTES.DOCUMENTS),

  ingest: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return httpClient.postForm<Document>(API_ROUTES.DOCUMENT_INGEST, form);
  },

  delete: (id: string) =>
    httpClient.del<void>(API_ROUTES.DOCUMENT(id)),
};
