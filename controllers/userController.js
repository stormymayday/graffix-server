import { StatusCodes } from "http-status-codes";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";

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
    const userObj = { ...req.body };
    // deleting the password
    delete userObj.password;

    const updatedUser = await User.findByIdAndUpdate(req.user.userId, userObj);
    res.status(StatusCodes.OK).json({ msg: "user updated" });
};
