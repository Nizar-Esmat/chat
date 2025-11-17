import User from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const is_auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ msg: "unauthorized" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ msg: "unauthorized" })
        }
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ msg: "user Not found" })
        }
        req.user = user;
        next();
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "internal server error" })
    }
}