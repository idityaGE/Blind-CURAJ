import { Server } from 'socket.io';
import http from 'http';
import SocketManager from './services/socketManager';

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true
  }
});

new SocketManager(io);

server.listen(4000, () => {
  console.log('WebSocket server running on port 4000');
});