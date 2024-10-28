"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const applicationRoutes_1 = __importDefault(require("./routes/applicationRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
// 连接数据库
mongoose_1.default
    .connect("mongodb://localhost:27017/assessment")
    .then(() => {
    console.log("数据库连接成功");
})
    .catch((error) => {
    console.error("数据库连接失败:", error);
});
app.use(express_1.default.json());
app.use("/api/auth", authRoutes_1.default);
app.use("/api/application", applicationRoutes_1.default);
app
    .listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
})
    .on("error", (error) => {
    console.error("服务器启动失败:", error);
});
