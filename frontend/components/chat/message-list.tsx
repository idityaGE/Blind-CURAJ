'use client';

import { Message } from './chat-context';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'
            }`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${message.senderId === currentUserId
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
              }`}
          >
            <p className="break-words">{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}