"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
class SocketManager {
    constructor(io) {
        this.waitingUsers = new Map();
        this.activeSessions = new Map();
        this.connectedUsers = new Map(); // userId -> socketId
        this.publicSockets = new Set(); // Track unauthenticated sockets
        this.io = io;
        this.setupSocketServer();
    }
    setupSocketServer() {
        // Handle all connections initially as public
        this.io.on('connection', (socket) => {
            this.handlePublicConnection(socket);
            console.log(`New connection: ${socket.id}`);
            // If authentication token is provided, upgrade to authenticated connection
            if (socket.handshake.auth.token) {
                this.upgradeToAuthenticatedConnection(socket);
            }
            // Listen for authentication events (for later authentication)
            socket.on('authenticate', (token) => {
                this.handleAuthentication(socket, token);
            });
        });
    }
    handlePublicConnection(socket) {
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
    handleAuthentication(socket, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = this.verifyToken(token);
                this.publicSockets.delete(socket.id); // Remove from public sockets
                this.setupAuthenticatedSocket(socket, userId);
            }
            catch (error) {
                socket.emit('authError', 'Authentication failed');
            }
        });
    }
    upgradeToAuthenticatedConnection(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = socket.handshake.auth.token;
                const userId = this.verifyToken(token);
                this.publicSockets.delete(socket.id);
                this.setupAuthenticatedSocket(socket, userId);
            }
            catch (error) {
                // Keep as public connection if authentication fails
                socket.emit('authError', 'Authentication failed');
            }
        });
    }
    setupAuthenticatedSocket(socket, userId) {
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
    broadcastStats() {
        const stats = this.getStats();
        this.io.emit('stats', stats);
    }
    sendStatsToSocket(socket) {
        const stats = this.getStats();
        socket.emit('stats', stats);
    }
    getStats() {
        return {
            totalConnections: this.publicSockets.size + this.connectedUsers.size,
            authenticatedUsers: this.connectedUsers.size,
            activeChats: this.activeSessions.size,
            waitingUsers: this.waitingUsers.size
        };
    }
    handleFindChat(socket) {
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
    handleSkipChat(socket) {
        this.leaveCurrentChat(socket);
        this.handleFindChat(socket);
    }
    createChatSession(socket1, user2) {
        const sessionId = `session_${Date.now()}`;
        const user1 = { userId: socket1.data.userId, socketId: socket1.id };
        const session = {
            sessionId,
            participants: [user1, user2]
        };
        this.activeSessions.set(sessionId, session);
        // Notify both users
        socket1.emit('chatStarted', { sessionId, partnerId: user2.userId });
        this.io.to(user2.socketId).emit('chatStarted', { sessionId, partnerId: user1.userId });
    }
    handleMessage(socket, message) {
        const session = this.activeSessions.get(message.sessionId);
        if (!session)
            return;
        const sender = session.participants.find(p => p.socketId === socket.id);
        if (!sender)
            return;
        const receiver = session.participants.find(p => p.socketId !== socket.id);
        if (!receiver)
            return;
        this.io.to(receiver.socketId).emit('message', {
            content: message.content,
            senderId: sender.userId,
            sessionId: message.sessionId,
            timestamp: new Date()
        });
    }
    leaveCurrentChat(socket) {
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
    handleDisconnect(socket) {
        const userId = socket.data.userId;
        this.connectedUsers.delete(userId);
        this.leaveCurrentChat(socket);
        this.broadcastStats();
    }
    stopSearching(socket) {
        const userId = socket.data.userId;
        this.waitingUsers.delete(socket.id);
        socket.emit('searchStopped');
        this.broadcastStats();
    }
    verifyToken(token) {
        try {
            const secret = process.env.JWT_SECRET || 'secret';
            const payload = (0, jsonwebtoken_1.verify)(token, secret);
            return payload.id;
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
}
exports.default = SocketManager;
