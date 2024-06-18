import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username: String,
        email: String,
        password: String,
        name: String,
        bio: String,
        location: {
            type: {
                type: String,
                enum: ["Point"],
            },
            coordinates: {
                type: [Number],
            },
        },
        avatar: String,
        avatarPublicID: String,
        role: {
            type: String,
            enum: ["artlover", "artist", "admin"],
            default: "artlover",
        },
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

// Creating a geospatial index on the location field
UserSchema.index({ location: "2dsphere" });

export default mongoose.model("User", UserSchema);
