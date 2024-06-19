import mongoose from "mongoose";

import { ART_CATEGORIES } from "../utils/constants.js";

const TreasureSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        message: String,
        category: {
            type: String,
            enum: Object.values(ART_CATEGORIES),
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
            },
            coordinates: {
                type: [Number],
            },
        },
        treasureUrl: String,
        treasurePublicID: String,
        qrCodeUrl: String,
        qrCodeUrlPublicID: String,
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Treasure", TreasureSchema);
