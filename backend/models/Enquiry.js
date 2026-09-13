import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    className: { type: String, required: true, trim: true },
    address: { type: String, trim: true, default: "" },
    message: { type: String, trim: true, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);
