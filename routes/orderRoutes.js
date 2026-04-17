import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getMyOrderById,
  getMyOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, createOrder);
router.get("/mine", protect, getMyOrders);
router.get("/mine/:id", protect, getMyOrderById);
router.get("/", protect, authorize("admin"), getAllOrders);
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);
router.delete("/:id", protect, authorize("admin"), deleteOrder);

export default router;
