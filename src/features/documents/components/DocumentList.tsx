import { FileText, Loader2, Trash2 } from 'lucide-react';
import type { Document } from '@/types';

interface DocumentListProps {
  documents: Document[];
  deleting: Set<string>;
  onDelete: (doc: Document) => void;
}

export function DocumentList({ documents, deleting, onDelete }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-8 py-12 text-center">
        <FileText className="mx-auto mb-3 h-8 w-8 text-gray-200" />
        <p className="text-sm text-gray-400">No documents yet — upload a PDF to get started.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {documents.map(doc => (
        <li
          key={doc.id}
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50">
            <FileText className="h-4 w-4 text-red-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-800">{doc.filename}</p>
            {doc.created_at && (
              <p className="mt-0.5 text-xs text-gray-400">
                {new Date(doc.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            )}
          </div>
          <button
            onClick={() => onDelete(doc)}
            disabled={deleting.has(doc.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
            title="Delete document"
          >
            {deleting.has(doc.id)
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Trash2 className="h-4 w-4" />}
          </button>
        </li>
      ))}
    </ul>
  );
}
