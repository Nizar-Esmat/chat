import express from "express"
import { ChatPartners, deleteMassage, editMassage, getAllContacts, getMassagesByUserId, sendMassage } from "../controllers/massage.controller.js"
import { is_auth } from "../middleware/auth.middleware.js"
import { verifyMessageOwnership } from "../middleware/massage.middleware.js"
import { body } from "express-validator"
import { arcjetProtection } from "../middleware/arcjet.middleware.js"
const route = express.Router()

route.use(arcjetProtection , is_auth)
route.get("/AllContacts", getAllContacts)
route.get("/chats", ChatPartners)
route.get("/:id", getMassagesByUserId)

route.post("/sendMassage/:reseiverId", [

    body("text")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Text message should not exceed 1000 characters"),

    body("imageUrl")
        .optional()
        .trim()
        .isURL()
        .withMessage("Image URL should  be valid URL"),


    body().custom((value, { req }) => {
        const { text, imageUrl } = req.body;
        if (!text && !imageUrl) {
            throw new Error("Either text or imageUrl must be provided");
        }
        return true;
    })

], sendMassage)


route.get("/", (req, res) => {
    res.send("massage route is working")
})


route.patch("/editMassage/:id", 
    verifyMessageOwnership,
    [
        body("text")
            .optional()
            .trim()
            .isLength({ max: 1000 })
            .withMessage("Text message should not exceed 1000 characters"),
    ], 
    editMassage
)

route.delete("/deleteMassage/:id", verifyMessageOwnership, deleteMassage)

export default route;