import { useCallback, useState } from 'react';
import { AlertCircle, CheckCircle, Loader2, X } from 'lucide-react';
import { DropZone, DocumentList, useDocuments } from '@/features/documents';
import type { Document } from '@/types';

type Toast = { type: 'success' | 'error'; text: string } | null;

export default function DocumentsPage() {
  const { documents, loading, uploading, deleting, upload, remove } = useDocuments();
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDrop = useCallback(
    async (files: File[]) => {
      try {
        const uploaded = await upload(files);
        showToast(
          'success',
          uploaded.length === 1
            ? `${uploaded[0].filename} uploaded successfully`
            : `${uploaded.length} files uploaded`
        );
      } catch (err) {
        showToast('error', `Upload failed: ${(err as Error).message}`);
      }
    },
    [upload]
  );

  const handleDelete = useCallback(
    async (doc: Document) => {
      if (!confirm(`Delete "${doc.filename}"? This cannot be undone.`)) return;
      try {
        await remove(doc.id);
        showToast('success', `${doc.filename} deleted`);
      } catch (err) {
        showToast('error', `Delete failed: ${(err as Error).message}`);
      }
    },
    [remove]
  );

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {toast && (
        <div
          className={`fixed right-4 top-4 z-50 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm shadow-lg ${
            toast.type === 'success'
              ? 'border-green-200 bg-white text-green-800'
              : 'border-red-200 bg-white text-red-800'
          }`}
        >
          {toast.type === 'success'
            ? <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
            : <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />}
          <span>{toast.text}</span>
          <button onClick={() => setToast(null)} className="ml-2 opacity-60 hover:opacity-100">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="mb-8 mt-1 text-sm text-gray-500">
          Upload PDF files to make them searchable in chat.
        </p>

        <DropZone onDrop={handleDrop} uploading={uploading} />

        <div className="mt-8">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Ingested documents ({documents.length})
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
            </div>
          ) : (
            <DocumentList documents={documents} deleting={deleting} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </div>
  );
}
