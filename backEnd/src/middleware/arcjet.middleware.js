import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);
        
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ msg: "too many requests try again later" })
            }
            else if (decision.reason.isBot()) {
                return res.status(403).json({ msg: "bot access denied" })
            } else {
                return res.status(403).json({ msg: "access denied by securty policy" })
            }
        }
        if (decision.results.some(isSpoofedBot)) {
            return res.status(403).json({
                error: "spoofed bot detected",
                message: "access denied by securty policy"
            })
        }
        next();
    } catch (error) {
        console.log("arcjet middleware error", error);
        next(error)
    }
}