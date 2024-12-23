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
    <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-3xl mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          {isWaiting ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
            <MessageSquare
              className={`h-5 w-5 ${hasPartner
                  ? 'text-primary'
                  : 'text-muted-foreground'
                }`}
            />
          )}
          <span className={`font-medium ${isWaiting
              ? 'text-primary'
              : hasPartner
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}>
            {isWaiting
              ? 'Looking for a chat partner...'
              : hasPartner
                ? 'Connected to a chat partner'
                : 'Click "Find Chat" to start'
            }
          </span>
        </div>
        <Button
          variant={isWaiting ? "destructive" : hasPartner ? "secondary" : "outline"}
          size="sm"
          onClick={isWaiting ? onStop : onSkip}
          className="flex items-center gap-2 transition-colors duration-200"
        >
          {isWaiting ? (
            <>
              <XCircle className="h-4 w-4" />
              <span>Stop</span>
            </>
          ) : hasPartner ? (
            <>
              <SkipForward className="h-4 w-4" />
              <span>Skip</span>
            </>
          ) : (
            'Find Chat'
          )}
        </Button>
      </div>
    </div>
  );
}