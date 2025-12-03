import { Server } from "socket.io"
import http from "http"
import express from "express"
import dotnv from "dotenv"
import { socketAuthMiddleware } from "../middleware/sokcet.middleware.js"

dotnv.config()


const app = express()
const httpServer = http.createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
})


io.use(socketAuthMiddleware)

const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("New client connected:", socket.user.fullName);

    const userId = socket.userId;
    userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.user.fullName);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});


export { io, app, httpServer }