import { Server } from 'socket.io';
import http from 'http';
import SocketManager from './services/socketManager';

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
  }
});

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

new SocketManager(io);

server.listen(
  process.env.PORT || 3000,
  () => console.log(`Server is running on port ${process.env.PORT || 3000}`)
);