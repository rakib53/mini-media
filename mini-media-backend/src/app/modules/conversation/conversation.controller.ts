import { Request, Response } from "express";
import conversationModel from "./conversation.model";

export const addConversation = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res
        .status(400)
        .json({ message: "Both sender and receiver are required." });
    }

    // Check if a conversation already exists between these users
    const existingConversation = await conversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (existingConversation) {
      return res.status(200).json({
        message: "Conversation already exists.",
        conversation: existingConversation,
      });
    }

    // Create new conversation
    const newConversation = new conversationModel({
      participants: [senderId, receiverId],
    });

    await newConversation.save();

    res.status(201).json({
      message: "Conversation created successfully.",
      conversation: newConversation,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCurrentUserConversations = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ message: "User ID is required." });
      return;
    }

    const conversations = await conversationModel
      .find({ participants: userId })
      .populate("participants", "username profilePic") // Fetch user details
      .sort({ updatedAt: -1 }); // Show most recent chats first

    // Extract other participants from each conversation
    const chatList = conversations.map((convo) => {
      const otherParticipant = convo.participants.find(
        (participant: any) => participant._id.toString() !== userId
      );
      return {
        _id: convo._id, // Conversation ID
        user: otherParticipant, // Other participant info
        lastMessage: convo.lastMessage || null,
        updatedAt: convo.updatedAt,
      };
    });

    res.status(200).json({
      message: "retrieve all the conversations",
      conversations: chatList,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
