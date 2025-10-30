import mongoose from "mongoose";

export const ConnectDb = async (cb) => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL)
        console.log("data base connected " + connect.connection.host);
            cb();
    } catch (err) {
        console.log("connection falid")
        process.exit(1);
    }
}