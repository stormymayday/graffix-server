import { Router } from "express";
import {
    getCurrentUser,
    updateUser,
    getAllUsers,
    getArtists,
    getNearbyArtists,
    getUserCollectedTreasures,
    likeArtwork,
} from "../controllers/userController.js";
import { validateUpdateUserInput } from "../middleware/validationMiddleware.js";
import fileUpload from "../middleware/multerMiddleware.js";

const router = Router();

router.get("/current-user", getCurrentUser);
router.get("/all-users", getAllUsers);
router.get("/artists", getArtists);
router.get("/artists/nearby", getNearbyArtists);
router.get("/user/:userId/collected-treasures", getUserCollectedTreasures);
router.patch("/like-artwork/:artworkId", likeArtwork);
router.patch(
    "/update-user",
    // fileUpload.single("avatar"),
    fileUpload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "featuredArt", maxCount: 1 },
    ]),
    // validateUpdateUserInput,
    updateUser
);

export default router;
