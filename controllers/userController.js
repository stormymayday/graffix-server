import { StatusCodes } from "http-status-codes";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import cloudinary from "cloudinary";
// import { promises as fs } from "fs";
import { formatImage } from "../middleware/multerMiddleware.js";

import User from "../models/UserModel.js";

export const getCurrentUser = async (req, res) => {
    // Getting the user
    const user = await User.findOne({ _id: req.user.userId });

    // Removing password
    const userWithoutPassword = user.removePassword();

    // Sending back user without password
    res.status(StatusCodes.OK).json({ userWithoutPassword });
};

export const updateUser = async (req, res) => {
    // grabbing the user
    const newUser = { ...req.body };
    // deleting the password
    delete newUser.password;

    // Checking if user sending an image
    if (req.file) {
        const file = formatImage(req.file);

        // Uploading to Cloudinary
        // const response = await cloudinary.v2.uploader.upload(req.file.path);

        // Passing (formatted) file directly to Cloudinary
        const response = await cloudinary.v2.uploader.upload(file);

        // Removing image from local filesystem (public/uploads)
        // No longer needed (disk storage)
        // await fs.unlink(req.file.path);

        // Grabbing the url and public ID from Cloudinary response
        newUser.avatar = response.secure_url;
        newUser.avatarPublicID = response.public_id;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser);

    // Checking if user sending an image && if there is an existing image on Cloudinary
    if (req.file && updatedUser.avatarPublicID) {
        // Deleting old image on Cloudinary
        await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicID);
    }

    res.status(StatusCodes.OK).json({ msg: "user updated" });
};
