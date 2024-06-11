import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { UnauthenticatedError } from "../errors/customErrors.js";
import { createJWT } from "../utils/tokenUtils.js";

export const register = async (req, res) => {
    // Hashing the password
    const hashedPassword = await hashPassword(req.body.password);

    // Overriding the value
    req.body.password = hashedPassword;

    // Creating user instance
    const user = await User.create(req.body);

    // Sending back the response
    res.status(StatusCodes.CREATED).json({ msg: "user created" });
};

export const login = async (req, res) => {
    // Looking for the user with matching email
    const user = await User.findOne({ email: req.body.email });

    // User was not found
    if (!user) {
        throw new UnauthenticatedError("invalid credentials");
    }

    // Matching the passwords
    const passwordsMatch = await comparePassword(
        req.body.password,
        user.password
    );

    // Password do not match
    if (!passwordsMatch) {
        throw new UnauthenticatedError("invalid credentials");
    }

    // Creating JWT
    const token = createJWT({
        userId: user._id,
        username: user.username,
    });

    // HTTP Only Cookie setup
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie("httpcookietoken", token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === "production",
    });

    res.status(StatusCodes.OK).json({ msg: "user logged in" });

    // res.json({ token: token });
};

export const logout = (req, res) => {
    res.cookie("httpcookietoken", "logout", {
        httpOnly: true,
        expires: new Date(Date.now()),
    });

    res.status(StatusCodes.OK).json({ msg: "user logged out" });
};
