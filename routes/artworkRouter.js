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
import fileUpload from "../middleware/multerMiddleware.js";

// VERSION 1 - START
// router.route("/").get(getAllArtworks).post(validateArtworkInput, createArtwork);
// router
//     .route("/:id")
//     .get(validateIdParam, getSingleArtwork)
//     .patch(
//         validateArtworkInput,
//         validateIdParam,
//         checkArtworkOwnership,
//         updateArtwork
//     )
//     .delete(validateIdParam, checkArtworkOwnership, deleteArtwork);
// VERSION 1 - END

// VERSION 2 - START (testing file upload)
router
    .route("/")
    .get(getAllArtworks)
    .post(fileUpload.single("artwork"), validateArtworkInput, createArtwork);
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
    .delete(validateIdParam, checkArtworkOwnership, deleteArtwork);
// VERSION 2 - END (testing file upload)

export default router;
