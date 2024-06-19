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
        qrCodePublicID: String,
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

// Creating a geospatial index on the location field
TreasureSchema.index({ location: "2dsphere" });

export default mongoose.model("Treasure", TreasureSchema);
