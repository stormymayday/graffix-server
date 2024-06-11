import { Router } from "express";
import { getCurrentUser, updateUser } from "../controllers/userController.js";
import { validateUpdateUserInput } from "../middleware/validationMiddleware.js";
import fileUpload from "../middleware/multerMiddleware.js";

const router = Router();

router.get("/current-user", getCurrentUser);
router.patch(
    "/update-user",
    fileUpload.single("avatar"),
    validateUpdateUserInput,
    updateUser
);

export default router;
