import mongoose from "mongoose";

import { ART_CATEGORIES } from "../utils/constants.js";

const ArtSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            enum: Object.values(ART_CATEGORIES),
        },
        title: String,
        description: String,
        likes: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Art", ArtSchema);
