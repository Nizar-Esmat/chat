import mongoose from "mongoose";

const massageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },

    reseiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },

    text: {
        type: String
    },
    imageUrl: {
        type: String
    }

    ,
    isEdited: {
        type: Boolean,
        default: false
    },

    editedAt: {
        type: Date
    },

    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    }

}, { timestamps: true })


const Massage = mongoose.model("Massage", massageSchema);

export default Massage;