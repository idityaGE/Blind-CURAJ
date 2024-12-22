'use client';

import { Button } from '@/components/ui/button';
import { MessageSquare, SkipForward, Loader2, XCircle } from 'lucide-react';

interface ChatHeaderProps {
  hasPartner: boolean;
  isWaiting: boolean;
  onSkip: () => void;
  onStop: () => void;
}

export function ChatHeader({ hasPartner, isWaiting, onSkip, onStop }: ChatHeaderProps) {
  return (
    <div className="border-b p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        {isWaiting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <MessageSquare className="h-5 w-5" />
        )}
        <span className="font-medium">
          {isWaiting
            ? 'Looking for a chat partner...'
            : hasPartner
              ? 'Chatting with someone'
              : 'Click "Find Chat" to start'
          }
        </span>
      </div>
      <Button
        variant={isWaiting ? "destructive" : "outline"}
        size="sm"
        onClick={isWaiting ? onStop : onSkip}
        className="flex items-center gap-2"
      >
        {isWaiting ? (
          <>
            <XCircle className="h-4 w-4" />
            Stop
          </>
        ) : hasPartner ? (
          <>
            <SkipForward className="h-4 w-4" />
            Skip
          </>
        ) : (
          'Find Chat'
        )}
      </Button>
    </div>
  );
}