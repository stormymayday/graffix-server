import { Router } from "express";
import { getCurrentUser, updateUser } from "../controllers/userController.js";

const router = Router();

router.get("/current-user", getCurrentUser);
router.patch("/update-user", updateUser);

export default router;
