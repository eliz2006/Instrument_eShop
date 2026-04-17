import { Router } from "express";
import passport from "passport";
import {
  googleAuthFail,
  googleAuthSuccess,
  googleCallbackSuccess,
  login,
  me,
  register,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/auth/google/failure" }),
  googleCallbackSuccess
);
router.get("/google/success", googleAuthSuccess);
router.get("/google/failure", googleAuthFail);

export default router;
