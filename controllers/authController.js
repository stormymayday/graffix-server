import { StatusCodes } from "http-status-codes";
import UserModel from "../models/UserModel.js";
import { hashPassword } from "../utils/passwordUtils.js";

export const register = async (req, res) => {
    // Hashing the password
    const hashedPassword = await hashPassword(req.body.password);

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
