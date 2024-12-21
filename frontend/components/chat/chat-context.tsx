'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  sessionId?: string;
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (content: string) => void;
  currentPartner: string | null;
  findNewPartner: () => void;
  isWaiting: boolean;
  isConnected: boolean;
  isAuthenticated: boolean;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children, token }: { children: React.ReactNode; token?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const {
    isConnected,
    isAuthenticated,
    isWaiting,
    partnerId,
    currentSessionId,
    sendMessage: socketSendMessage,
    findChat,
    skipChat,
    socket // Make sure to expose socket from useSocket
  } = useSocket(token);

  useEffect(() => {
    if (partnerId === null) {
      setMessages([]);
    }
  }, [partnerId]);

  // Handle incoming messages
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleMessage = (messageData: {
      content: string;
      senderId: string;
      sessionId: string;
      timestamp: string;
    }) => {
      setMessages(prev => [...prev, {
        id: Math.random().toString(), // Generate an ID since server doesn't provide one
        content: messageData.content,
        senderId: messageData.senderId,
        timestamp: new Date(messageData.timestamp),
        sessionId: messageData.sessionId
      }]);
    };

    socket.on('message', handleMessage);

    return () => {
      socket.off('message', handleMessage);
    };
  }, [isConnected, socket, currentSessionId]);

  const handleSendMessage = (content: string) => {
    if (currentSessionId && content.trim()) {
      socketSendMessage(content);
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        content,
        senderId: 'me',
        timestamp: new Date(),
        sessionId: currentSessionId
      }]);
    }
  };

  const handleFindNewPartner = () => {
    setMessages([]);
    if (currentSessionId) {
      skipChat();
    } else {
      findChat();
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage: handleSendMessage,
        currentPartner: partnerId,
        findNewPartner: handleFindNewPartner,
        isWaiting,
        isConnected,
        isAuthenticated
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};