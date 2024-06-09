import { UnauthenticatedError } from "../errors/customErrors.js";

export const authenticateUser = async (req, res, next) => {
    // console.log(req.cookies);

    // Extracting the HTTP Only Cookie from the request
    const { httpcookietoken } = req.cookies;

    // If there is not HTTP Cookie in the request
    if (!httpcookietoken) {
        // Throwing custom Unauthenticated Error
        throw new UnauthenticatedError("authentication failed");
    }

    // If HTTP Cookie exists, passing on
    next();
};
