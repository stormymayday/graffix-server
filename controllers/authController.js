import { StatusCodes } from "http-status-codes";
import UserModel from "../models/UserModel.js";
import bcryptjs from "bcryptjs";

export const register = async (req, res) => {
    // Generating Salt
    const salt = await bcryptjs.genSalt(10);

    // Hashing the password
    const hashedPassword = await bcryptjs.hash(req.body.password, salt);

    // Overriding the value
    req.body.password = hashedPassword;

    // Creating a user
    const user = await UserModel.create(req.body);

    // Sending back the response
    res.status(StatusCodes.CREATED).json({ msg: "user created" });
};

export const login = async (req, res) => {
    res.send("login");
};
