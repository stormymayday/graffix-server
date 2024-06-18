import mongoose from "mongoose";

import { ART_CATEGORIES } from "../utils/constants.js";

const TreasureSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        message: { type: String, required: true },
        category: {
            type: String,
            enum: Object.values(ART_CATEGORIES),
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
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
