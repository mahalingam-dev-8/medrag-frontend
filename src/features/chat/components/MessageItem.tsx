import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User } from 'lucide-react';
import { Citations } from './Citations';
import { cn } from '@/lib/utils';
import type { Message } from '@/types';

interface MessageItemProps {
  message: Message;
  isStreaming?: boolean;
}

export function MessageItem({ message, isStreaming }: MessageItemProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('group flex gap-3 px-4 py-5 md:px-8', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white',
          isUser ? 'bg-blue-600' : 'bg-emerald-600'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={cn('max-w-[80%] space-y-1.5', isUser && 'flex flex-col items-end')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed',
            isUser
              ? 'rounded-tr-sm bg-blue-600 text-white'
              : 'rounded-tl-sm bg-gray-100 text-gray-900'
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-code:before:content-none prose-code:after:content-none prose-code:text-xs prose-headings:my-2 prose-p:my-1 prose-pre:rounded-lg prose-pre:text-xs">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
              {isStreaming && (
                <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-gray-700 align-middle" />
              )}
            </div>
          )}
        </div>

        {!isUser && <Citations sources={message.sources ?? []} />}
      </div>
    </div>
  );
}
