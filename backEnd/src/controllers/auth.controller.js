import { validationResult } from "express-validator";
import bycrypt from "bcryptjs"
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../email/emailHandlers.js";
import cloudnary from "../lib/cloudinary.js";

export const signUp = async (req, res) => {
    const { fullName, email, password, passwordConfirmation, profilePic } = req.body;
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        }
        if (password !== passwordConfirmation) {
            return res.status(400).json({ errors: [{ msg: "passwords don't match" }] })
        }

        const hashedPassword = await bycrypt.hash(password, 12);

        let uploadedImage;
        if (profilePic) {
            uploadedImage = await cloudnary.uploader.upload(profilePic);
        }

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            profilePic: uploadedImage?.secure_url
        })

        await newUser.save()

        try {
            if (process.env.NODE_ENV !== 'production' && newUser.email === 'nizaresmat2000@gmail.com') {
                await sendWelcomeEmail(newUser.email, newUser.fullName, process.env.CLIENT_URL);

            }
        } catch (emailErr) {
            console.log("Error sending welcome email:", emailErr);
        }

        generateToken(newUser._id, res)
        res.status(201).json({
            id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
            msg: "user created successfully"
        })

    } catch (err) {
        console.log("error in signUp controller:", err);
        res.status(500).json({ msg: "internal server error", error: err.message })
    }
}

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ errors: [{ msg: "invalid credentials" }] })
        }
        const isMatch = await bycrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: "invalid credentials" }] })
        }
        generateToken(user._id, res)
        res.status(200).json({
            msg: "user signed in",
            user: user
        })
    } catch (err) {
        console.log("error in  signIn controller", err);
        res.status(500).json({ msg: "internal server error" })
    }
}

export const logOut = (_, res) => {
    res.cookie("jwt", "", {
        maxAge: 0
    });
    res.status(200).json({ msg: "user logged out" })
}
export const updateProfile = async (req, res) => {
    try {
        let { fullName, profilePic } = req.body;
        const userId = req.user.id;
        const user = await User.findById(req.user.id);
        if(fullName === ""){
            fullName = user.fullName
        }
        if (profilePic === "") {
            profilePic = user.profilePic
        }
        if (!user) {
            return res.status(400).json({ errors: [{ msg: "user not found" }] })
        }
        if (profilePic) {
            await cloudnary.uploader.destroy(user.profilePic);
        }
        const updateProfilePic = await cloudnary.uploader.upload(profilePic);
        user.fullName = fullName;
        user.profilePic = updateProfilePic.secure_url;
        await user.save();
        res.status(200).json({
            msg: "user profile updated",
            user: user
        })
    } catch (err) {
        res.status(500).json({ msg: "internal server error" });
        console.log("error in  updateProfile controller", err)
    }
}