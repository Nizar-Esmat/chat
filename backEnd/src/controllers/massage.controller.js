import { validationResult } from "express-validator";
import Massage from "../models/massage.model.js";
import User from "../models/user.model.js";
import cloudnary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { MESSAGES } from "../utils/messages.js";


const getAllContacts = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select(["-password"]);
        res.status(200).json(filteredUsers);
    } catch (error) {
        next(error);
    }
}
const ChatPartners = async (req, res, next) => {
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
        res.status(200).json({ msg: MESSAGES.MASSAGE.CHAT_PARTNERS_FETCHED, partners: filteredPartners });
    } catch (error) {
        next(error);
    }
}

const getMassagesByUserId = async (req, res, next) => {
    try {
        const logqgedInUserId = req.user.id;
        const userId = req.params.id;
        const massages = await Massage.find({
            $or: [
                { senderId: userId, reseiverId: logqgedInUserId },
                { reseiverId: userId, senderId: logqgedInUserId }
            ]
        })
        res.status(200).json({ msg: MESSAGES.MASSAGE.FETCHED, massages })
    } catch (error) {
        next(error);
    }
}

const sendMassage = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const reseiverId = req.params.reseiverId;
        const { text = "", imageUrl = "", voiceUrl = "", voiceDuration = 0 } = req.body;
        const senderId = req.user.id;

        let uploadImage = "";
        if (imageUrl) {
            const result = await cloudnary.uploader.upload(imageUrl);
            uploadImage = result.secure_url;
        }

        let uploadVoice = "";
        if (voiceUrl) {
            const result = await cloudnary.uploader.upload(voiceUrl, { 
                resource_type: "video",
                folder: "voice_messages"
            });
            uploadVoice = result.secure_url;
        }

        const newMassage = new Massage({
            senderId,
            reseiverId,
            text,
            imageUrl: uploadImage,
            voiceUrl: uploadVoice,
            voiceDuration
        });

        await newMassage.save()

        const receiverSocketId = getReceiverSocketId(reseiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMassage", { newMassage });
        }
        res.status(201).json({ msg: MESSAGES.MASSAGE.SENT, massage: newMassage });

    } catch (error) {
        next(error);
    }
}

const deleteMassage = async (req, res, next) => {
    try {
        const massageId = req.params.id;
        const massage = req.massage;

        const deleteMassage = await Massage.findByIdAndUpdate(
            massageId,
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        );

        const receiverSocketId = getReceiverSocketId(massage.reseiverId.toString());
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("deleteMassage", { massageId, massage: deleteMassage });
        }
        res.status(200).json({ msg: MESSAGES.MASSAGE.DELETED, massage: deleteMassage });
    } catch (error) {
        next(error);
    }
}

const editMassage = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const massageId = req.params.id;
        const { text = "", imageUrl = "" } = req.body;
        const massage = req.massage;

        // Voice messages cannot be edited
        if (massage.voiceUrl) {
            return res.status(400).json({ msg: MESSAGES.MASSAGE.CANNOT_EDIT_VOICE });
        }

        let uploadImage = massage.imageUrl;
        if (imageUrl) {
            if (massage.imageUrl) {
                const publicId = massage.imageUrl.split('/').pop().split('.')[0];
                await cloudnary.uploader.destroy(publicId);
            }
            const uploadResult = await cloudnary.uploader.upload(imageUrl);
            uploadImage = uploadResult.secure_url;
        }

        const updatedMassage = await Massage.findByIdAndUpdate(
            massageId,
            {
                text: text || massage.text,
                imageUrl: uploadImage,
                isEdited: true,
                editedAt: new Date()
            },
            { new: true }
        );

        const receiverSocketId = getReceiverSocketId(massage.reseiverId.toString());
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("editMassage", { updatedMassage });
        }

        res.status(200).json({ msg: MESSAGES.MASSAGE.UPDATED, massage: updatedMassage });
    } catch (error) {
        next(error);
    }
}

export { getAllContacts, ChatPartners, getMassagesByUserId, sendMassage, deleteMassage, editMassage };