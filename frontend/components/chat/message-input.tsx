'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { EmojiPicker } from '../emoji-picker';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [messageInput, setMessageInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput('');
    }
  };

  return (
    <div className="border-t bg-background px-4 py-3">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative flex items-center">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="#message"
              disabled={disabled}
              className={`
                h-12
                pr-12 
                text-base 
                transition-all 
                duration-200
                border-muted-foreground/20
                bg-background
                focus-visible:ring-1
                focus-visible:ring-offset-0
                ${disabled ? 'opacity-50' : 'hover:border-primary/50 focus-visible:border-primary'}
              `}
            />
            <div className="absolute right-3 top-[50%] -translate-y-1/2">
              <EmojiPicker
                onChange={(emoji) => setMessageInput((prev) => prev + emoji)}
                disabled={disabled}
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={disabled}
            size="icon"
            variant="default"
            className={`
              h-12 
              w-12 
              rounded-full 
              shrink-0
              transition-all 
              duration-200
              ${disabled ? 'opacity-50' : 'hover:scale-105'}
            `}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}