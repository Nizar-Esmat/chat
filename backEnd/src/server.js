import express from "express"
import path from "path"
import { fileURLToPath } from 'url';
import { ConnectDb } from "../lib/db.js";
import cookieParser from "cookie-parser"
import cors from "cors"
import { app, httpServer } from "./lib/socket.js";
import { env } from "./config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true
}))
app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

import authRoutes from "./routes/auth.route.js"
app.use("/api/auth", authRoutes)
import massagesRoute from "./routes/massage.route.js"
app.use("/api/massage", massagesRoute)

// Serve frontend in production
if (env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "../../../frontEnd/dist");
    
    // Serve static files
    app.use(express.static(frontendPath));
    
    // SPA fallback - serve index.html for all non-API routes
    app.get(/^(?!\/api).*/, (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}

ConnectDb(()=>{
    httpServer.listen(env.PORT, () => {
        console.log("server is running on port " + env.PORT);
    })
})