import User from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { env } from "../config/env.js";
import { MESSAGES } from "../utils/messages.js";

export const is_auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ msg: MESSAGES.AUTH.UNAUTHORIZED })
        }
        const decoded = jwt.verify(token, env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ msg: MESSAGES.AUTH.UNAUTHORIZED })
        }
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ msg: MESSAGES.AUTH.USER_NOT_FOUND })
        }
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
}