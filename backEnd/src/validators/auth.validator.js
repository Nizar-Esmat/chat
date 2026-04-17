import { body } from "express-validator";
import User from "../models/user.model.js";

export const signUpValidator = [
    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("name is required")
        .isLength({ min: 3, max: 30 })
        .withMessage("name should be more than 3 and less than 30"),

    body("email")
        .isEmail()
        .withMessage("the email must be valid")
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) throw new Error("user already exists");
        }),

    body("password")
        .isLength({ min: 6 })
        .withMessage("password must be at least 6 characters"),
];

export const signInValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("the email must be valid"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("password is required")
        .isLength({ min: 3, max: 30 })
        .withMessage("password must be between 3 and 30 characters"),
];

export const updateProfileValidator = [
    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("name is required")
        .isLength({ min: 3, max: 30 })
        .withMessage("name should be more than 3 and less than 30"),

    body("profilePic")
        .trim()
        .notEmpty()
        .withMessage("profile pic is required"),
];
