import { Router } from "express";

const router = Router();

// Controller
import {
    getAllArtworks,
    getSingleArtwork,
    createArtwork,
    updateArtwork,
    deleteArtwork,
    getArtworksByCategory,
    getArtworksByArtist,
} from "../controllers/artworkController.js";

// Middleware
import {
    validateArtworkInput,
    validateIdParam,
} from "../middleware/validationMiddleware.js";
import { checkArtworkOwnership } from "../middleware/authorizationMiddleware.js";
import fileUpload from "../middleware/multerMiddleware.js";

router
    .route("/")
    .get(getAllArtworks)
    .post(fileUpload.single("artwork"), validateArtworkInput, createArtwork);

router.route("/category/:category").get(getArtworksByCategory);

router.route("/artist/:artistId").get(getArtworksByArtist);

router
    .route("/:id")
    .get(validateIdParam, getSingleArtwork)
    .patch(
        fileUpload.single("artwork"),
        validateArtworkInput,
        validateIdParam,
        checkArtworkOwnership,
        updateArtwork
    )
    .delete(
        validateIdParam,
        // checkArtworkOwnership,
        deleteArtwork
    );

export default router;
