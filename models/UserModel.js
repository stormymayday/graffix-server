import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username: String,
        email: String,
        password: String,
        name: String,
        bio: String,
        location: String,
        profilePictureUrl: String,
        role: {
            type: String,
            enum: ["artlover", "artist", "admin"],
            default: "artlover",
        },
        // followers: [ObjectId] (references to Users)
        // following: [ObjectId] (references to Users)
    },
    { timestamps: true }
);

export default mongoose.model("User", UserSchema);
