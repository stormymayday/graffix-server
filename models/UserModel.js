import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username: String,
        email: String,
        password: String,
        name: String,
        bio: String,
        location: String,
        avatar: String,
        avatarPublicID: String,
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

// User w/o the password
UserSchema.methods.removePassword = function () {
    // Creating an object
    let obj = this.toObject();

    // Deleting password attribute
    delete obj.password;

    return obj;
};

export default mongoose.model("User", UserSchema);
