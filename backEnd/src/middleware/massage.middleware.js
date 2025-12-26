import Massage from "../models/massage.model.js";

const verifyMessageOwnership = async (req, res, next) => {
    try {
        const massageId = req.params.id;
        const userId = req.user.id;

        const massage = await Massage.findById(massageId);
        
        if (massage.isDeleted) {
            return res.status(404).json({ msg: "Message not found" });
        }

        if (massage.senderId.toString() !== userId.toString()) {
            return res.status(403).json({ msg: "You can only modify your own messages" });
        }

        req.massage = massage;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

export { verifyMessageOwnership };
