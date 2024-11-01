import { Schema, model, Document } from "mongoose";

export interface IApplication extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  content: string;
  status: "new" | "pending" | "accepted" | "rejected";
  createdAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "pending", "accepted", "rejected"],
      default: "new",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.pre("save", function (next) {
  next();
});

export default model<IApplication>("Application", applicationSchema);
