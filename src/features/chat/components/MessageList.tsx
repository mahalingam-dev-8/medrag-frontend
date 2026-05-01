import { useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';
import { MessageItem } from './MessageItem';
import type { Message } from '@/types';

interface MessageListProps {
  messages: Message[];
  streamingMessage?: Message | null;
  isStreaming?: boolean;
}

function ThinkingBubble() {
  return (
    <div className="flex gap-3 px-4 py-5 md:px-8">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
        <Bot className="h-4 w-4" />
      </div>
      <div className="max-w-[80%]">
        <div className="rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3.5">
          <div className="flex items-center gap-1.5">
            <span className="thinking-dot h-2 w-2 rounded-full bg-gray-400" />
            <span className="thinking-dot h-2 w-2 rounded-full bg-gray-400" />
            <span className="thinking-dot h-2 w-2 rounded-full bg-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MessageList({ messages, streamingMessage, isStreaming }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, streamingMessage?.content, isStreaming]);

  if (!messages.length && !streamingMessage && !isStreaming) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 text-white shadow-lg">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">MedRAG Assistant</h2>
        <p className="max-w-xs text-sm leading-relaxed text-gray-500">
          Ask questions about your medical documents. Upload PDFs on the Documents page to get started.
        </p>
        <div className="mt-6 grid w-full max-w-md grid-cols-1 gap-2 text-left sm:grid-cols-2">
          {[
            'What are the key findings?',
            'Summarize the patient history',
            'What medications were prescribed?',
            'Explain the diagnosis',
          ].map(q => (
            <div key={q} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
              {q}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="divide-y divide-gray-100">
        {messages.map(msg => (
          <MessageItem key={msg.id} message={msg} />
        ))}
        {isStreaming && !streamingMessage && <ThinkingBubble />}
        {streamingMessage && <MessageItem message={streamingMessage} isStreaming />}
      </div>
      <div ref={bottomRef} className="h-4 shrink-0" />
    </div>
  );
}
