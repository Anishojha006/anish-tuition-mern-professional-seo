import express from "express";
import rateLimit from "express-rate-limit";
import { getAdminProfile, loginAdmin } from "../controllers/authController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

router.post("/login", loginLimiter, loginAdmin);
router.get("/me", protectAdmin, getAdminProfile);

export default router;
