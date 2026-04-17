import { body, query } from "express-validator";

export const sendMassageValidator = [
    body("text")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("text message should not exceed 1000 characters"),

    body("imageUrl")
        .optional()
        .trim(),

    body().custom((_, { req }) => {
        const { text, imageUrl, voiceUrl } = req.body;
        if (!text && !imageUrl && !voiceUrl) {
            throw new Error("either text, imageUrl or voiceUrl must be provided");
        }
        return true;
    }),
];

export const editMassageValidator = [
    body("text")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("text message should not exceed 1000 characters"),
];

export const paginationValidator = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("page must be a positive integer")
        .toInt(),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("limit must be between 1 and 100")
        .toInt(),
];
