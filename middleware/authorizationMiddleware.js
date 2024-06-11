import ArtworkModel from "../models/ArtworkModel.js";
import { UnauthorizedError, NotFoundError } from "../errors/customErrors.js";

export const checkArtworkOwnership = async (req, res, next) => {
    // Get the artwork ID from the request
    const { id } = req.params;
    parameters;

    // Get the user ID from the authenticated user
    const { userId } = req.user;

    // Find the artwork by ID
    const artwork = await ArtworkModel.findById(id);

    // If artwork not found, return an error
    if (!artwork) {
        throw new NotFoundError("Artwork not found");
    }

    // Check if the user is the owner of the artwork
    if (artwork.createdBy.toString() !== userId) {
        throw new UnauthorizedError(
            "You are not authorized to modify this artwork"
        );
    }

    // If the user is the owner, proceed to the next middleware or route handler
    next();
};