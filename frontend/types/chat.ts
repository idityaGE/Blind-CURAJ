
export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  sessionId?: string;
}

export interface ChatContextType {
  messages: Message[];
  sendMessage: (content: string) => void;
  currentPartner: string | null;
  findNewPartner: () => void;
  stopSearching: () => void;
  isWaiting: boolean;
  isConnected: boolean;
  isAuthenticated: boolean;
}