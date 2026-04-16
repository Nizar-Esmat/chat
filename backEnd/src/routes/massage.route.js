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
        .trim(),

    body("voiceUrl")
        .optional()
        .trim(),

    body("voiceDuration")
        .optional()
        .isNumeric()
        .withMessage("voiceDuration must be a number"),

    body().custom((value, { req }) => {
        const { text, imageUrl, voiceUrl } = req.body;
        if (!text && !imageUrl && !voiceUrl) {
            throw new Error("Either text, imageUrl, or voiceUrl must be provided");
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