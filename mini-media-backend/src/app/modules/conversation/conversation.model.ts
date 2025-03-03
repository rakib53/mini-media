import mongoose, { Document, Schema } from "mongoose";

interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: {
    sender: mongoose.Types.ObjectId;
    message: string;
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    lastMessage: {
      sender: { type: Schema.Types.ObjectId, ref: "User" },
      message: String,
      timestamp: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema
);
