import jwt from "jsonwebtoken";

export const createJWT = (payload) => {
    // payload contains userID
    const token = jwt.sign(payload, "secret", {
        expiresIn: "1d",
    });

    return token;
};
