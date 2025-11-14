import jwt from "jsonwebtoken"

export const generateToken  = (id, res) => {
    const token  = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
}