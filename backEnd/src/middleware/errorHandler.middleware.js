import { MESSAGES } from "../utils/messages.js";

export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
    }
}

export const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err.isOperational) {
        return res.status(err.statusCode).json({ msg: err.message });
    }

    res.status(500).json({ msg: MESSAGES.GENERAL.INTERNAL_SERVER_ERROR });
};
