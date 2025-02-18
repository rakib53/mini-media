import { Request, Response } from "express";
import { MessageModel } from "./messages.models";

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { userId, friendId } = req.params;

    const messages = await MessageModel.find({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
