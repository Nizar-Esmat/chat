import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const socketAuthMiddleware = async (socket, next) => {
    try {
        // Socket.IO passes cookies in socket.handshake
        const cookies = socket.handshake.headers.cookie;

        if (!cookies) {
            return next(new Error("No cookies found"));
        }

        const token = cookies.split("; ")
            .find(row => row.startsWith("jwt="))
            ?.split("=")[1];

        if (!token) {
            return next(new Error("No token found"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return next(new Error("User not found"));
        }

        socket.user = user;
        socket.userId = user._id.toString();
        next();
    } catch (error) {
        console.log("Socket authentication error:", error);
        next(new Error("Authentication failed"));
    }
};