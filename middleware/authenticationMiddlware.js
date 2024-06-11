import { UnauthenticatedError } from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = async (req, res, next) => {
    // console.log(req.cookies);

    // Extracting the HTTP Only Cookie from the request
    const { httpcookietoken } = req.cookies;

    // If there is not HTTP Cookie in the request
    if (!httpcookietoken) {
        // Throwing custom Unauthenticated Error
        throw new UnauthenticatedError("authentication failed");
    }

    // Verifying if the JWT is valid
    try {
        // Extracting userID from the JWT if it is valid
        const { userId } = verifyJWT(httpcookietoken);

        // Attaching userId to the request such that it can be used by the upcoming controllers
        req.user = {
            userId: userId,
        };

        // If HTTP Cookie exists, passing on
        next();
    } catch (error) {
        // Throwing custom Unauthenticated Error
        throw new UnauthenticatedError("authentication failed");
    }
};
