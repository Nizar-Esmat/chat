import express from "express"
import { ChatPartners, deleteMassage, editMassage, getAllContacts, getMassagesByUserId, sendMassage } from "../controllers/massage.controller.js"
import { is_auth } from "../middleware/auth.middleware.js"
import { verifyMessageOwnership } from "../middleware/massage.middleware.js"
import { arcjetProtection } from "../middleware/arcjet.middleware.js"
import { sendMassageValidator, editMassageValidator, paginationValidator } from "../validators/massage.validator.js"

const route = express.Router()

route.use(arcjetProtection, is_auth)

route.get("/AllContacts", paginationValidator, getAllContacts)
route.get("/chats", paginationValidator, ChatPartners)
route.get("/:id", paginationValidator, getMassagesByUserId)

route.post("/sendMassage/:reseiverId", sendMassageValidator, sendMassage)

route.get("/", (req, res) => {
    res.send("massage route is working")
})

route.patch("/editMassage/:id", verifyMessageOwnership, editMassageValidator, editMassage)
route.delete("/deleteMassage/:id", verifyMessageOwnership, deleteMassage)

export default route;