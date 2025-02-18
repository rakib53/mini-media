import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isOnline: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["activated", "deactivated", "flagged", "banned"],
      default: "activated",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
