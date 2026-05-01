import { useRef, useState, type KeyboardEvent } from 'react';
import { Send, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  disabled?: boolean;
  isStreaming?: boolean;
}

export function MessageInput({ onSend, onStop, disabled, isStreaming }: MessageInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-4 md:px-8">
      <div className="mx-auto max-w-3xl">
        <div
          className={cn(
            'flex items-end gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm transition-colors',
            !isStreaming && 'focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500',
            'border-gray-300'
          )}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKey}
            onInput={autoResize}
            placeholder="Ask a question about your documents…"
            rows={1}
            disabled={disabled && !isStreaming}
            className="flex-1 resize-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-50"
            style={{ maxHeight: '200px' }}
          />
          <button
            onClick={isStreaming ? onStop : submit}
            disabled={!isStreaming && (!value.trim() || disabled)}
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all',
              isStreaming
                ? 'bg-red-500 text-white hover:bg-red-600'
                : value.trim() && !disabled
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'cursor-not-allowed bg-gray-100 text-gray-400'
            )}
          >
            {isStreaming
              ? <Square className="h-3.5 w-3.5 fill-current" />
              : <Send className="h-3.5 w-3.5" />}
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-gray-400">
          Enter to send · Shift+Enter for newline
        </p>
      </div>
    </div>
  );
}
