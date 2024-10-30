import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import applicationRoutes from "./routes/applicationRoutes";

const app = express();
const PORT = 5001;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 添加 OPTIONS
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

// 添加预检请求处理
app.options("*", cors());

mongoose
  .connect("mongodb://localhost:27017/assessment")
  .then(() => {
    console.log("数据库连接成功");
  })
  .catch((error) => {
    console.error("数据库连接失败:", error);
  });

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/application", applicationRoutes);

app
  .listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
  })
  .on("error", (error) => {
    console.error("服务器启动失败:", error);
  });
