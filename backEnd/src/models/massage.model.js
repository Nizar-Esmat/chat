import mongoose from "mongoose";

const massageSchema = new mongoose.Schema({
    senderId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },

    reseiverId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },

    text :{
        type : String
    } , 
    imageUrl : { 
        type : String
    }

} , {timestamps : true})


const Massage = mongoose.model("Massage" , massageSchema);

export default Massage;