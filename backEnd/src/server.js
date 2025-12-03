import express from "express"
import dotenv from "dotenv"
import path from "path"
import { ConnectDb } from "../lib/db.js";
import cookieParser from "cookie-parser"
import cors from "cors"



const app = express();
const __dirname = path.resolve();
dotenv.config()

const PORT = 5000;

app.use(cors({
    origin: "http://localhost:5173",
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
    app.listen(PORT, () => {
        console.log("server is running on port " + PORT);
    })
})