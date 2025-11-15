import express from "express"
import dotenv from "dotenv"
import path from "path"
import { ConnectDb } from "../lib/db.js";


const app = express();
const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, "../.env") });

const PORT = process.env.PORT || 3000;

app.use(express.json())


import authRoutes from "./routes/auth.route.js"
app.use("/api/auth", authRoutes)

if (process.env.NODE_ENV == "production") {
    app.use(express.static(path.join(__dirname, "../../frontEnd/dist")))

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