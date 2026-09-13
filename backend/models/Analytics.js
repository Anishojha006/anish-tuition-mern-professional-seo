import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    timestamp: { type: Date, required: true, default: Date.now, index: true },
    date: { type: String, required: true, index: true },
    page: { type: String, required: true, trim: true },
    device: { type: String, required: true, enum: ["mobile", "desktop", "tablet"], default: "desktop" },
    browser: { type: String, default: "Unknown" },
    operatingSystem: { type: String, default: "Unknown" },
    referrer: { type: String, default: "direct" },
    ipHash: { type: String, default: "" }
  },
  { timestamps: true }
);

analyticsSchema.index({ sessionId: 1, page: 1, date: 1 });
analyticsSchema.index({ date: 1, page: 1 });

export default mongoose.model("Analytics", analyticsSchema);
