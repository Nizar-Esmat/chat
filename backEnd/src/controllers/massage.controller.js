import { validationResult } from "express-validator";
import Massage from "../models/massage.model.js";
import User from "../models/user.model.js";
import cloudnary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";


const getAllContacts = async (req, res) => {
    try {
        const userId = req.user.id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select(["-password"]);
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log(error);
    }
}
const ChatPartners = async (req, res) => {
    try {
        const userId = req.user?.id;
        console.log("Logged in user ID:", userId);
        const massages = await Massage.find({
            $or: [
                { senderId: userId },
                { reseiverId: userId }
            ]
        });
        const partnerChat = [...new Set(massages.map(massage => {
            return massage.senderId.toString() == userId.toString() ? massage.reseiverId.toString() : massage.senderId.toString();
    }))]

    const filteredPartners = await User.find({ _id: { $in: partnerChat } }).select(["-password"]);
    res.status(200).json({ msg: "chat partners fetched successfully", partners: filteredPartners });
} catch (error) {
    console.log(error);
}
}

const getMassagesByUserId = async (req, res) => {
    try {
        const logqgedInUserId = req.user.id;
        const userId = req.params.id;
        const massages = await Massage.find({
            $or: [
                { senderId: userId, reseiverId: logqgedInUserId },
                { reseiverId: userId, senderId: logqgedInUserId }
            ]
        })
        res.status(200).json({ msg: "massages fetched successfully", massages })
    } catch (error) {
        console.log(error);
    }
}

const sendMassage = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const reseiverId = req.params.reseiverId;
        const { text = "", imageUrl = "" } = req.body;
        const senderId = req.user.id;

        let uploadImage = "";
        if (imageUrl) {
            uploadImage = await cloudnary.uploader.upload(imageUrl);
        }

        const newMassage = new Massage({
            senderId,
            reseiverId,
            text,
            imageUrl: uploadImage.secure_url
        });

        await newMassage.save()

        const receiverSocketId = getReceiverSocketId(reseiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMassage", { newMassage });
        }
        res.status(201).json({ msg: "massage sent successfully", massage: newMassage });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal server error" });
    }
}

export { getAllContacts, ChatPartners, getMassagesByUserId, sendMassage };