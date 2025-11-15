
import { validationResult } from "express-validator";
import bycrypt from "bcryptjs"
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
export const signUp = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        }

        const hashedPassword = await bycrypt.hash(password, 12);

        const newUser = new User({
            fullName,
            email, 
            password: hashedPassword
        })

        if (newUser) {
            generateToken(newUser._id , res)
            await newUser.save()

            res.status(201).json({
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                msg: "user created"
            })

        } else {
            res.status(500).json({ errors: [{ msg: "something went wrong" }] })
        }
    } catch (err) {
        console.log("error in  signUp controller");
        res.status(500).json({msg : "internal server error" })
    }
}