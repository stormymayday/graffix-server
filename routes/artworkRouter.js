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
    validateArtInput,
    validateIdParam,
} from "../middleware/validationMiddleware.js";

router.route("/").get(getAllArtworks).post(validateArtInput, createArtwork);
router
    .route("/:id")
    .get(validateIdParam, getSingleArtwork)
    .patch(validateArtInput, validateIdParam, updateArtwork)
    .delete(validateIdParam, deleteArtwork);

export default router;
