import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import dns from "dns";
dns.setServers(["8.8.8.8","8.8.8.7"]);

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendBuildPath = path.resolve(__dirname, "../frontend/dist");
const publicBuildPath = path.resolve(__dirname, "public");
const staticRoot = fs.existsSync(publicBuildPath) ? publicBuildPath : frontendBuildPath;

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "anish-ojha-dev-secret";

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Anish Tuition API is running." });
});

app.use("/api/enquiries", enquiryRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/admin/auth", authRoutes);
app.use("/api/admin/analytics", analyticsRoutes);
app.use("/api/admin/settings", settingsRoutes);

app.use(express.static(staticRoot));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(staticRoot, "index.html"));
});

app.set("jwtSecret", JWT_SECRET);

const startServer = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected");
    } else {
      console.log("MONGO_URI not configured; running without database.");
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
