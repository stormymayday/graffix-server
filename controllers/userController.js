import { StatusCodes } from "http-status-codes";

import User from "../models/UserModel.js";

export const getCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "get current user" });
};

export const updateUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "update user" });
};
