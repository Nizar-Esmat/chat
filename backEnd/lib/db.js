import mongoose from "mongoose";
import { env } from "../src/config/env.js";

export const ConnectDb = async (callback) => {
    try {
        const connect = await mongoose.connect(env.MONGO_URL)
        console.log("data base connected " + connect.connection.host);
        callback();
    } catch (err) {
        console.log("connection failed:", err.message)
        process.exit(1);
    }
}