import express from "express";
import Settings from "../models/Settings.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

const defaultFees = [
  { range: "Class 1 to 5", price: 3000, note: "Focused foundational learning and concept clarity" },
  { range: "Class 6 to 8", price: 4500, note: "Strengthened syllabus support and regular revision" },
];

router.get("/fees", async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({ fees: defaultFees });
    }

    return res.json({
      success: true,
      data: settings.fees || defaultFees,
    });
  } catch (error) {
    console.error("Fee fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load fee plans right now.",
    });
  }
});

router.put("/fees", protectAdmin, async (req, res) => {
  try {
    const fees = Array.isArray(req.body?.fees) ? req.body.fees : [];

    const sanitized = fees.slice(0, 2).map((plan, index) => ({
      range: String(plan?.range || (index === 0 ? "Class 1 to 5" : "Class 6 to 8")),
      price: Number(plan?.price || 0),
      note: String(plan?.note || ""),
    }));

    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    settings.fees = sanitized.length ? sanitized : defaultFees;
    await settings.save();

    return res.json({
      success: true,
      message: "Fee plans updated successfully.",
      data: settings.fees,
    });
  } catch (error) {
    console.error("Fee update error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update fee plans right now.",
    });
  }
});

export default router;
