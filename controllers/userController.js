import { StatusCodes } from "http-status-codes";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import cloudinary from "cloudinary";
import { formatImage } from "../middleware/multerMiddleware.js";

import User from "../models/UserModel.js";

export const getAllUsers = async (req, res) => {
    // try {
    //     // const users = await UserModel.find({}).select("-password");
    //     const users = await UserModel.find({});
    //     res.status(StatusCodes.OK).json(users);
    // } catch (error) {
    //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //         msg: "Error fetching users",
    //     });
    // }

    const allUsers = await User.find({}).select("-password");

    res.status(StatusCodes.OK).json(allUsers);
};

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

        console.log(`userController log ${file}`);

        // Passing (formatted) file directly to Cloudinary
        const response = await cloudinary.v2.uploader.upload(file);

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
