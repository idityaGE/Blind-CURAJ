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
    stopSearching,
    isWaiting,
    isConnected,
    isAuthenticated
  } = useChat();

  if (!isConnected) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="bg-blue-50 p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-blue-700 font-medium text-lg">
            Connecting to chat server...
          </p>
        </div>
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
        onStop={stopSearching}
      />
      <MessageList
        messages={messages}
        currentUserId="me"
      />
      <MessageInput
        onSendMessage={sendMessage}
        disabled={!currentPartner}
      />
    </div>
  );
}