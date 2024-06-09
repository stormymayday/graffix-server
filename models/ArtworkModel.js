import mongoose from "mongoose";

import { ART_CATEGORIES } from "../utils/constants.js";

const ArtworkSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        category: {
            type: String,
            enum: Object.values(ART_CATEGORIES),
        },
        imageUrl: String,
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        likes: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Artwork", ArtworkSchema);
