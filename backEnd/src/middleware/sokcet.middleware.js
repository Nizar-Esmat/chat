import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();


export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token
            .split("; ")
            .find((raw) => {
                raw.startsWith("jwt=")
            })
            .split("=")[1];


        if (!token) {
            console.log("No token provided in socket handshake");
            return next(new Error("Authentication error: No token provided"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            console.log("Invalid token");
            return next(new Error("Authentication error: Invalid token"));
        }

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            console.log("User not found");
            return next(new Error("Authentication error: User not found"));
        }

        socket.user = user;
        socket.userId = user._id.toString();

        console.log("Socket authenticated:", socket.userId);
        next();

    } catch (error) {
        console.error("Socket authentication error:", error);
    }
}