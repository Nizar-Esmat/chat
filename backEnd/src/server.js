import express from "express"
import path from "path"
import { ConnectDb } from "../lib/db.js";
import cookieParser from "cookie-parser"
import cors from "cors"
import { app, httpServer } from "./lib/socket.js";
import { env } from "./config/env.js";

const __dirname = path.resolve();

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

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../../frontEnd/dist")))

// SPA fallback for non-API routes in production
if (process.env.NODE_ENV !== "production") {
    app.use((req, res, next) => {
        if (req.method === "GET" && !req.path.startsWith("/api/")) {
            return res.sendFile(path.join(__dirname, "../../frontEnd/dist/index.html"))
        }
        next()
    })
}

ConnectDb(()=>{
    httpServer.listen(env.PORT, () => {
        console.log("server is running on port " + env.PORT);
    })
})