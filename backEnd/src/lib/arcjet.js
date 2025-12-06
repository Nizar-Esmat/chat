import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";
import { env } from "../config/env.js";

const aj = arcjet({
    key: env.ARCJET_KEY,
    rules: [
        shield({ mode: "DRY_RUN" }),
        detectBot({
            mode: "DRY_RUN",
            allow: [
                "CATEGORY:SEARCH_ENGINE"
            ],
        }),
        slidingWindow({
            mode: "DRY_RUN",
            max: 10,
            interval: 60
        }),

    ],
});

export default aj

