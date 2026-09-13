import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = "Anish Ojha";

  if (!email || !password) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment.");
    process.exit(1);
  }

  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI must be set before creating the admin.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (existing) {
      console.log(`Admin already exists for ${email}`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await Admin.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    console.log(`Admin created successfully for ${email}`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
