import { Request, Response } from "express";
import { io, userList } from "../../../server";
import { User } from "../auth/auth.models";
import Notification from "../notifications/notification.models";
import { FriendRequest } from "./friendRequest.model";

export const sendFriendRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { sender, receiver } = req.body;

    // Check if the receiver exists
    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Check if the receiver's account is deactivated
    if (receiverUser.status === "deactivated") {
      res
        .status(403)
        .json({ message: "This user account has been deactivated." });
      return;
    }

    // Check if they are already friends
    if (receiverUser.friends.includes(sender)) {
      res.status(400).json({ message: "You're already friends." });
      return;
    }

    // Check if a friend request is already pending
    const existingRequest = await FriendRequest.findOne({
      sender,
      receiver,
      status: "pending",
    });
    if (existingRequest) {
      res.status(400).json({ message: "Friend request already sent." });
      return;
    }

    // Create the friend request
    const result = await FriendRequest.create({ sender, receiver });
    const senderInfo = await User.findById(sender);
    const newNotification = new Notification({
      senderId: sender,
      receiverId: receiver,
      message: `You have a friend request from ${senderInfo?.username}`,
    });
    await newNotification.save();
    const socketId = userList[receiver];
    io.to(socketId).emit("friendRequestSent", {
      sender: {
        _id: senderInfo?._id,
        username: senderInfo?.username,
        email: senderInfo?.email,
      },
      receiver,
      message: `You have a friend request from ${senderInfo?.username}`,
    });

    res
      .status(201)
      .json({ message: "Friend request sent successfully.", request: result });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getFriendRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Get incoming friend requests (requests where the user is the receiver)
    const incomingRequests = await FriendRequest.find({
      receiver: userId,
      status: "pending",
    })
      .populate("sender", "username email") // Populate sender details
      .sort({ createdAt: -1 }); // Sort by newest first

    // Get outgoing friend requests (requests where the user is the sender)
    const outgoingRequests = await FriendRequest.find({
      sender: userId,
      status: "pending",
    })
      .populate("receiver", "username email") // Populate receiver details
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Friend requests retrieved successfully.",
      incomingRequests,
      outgoingRequests,
    });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
