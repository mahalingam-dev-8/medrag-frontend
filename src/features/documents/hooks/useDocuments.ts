import { useCallback, useEffect, useState } from 'react';
import { documentsService } from '@/services';
import type { Document } from '@/types';

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    documentsService
      .list()
      .then(setDocuments)
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const upload = useCallback(async (files: File[]): Promise<Document[]> => {
    setUploading(true);
    const uploaded: Document[] = [];
    try {
      for (const file of files) {
        const doc = await documentsService.ingest(file);
        setDocuments(prev => [doc, ...prev]);
        uploaded.push(doc);
      }
    } finally {
      setUploading(false);
    }
    return uploaded;
  }, []);

  const remove = useCallback(async (id: string) => {
    setDeleting(prev => new Set(prev).add(id));
    try {
      await documentsService.delete(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } finally {
      setDeleting(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, []);

  return { documents, loading, uploading, deleting, error, upload, remove };
}
