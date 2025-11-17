import express from "express";
import { logOut, signIn, signUp } from "../controllers/auth.controller.js"
import { body } from "express-validator"
import User from "../models/user.model.js";
import { is_auth } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
const route = express.Router()

route.use(arcjetProtection)

route.post("/signUp" , [
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
            const user = await User.findOne({ email: value })
            if (user) {
                throw new Error("user already exist")
            }
        }),

    body('password')
        .isLength({ min: 6 }).withMessage("password must be more than 6")

], signUp)

route.post("/login", [
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
        .withMessage("password must be more than 3 and less than 30")



], signIn)


route.post("/logout", logOut)


route.put("/updateProfile" , is_auth, [
    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("name is requierd")
        .isLength({ min: 3, max: 30 })
        .withMessage("name should be more than 3 and less than 30"),

    body("profilePic")
        .trim()
        .notEmpty()
        .withMessage("profile pic is required"),
])


route.get("/is_auth"  , is_auth, (req, res) => {
    res.status(200).json({
        user: req.user
    })
})
export default route;  