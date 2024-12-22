import { useEffect, useCallback, useState } from 'react';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';

interface ChatStartedEvent {
  sessionId: string;
  partnerId: string;
}

interface Stats {
  totalConnections: number;
  authenticatedUsers: number;
  activeChats: number;
  waitingUsers: number;
}

export const useSocket = (token?: string) => {
  const [socket, setSocket] = useState<typeof Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    const socketIo = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000', {
      auth: token ? { token } : undefined
    });

    socketIo.on('connect', () => {
      setIsConnected(true);
      setSocket(socketIo);
    });

    socketIo.on('disconnect', () => {
      setIsConnected(false);
      setIsAuthenticated(false);
      setCurrentSessionId(null);
      setPartnerId(null);
      setIsWaiting(false);
    });

    socketIo.on('authenticated', () => {
      setIsAuthenticated(true);
    });

    socketIo.on('authError', (error: any) => {
      console.error('Authentication error:', error);
      setIsAuthenticated(false);
    });

    socketIo.on('stats', (newStats: Stats) => {
      setStats(newStats);
    });

    socketIo.on('waiting', () => {
      setIsWaiting(true);
      setCurrentSessionId(null);
      setPartnerId(null);
    });

    socketIo.on('chatStarted', (event: ChatStartedEvent) => {
      setIsWaiting(false);
      setCurrentSessionId(event.sessionId);
      setPartnerId(event.partnerId);
    });

    socketIo.on('chatEnded', () => {
      setCurrentSessionId(null);
      setPartnerId(null);
      setIsWaiting(false);
    });

    socketIo.on('searchStopped', () => {
      setIsWaiting(false);
    });


    // Cleanup on unmount
    return () => {
      socketIo.off('searchStopped');
      socketIo.disconnect();
    };
  }, [token]);

  // Authentication method
  const authenticate = useCallback((newToken: string) => {
    if (socket) {
      socket.emit('authenticate', newToken);
    }
  }, [socket]);

  // Chat methods
  const findChat = useCallback(() => {
    if (socket && isAuthenticated) {
      socket.emit('findChat');
    }
  }, [socket, isAuthenticated]);

  const skipChat = useCallback(() => {
    if (socket && isAuthenticated) {
      socket.emit('skipChat');
    }
  }, [socket, isAuthenticated]);

  const stopSearching = useCallback(() => {
    if (socket && isAuthenticated) {
      socket.emit('stopSearching');
      setIsWaiting(false);
    }
  }, [socket, isAuthenticated]);

  const sendMessage = useCallback((content: string) => {
    if (socket && isAuthenticated && currentSessionId) {
      socket.emit('sendMessage', {
        sessionId: currentSessionId,
        content
      });
    }
  }, [socket, isAuthenticated, currentSessionId]);

  const requestStats = useCallback(() => {
    if (socket) {
      socket.emit('requestStats');
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    isAuthenticated,
    isWaiting,
    currentSessionId,
    partnerId,
    stats,
    authenticate,
    findChat,
    skipChat,
    sendMessage,
    requestStats,
    stopSearching
  };
};