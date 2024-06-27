import { Router } from "express";

import {
    getAllTreasures,
    getSingleTreasure,
    createTreasure,
    updateTreasure,
    deleteTreasure,
    getTreasuresByCategory,
    getTreasuresByDistance,
    addTreasureToCollection,
} from "../controllers/treasureController.js";

// Middleware
import {
    validateTreasureInput,
    validateTreasureIdParam,
} from "../middleware/validationMiddleware.js";

import fileUpload from "../middleware/multerMiddleware.js";

import { checkTreasureOwnership } from "../middleware/authorizationMiddleware.js";

const router = Router();

router
    .route("/")
    .get(getAllTreasures)
    .post(
        fileUpload.fields([
            { name: "treasure", maxCount: 1 },
            { name: "qrcode", maxCount: 1 },
        ]),
        validateTreasureInput,
        createTreasure
    );

router.route("/category/:category").get(getTreasuresByCategory);

router.route("/nearby").get(getTreasuresByDistance);

router
    .route("/:id")
    .get(validateTreasureIdParam, getSingleTreasure)
    .patch(
        fileUpload.fields([
            { name: "treasure", maxCount: 1 },
            { name: "qrcode", maxCount: 1 },
        ]),
        validateTreasureInput,
        validateTreasureIdParam,
        checkTreasureOwnership,
        updateTreasure
    )
    .delete(
        validateTreasureIdParam,
        // checkTreasureOwnership,
        deleteTreasure
    );

router.route("/add-to-collection/:treasureId").post(addTreasureToCollection);

export default router;
