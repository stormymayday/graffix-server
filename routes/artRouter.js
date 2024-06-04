import { Router } from "express";

const router = Router();

import {
    getAllArt,
    getSingleArt,
    createArt,
    updateArt,
    deleteArt,
} from "../controllers/artController.js";

// router.get("/", getAllArt);
// router.post("/", createArt);

router.route("/").get(getAllArt).post(createArt);
router.route("/:id").get(getSingleArt).patch(updateArt).delete(deleteArt);

export default router;
