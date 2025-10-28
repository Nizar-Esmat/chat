import express from "express"
import dontenv from "dotenv"
import path from "path"



const app = express();
const __dirname = path.resolve();
dontenv.config()

const PORT = process.env.PORT || 3000;

import authRoutes from "./routes/auth.route.js"
app.use("api/auth", authRoutes)



if (process.env.NODE_ENV == "production") {
    app.use(express.static(path.join(__dirname, "../../frontEnd/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../../frontEnd/dist/index.html"))
    })
}
app.listen(PORT, () => {
    console.log(`server is runing on port ${PORT}`)
}) 