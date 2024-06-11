import { Router } from "express";

const router = Router();

// Controller
import {
    getAllArtworks,
    getSingleArtwork,
    createArtwork,
    updateArtwork,
    deleteArtwork,
} from "../controllers/artworkController.js";

// Middleware
import {
    validateArtworkInput,
    validateIdParam,
} from "../middleware/validationMiddleware.js";
import { checkArtworkOwnership } from "../middleware/authorizationMiddleware.js";

router.route("/").get(getAllArtworks).post(validateArtworkInput, createArtwork);
router
    .route("/:id")
    .get(validateIdParam, getSingleArtwork)
    .patch(
        validateArtworkInput,
        validateIdParam,
        checkArtworkOwnership,
        updateArtwork
    )
    .delete(validateIdParam, checkArtworkOwnership, deleteArtwork);

export default router;
