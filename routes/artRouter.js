import { Router } from "express";

const router = Router();

// Controller
import {
    getAllArt,
    getSingleArt,
    createArt,
    updateArt,
    deleteArt,
} from "../controllers/artController.js";

// Middleware
import {
    validateArtInput,
    validateIdParam,
} from "../middleware/validationMiddleware.js";

router.route("/").get(getAllArt).post(validateArtInput, createArt);
router
    .route("/:id")
    .get(validateIdParam, getSingleArt)
    .patch(validateArtInput, validateIdParam, updateArt)
    .delete(validateIdParam, deleteArt);

export default router;
