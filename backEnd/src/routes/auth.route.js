import express from "express";
import { signUp } from "../controllers/auth.controller.js"
import { body } from "express-validator"
import User from "../models/user.model.js";
const route = express.Router()


route.post("/signUp", [
    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("name is requierd")
        .isLength({ min: 3, max: 30 })
        .withMessage("name should be more than 3 and less than 30"),

    body('email')
        .isEmail()
        .withMessage("the email must be valid")
        .custom(async (value, { req }) => {
            const user = await User.findOne({ email:value })
            if (user) {
                throw new Error("user already exist")
            }
        }),

    body('password')
        .isLength({ min: 6 }).withMessage("password must be more than 6"),

    body("passwordConfirmation").custom((value, { req }) => {
        return value === req.body.password
    })

], signUp)
export default route;