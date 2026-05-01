import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Source } from '@/types';

interface CitationsProps {
  sources: Source[];
}

export function Citations({ sources }: CitationsProps) {
  const [open, setOpen] = useState(false);
  if (!sources.length) return null;

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs text-gray-500 transition-colors hover:text-gray-700"
      >
        <FileText className="h-3.5 w-3.5" />
        {sources.length} {sources.length === 1 ? 'source' : 'sources'}
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {open && (
        <div className="mt-2 space-y-1.5">
          {sources.map((src, i) => (
            <div
              key={src.chunk_id ?? i}
              className="flex items-start gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs"
            >
              <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-800">{src.source}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {src.page_number && (
                    <Badge variant="secondary">page {src.page_number}</Badge>
                  )}
                  <Badge
                    variant={
                      src.similarity >= 0.85 ? 'success' : src.similarity >= 0.7 ? 'default' : 'secondary'
                    }
                  >
                    {(src.similarity * 100).toFixed(0)}% match
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
