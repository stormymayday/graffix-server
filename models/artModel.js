import mongoose from "mongoose";

const ArtSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            enum: [
                "abstract",
                "oil",
                "impressionism",
                "surrealism",
                "pop art",
                "cubism",
                "expressionism",
            ],
        },
        title: String,
        description: String,
        likes: Number,
    },
    { timestamps: true }
);

export default mongoose.model("Art", ArtSchema);
