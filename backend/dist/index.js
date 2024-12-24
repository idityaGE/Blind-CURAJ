"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const socketManager_1 = __importDefault(require("./services/socketManager"));
const server = http_1.default.createServer();
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        credentials: true
    }
});
new socketManager_1.default(io);
server.listen(4000, () => {
    console.log('WebSocket server running on port 4000');
});
