import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";
import dotenv from "dotenv";
dotenv.config()

const aj = arcjet({

    key: process.env.ARCJET_KEY,
    rules: [
        shield({ mode: "LIVE" }),
        detectBot({
            mode: "DRY_RUN",
            allow: [
                "CATEGORY:SEARCH_ENGINE"
            ],
        }),
        slidingWindow({
            mode: "LIVE",
            max: 10,
            interval: 60
        }),

    ],
});

export default aj

