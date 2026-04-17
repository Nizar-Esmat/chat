import { validationResult } from "express-validator";
import bycrypt from "bcryptjs"
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../email/emailHandlers.js";
import cloudnary from "../lib/cloudinary.js";
import { MESSAGES } from "../utils/messages.js";

export const signUp = async (req, res, next) => {
    const { fullName, email, password, passwordConfirmation, profilePic } = req.body;
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        }
        if (password !== passwordConfirmation) {
            return res.status(400).json({ errors: [{ msg: MESSAGES.AUTH.PASSWORDS_DONT_MATCH }] })
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
            msg: MESSAGES.AUTH.USER_CREATED
        })

    } catch (err) {
        console.log("error in signUp controller:", err);
        next(err);
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ errors: [{ msg: MESSAGES.AUTH.INVALID_CREDENTIALS }] })
        }
        const isMatch = await bycrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: MESSAGES.AUTH.INVALID_CREDENTIALS }] })
        }
        generateToken(user._id, res)
        res.status(200).json({
            msg: MESSAGES.AUTH.USER_SIGNED_IN,
            user: user
        })
    } catch (err) {
        console.log("error in  signIn controller", err);
        next(err);
    }
}

export const logOut = (_, res) => {
    res.cookie("jwt", "", {
        maxAge: 0
    });
    res.status(200).json({ msg: MESSAGES.AUTH.USER_LOGGED_OUT })
}
export const updateProfile = async (req, res, next) => {
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
            return res.status(400).json({ errors: [{ msg: MESSAGES.AUTH.USER_NOT_FOUND }] })
        }
        if (profilePic) {
            await cloudnary.uploader.destroy(user.profilePic);
        }
        const updateProfilePic = await cloudnary.uploader.upload(profilePic);
        user.fullName = fullName;
        user.profilePic = updateProfilePic.secure_url;
        await user.save();
        res.status(200).json({
            msg: MESSAGES.AUTH.PROFILE_UPDATED,
            user: user
        })
    } catch (err) {
        console.log("error in  updateProfile controller", err);
        next(err);
    }
}