import { Schema, model, Document } from "mongoose";

export interface IApplication extends Document {
  userId: Schema.Types.ObjectId;
  status: "new" | "pending" | "accepted" | "rejected";
  content: string;
}

const applicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "pending", "accepted", "rejected"],
      default: "new",
      required: true, // 添加 required
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // 添加时间戳
  }
);

// 添加中间件来验证状态更新
applicationSchema.pre("save", function (next) {
  next();
});

export default model<IApplication>("Application", applicationSchema);
