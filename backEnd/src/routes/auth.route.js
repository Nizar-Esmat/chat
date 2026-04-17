import express from "express";
import { logOut, signIn, signUp, updateProfile } from "../controllers/auth.controller.js";
import { is_auth } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { signUpValidator, signInValidator, updateProfileValidator } from "../validators/auth.validator.js";

const route = express.Router()

route.use(arcjetProtection)

route.post("/signUp", signUpValidator, signUp)
route.post("/login", signInValidator, signIn)
route.post("/logout", logOut)
route.put("/updateProfile", is_auth, updateProfileValidator, updateProfile)

route.get("/is_auth", is_auth, (req, res) => {
    res.status(200).json({ user: req.user })
})

export default route;  