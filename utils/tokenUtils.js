import jwt from "jsonwebtoken";

export const createJWT = (payload) => {
    // payload contains userID
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return token;
};
