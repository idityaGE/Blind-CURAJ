'use client';

import { useChat } from './chat-context';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { ChatHeader } from './chat-header';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export function ChatInterface() {
  const {
    messages,
    sendMessage,
    currentPartner,
    findNewPartner,
    isWaiting,
    isConnected,
    isAuthenticated
  } = useChat();

  if (!isConnected) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Alert>
          <AlertDescription>
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Connecting to chat server...
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Alert>
          <AlertDescription>
            Please log in to start chatting
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        hasPartner={!!currentPartner}
        isWaiting={isWaiting}
        onSkip={findNewPartner}
      />
      <MessageList
        messages={messages}
        currentUserId="me"  // We now use 'me' to identify our messages
      />
      <MessageInput
        onSendMessage={sendMessage}
        disabled={!currentPartner}
      />
    </div>
  );
}