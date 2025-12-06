import jwt from "jsonwebtoken"
import { env } from "../config/env.js";

export const generateToken = (id, res) => {
    const token = jwt.sign({ id }, env.JWT_SECRET, { expiresIn: "1d" })
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV == "production"
    });
    return token;
}