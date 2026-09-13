import express from "express";
import { protectAdmin } from "../middleware/authMiddleware.js";
import {
  getDailyVisitors,
  getDeviceStats,
  getMonthlyVisitors,
  getOverview,
  getPageStats,
  getRecentEnquiries,
  trackVisitor,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.post("/track", trackVisitor);
router.get("/overview", protectAdmin, getOverview);
router.get("/daily", protectAdmin, getDailyVisitors);
router.get("/monthly", protectAdmin, getMonthlyVisitors);
router.get("/devices", protectAdmin, getDeviceStats);
router.get("/pages", protectAdmin, getPageStats);
router.get("/enquiries", protectAdmin, getRecentEnquiries);

export default router;
