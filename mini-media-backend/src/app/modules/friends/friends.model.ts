import mongoose, { Document, Schema } from "mongoose";

interface IFriendship extends Document {
  user1: mongoose.Types.ObjectId; // First user
  user2: mongoose.Types.ObjectId; // Second user
  createdAt: Date;
}

const FriendshipSchema = new Schema<IFriendship>(
  {
    user1: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user2: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

FriendshipSchema.index({ user1: 1, user2: 1 }, { unique: true }); // Prevent duplicates

const Friendship = mongoose.model<IFriendship>("Friendship", FriendshipSchema);
export default Friendship;
