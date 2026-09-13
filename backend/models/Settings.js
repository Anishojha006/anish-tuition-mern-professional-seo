import mongoose from "mongoose";

const feePlanSchema = new mongoose.Schema(
  {
    range: { type: String, required: true, trim: true },
    price: { type: Number, required: true, default: 0 },
    note: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    fees: {
      type: [feePlanSchema],
      default: [
        { range: "Class 1 to 5", price: 3000, note: "Focused foundational learning and concept clarity" },
        { range: "Class 6 to 8", price: 4500, note: "Strengthened syllabus support and regular revision" },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
