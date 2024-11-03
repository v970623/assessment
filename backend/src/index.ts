import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 5001;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true,
  })
);

app.options("*", cors());

mongoose
  .connect("mongodb://localhost:27017/assessment")
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/application", applicationRoutes);

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
  .on("error", (error) => {
    console.error("Server startup failed:", error);
  });
