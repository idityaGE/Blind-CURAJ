import { Server, Socket } from 'socket.io';
import { JwtPayload, verify } from 'jsonwebtoken';

interface User {
  userId: string;
  socketId: string;
}

interface ChatSession {
  sessionId: string;
  participants: User[];
}

class SocketManager {
  private io: Server;
  private waitingUsers: Map<string, User> = new Map();
  private activeSessions: Map<string, ChatSession> = new Map();
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId
  private publicSockets: Set<string> = new Set(); // Track unauthenticated sockets

  constructor(io: Server) {
    this.io = io;
    this.setupSocketServer();
  }

  private setupSocketServer() {
    // Handle all connections initially as public
    this.io.on('connection', (socket: Socket) => {
      this.handlePublicConnection(socket);

      // If authentication token is provided, upgrade to authenticated connection
      if (socket.handshake.auth.token) {
        this.upgradeToAuthenticatedConnection(socket);
      }

      // Listen for authentication events (for later authentication)
      socket.on('authenticate', (token: string) => {
        this.handleAuthentication(socket, token);
      });
    });
  }

  private handlePublicConnection(socket: Socket) {
    this.publicSockets.add(socket.id);
    this.broadcastStats(); // Send initial stats

    socket.on('requestStats', () => {
      this.sendStatsToSocket(socket);
    });

    socket.on('disconnect', () => {
      this.publicSockets.delete(socket.id);
      this.broadcastStats();
    });
  }

  private async handleAuthentication(socket: Socket, token: string) {
    try {
      const userId = this.verifyToken(token);
      this.publicSockets.delete(socket.id); // Remove from public sockets
      this.setupAuthenticatedSocket(socket, userId);
    } catch (error) {
      socket.emit('authError', 'Authentication failed');
    }
  }

  private async upgradeToAuthenticatedConnection(socket: Socket) {
    try {
      const token = socket.handshake.auth.token;
      const userId = this.verifyToken(token);
      this.publicSockets.delete(socket.id);
      this.setupAuthenticatedSocket(socket, userId);
    } catch (error) {
      // Keep as public connection if authentication fails
      socket.emit('authError', 'Authentication failed');
    }
  }

  private setupAuthenticatedSocket(socket: Socket, userId: string) {
    socket.data.userId = userId;
    this.connectedUsers.set(userId, socket.id);

    // Set up authenticated event listeners
    socket.on('findChat', () => this.handleFindChat(socket));
    socket.on('skipChat', () => this.handleSkipChat(socket));
    socket.on('sendMessage', (message) => this.handleMessage(socket, message));
    socket.on('stopSearching', () => this.stopSearching(socket));

    socket.on('disconnect', () => {
      this.handleDisconnect(socket);
    });

    this.broadcastStats();
    socket.emit('authenticated', { userId });
  }

  private broadcastStats() {
    const stats = this.getStats();
    this.io.emit('stats', stats);
  }

  private sendStatsToSocket(socket: Socket) {
    const stats = this.getStats();
    socket.emit('stats', stats);
  }

  private getStats() {
    return {
      totalConnections: this.publicSockets.size + this.connectedUsers.size,
      authenticatedUsers: this.connectedUsers.size,
      activeChats: this.activeSessions.size,
      waitingUsers: this.waitingUsers.size
    };
  }

  private handleFindChat(socket: Socket) {
    const userId = socket.data.userId;

    // If user is already in a chat, disconnect from it first
    this.leaveCurrentChat(socket);

    // Add to waiting list if no other users are waiting
    if (this.waitingUsers.size === 0) {
      this.waitingUsers.set(socket.id, { userId, socketId: socket.id });
      socket.emit('waiting');
      this.broadcastStats();
      return;
    }

    // Find a random waiting user
    const waitingUsers = Array.from(this.waitingUsers.values());
    const randomUser = waitingUsers[Math.floor(Math.random() * waitingUsers.length)];

    // Create new chat session
    if (randomUser.userId !== userId) {
      this.createChatSession(socket, randomUser);
      this.waitingUsers.delete(randomUser.socketId);
      this.broadcastStats();
    }
  }

  private handleSkipChat(socket: Socket) {
    this.leaveCurrentChat(socket);
    this.handleFindChat(socket);
  }

  private createChatSession(socket1: Socket, user2: User) {
    const sessionId = `session_${Date.now()}`;
    const user1 = { userId: socket1.data.userId, socketId: socket1.id };

    const session: ChatSession = {
      sessionId,
      participants: [user1, user2]
    };

    this.activeSessions.set(sessionId, session);

    // Notify both users
    socket1.emit('chatStarted', { sessionId, partnerId: user2.userId });
    this.io.to(user2.socketId).emit('chatStarted', { sessionId, partnerId: user1.userId });
  }

  private handleMessage(socket: Socket, message: { sessionId: string; content: string }) {
    const session = this.activeSessions.get(message.sessionId);
    if (!session) return;

    const sender = session.participants.find(p => p.socketId === socket.id);
    if (!sender) return;

    const receiver = session.participants.find(p => p.socketId !== socket.id);
    if (!receiver) return;

    this.io.to(receiver.socketId).emit('message', {
      content: message.content,
      senderId: sender.userId,
      sessionId: message.sessionId,
      timestamp: new Date()
    });
  }

  private leaveCurrentChat(socket: Socket) {
    const userId = socket.data.userId;

    // Remove from waiting list if present
    this.waitingUsers.delete(socket.id);

    // Find and end any active session
    for (const [sessionId, session] of this.activeSessions) {
      if (session.participants.some(p => p.userId === userId)) {
        const otherParticipant = session.participants.find(p => p.userId !== userId);

        if (otherParticipant) {
          this.io.to(otherParticipant.socketId).emit('chatEnded', {
            reason: 'Partner left the chat'
          });
        }

        this.activeSessions.delete(sessionId);
        break;
      }
    }

    this.broadcastStats();
  }

  private handleDisconnect(socket: Socket) {
    const userId = socket.data.userId;
    this.connectedUsers.delete(userId);
    this.leaveCurrentChat(socket);
    this.broadcastStats();
  }

  private stopSearching(socket: Socket) {
    const userId = socket.data.userId;

    this.waitingUsers.delete(socket.id);

    socket.emit('searchStopped');

    this.broadcastStats();
  }

  private verifyToken(token: string): string {
    try {
      const secret = process.env.JWT_SECRET || 'secret';
      const payload = verify(token, secret);
      return (payload as JwtPayload).id as string;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

export default SocketManager;