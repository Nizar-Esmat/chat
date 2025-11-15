
import { validationResult } from "express-validator";
import bycrypt from "bcryptjs"
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js"; import { Resend } from 'resend';
import { sendWelcomeEmail } from "../email/emailHandlers.js";
import dotenv from "dotenv"
dotenv.config()
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
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                msg: "user created"
            })


            try{
                console.log(newUser.email);
                await sendWelcomeEmail(newUser.email, newUser.fullName, process.env.CLIENT_URL);
            }catch(err){
                console.log(err);
            }

        } else {
            res.status(500).json({ errors: [{ msg: "something went wrong" }] })
        }
    } catch (err) {
        console.log("error in  signUp controller");
        res.status(500).json({ msg: "internal server error" })
    }
}