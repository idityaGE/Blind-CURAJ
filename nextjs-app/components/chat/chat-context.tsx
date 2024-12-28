'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { Message, ChatContextType } from '@/types/chat';

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
    stopSearching: socketStopSearching,
    socket
  } = useSocket(token);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleMessage = (messageData: {
      content: string;
      senderId: string;
      sessionId: string;
      timestamp: string;
    }) => {
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        content: messageData.content,
        senderId: messageData.senderId,
        timestamp: new Date(messageData.timestamp),
        sessionId: messageData.sessionId
      }]);
    };

    const handlePartnerDisconnect = () => {
      // Don't clear messages when partner disconnects
    };

    socket.on('message', handleMessage);
    socket.on('partnerDisconnected', handlePartnerDisconnect);

    return () => {
      socket.off('message', handleMessage);
      socket.off('partnerDisconnected', handlePartnerDisconnect);
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
    // Clear messages when finding new chat or skipping
    setMessages([]);
    if (currentSessionId) {
      skipChat();
    } else {
      findChat();
    }
  };

  const handleStopSearching = () => {
    if (isWaiting) {
      setMessages([]); // Clear any pending messages
      socketStopSearching();
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
        isAuthenticated,
        stopSearching: handleStopSearching,
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