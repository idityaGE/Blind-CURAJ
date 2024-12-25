"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const socketManager_1 = __importDefault(require("./services/socketManager"));
const server = http_1.default.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
    }
});
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
    },
});
new socketManager_1.default(io);
server.listen(process.env.PORT || 3000, () => console.log(`Server is running on port ${process.env.PORT || 3000}`));
