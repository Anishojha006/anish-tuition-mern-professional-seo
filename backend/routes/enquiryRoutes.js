import express from "express";
import Enquiry from "../models/Enquiry.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, phone, className, address, message } = req.body;

    if (!name || !phone || !className || !address) {
      return res.status(400).json({
        success: false,
        message: "Name, phone number, class and address are required."
      });
    }

    const enquiry = await Enquiry.create({ name, phone, className, address, message });

    res.status(201).json({
      success: true,
      message: "Your enquiry has been submitted successfully.",
      enquiry
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to submit enquiry right now."
    });
  }
});

export default router;
