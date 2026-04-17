import Massage from "../models/massage.model.js";
import { MESSAGES } from "../utils/messages.js";

const verifyMessageOwnership = async (req, res, next) => {
    try {
        const massageId = req.params.id;
        const userId = req.user.id;

        const massage = await Massage.findById(massageId);
        
        if (massage.isDeleted) {
            return res.status(404).json({ msg: MESSAGES.MASSAGE.NOT_FOUND });
        }

        if (massage.senderId.toString() !== userId.toString()) {
            return res.status(403).json({ msg: MESSAGES.MASSAGE.UNAUTHORIZED_MODIFY });
        }

        req.massage = massage;
        next();
    } catch (error) {
        next(error);
    }
};

export { verifyMessageOwnership };
