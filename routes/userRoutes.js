import { Router } from "express";
import {
  deleteUser,
  getProfile,
  getUsers,
  updateProfile,
  updateUserRole,
} from "../controllers/userController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/", protect, authorize("admin"), getUsers);
router.put("/:id/role", protect, authorize("admin"), updateUserRole);
router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;
