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
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        ) : (
          <MessageSquare className={`h-5 w-5 ${hasPartner ? 'text-green-500' : 'text-gray-400'}`} />
        )}
        <span className={`font-medium ${isWaiting ? 'text-blue-500' :
          hasPartner ? 'text-green-500' :
            'text-gray-300'
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
        className={`flex items-center gap-2 transition-all duration-200 ${isWaiting ? 'bg-red-500 hover:bg-red-600' :
          hasPartner ? 'bg-blue-500 hover:bg-blue-600' : ''
          }`}
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