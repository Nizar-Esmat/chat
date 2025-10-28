import express from "express"
const app = express();
import dontenv from "dotenv"

dontenv.config()

const PORT = process.env.PORT || 3000;

import authRoutes from "./routes/auth.route.js"
app.use("api/auth" , authRoutes)

app.listen(PORT, () => {
    console.log(`server is runing on port ${PORT}`)
}) 