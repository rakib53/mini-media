import { NextFunction, Request, Response } from "express";
import { io, userList } from "../../../server";
import { User } from "../auth/auth.models";
import Notification from "../notifications/notification.models";
import { FriendRequest } from "./friendRequest.model";

// send a friend request.
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

// get all friend request for an user.
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

// confirm a friend request
export const makeFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { sender, receiver } = req.body;

    const senderUser = await User.findById(sender);
    const receiverUser = await User.findById(receiver);

    if (!receiverUser || !senderUser) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Add each user to the other's friends list
    await User.findByIdAndUpdate(receiver, {
      $addToSet: { friends: sender }, // Prevents duplicates
    });

    await User.findByIdAndUpdate(sender, {
      $addToSet: { friends: receiver }, // Mutual friendship
    });

    // Remove friend request after acceptance
    await FriendRequest.findOneAndDelete({
      sender: sender,
      receiver: receiver,
    });

    res.status(200).json({ message: "Friend request accepted successfully." });
    return;
  } catch (error) {
    next(error);
  }
};

// Decline a friend request
export const declineFriendRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { senderId, receiverId } = req.body;

    // Check if the request exists
    const friendRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    if (!friendRequest) {
      res.status(404).json({ message: "Friend request not found." });
      return;
    }

    // Delete the friend request
    await FriendRequest.findByIdAndDelete(friendRequest._id);

    // Send a notification to the sender
    const receiverInfo = await User.findById(receiverId);
    const newNotification = new Notification({
      senderId: receiverId,
      receiverId: senderId,
      message: `${receiverInfo?.username} declined your friend request.`,
    });
    await newNotification.save();

    // Emit real-time event if sender is online
    const socketId = userList[senderId];
    if (socketId) {
      io.to(socketId).emit("friendRequestDeclined", {
        sender: receiverId,
        receiver: senderId,
        message: `${receiverInfo?.username} declined your friend request.`,
      });
    }

    res.status(200).json({ message: "Friend request declined successfully." });
  } catch (error) {
    console.error("Error declining friend request:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Cancel outgoing friend request
export const cancelOutgoingFriendRequest = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing senderId or receiverId" });
    }

    await FriendRequest.findOneAndDelete({
      sender: senderId,
      receiver: receiverId,
    });

    res
      .status(200)
      .json({ success: true, message: "Friend request canceled successfully" });
  } catch (error) {
    console.error("Error canceling friend request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Unfriend an user
export const unfriendUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId, friendId } = req.body; // Get user IDs from request body

    if (!userId || !friendId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    }

    // Find both users
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Remove friendId from user's friends list
    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    await user.save();

    // Remove userId from friend's friends list
    friend.friends = friend.friends.filter((id) => id.toString() !== userId);
    await friend.save();

    // Optional: Emit a socket event to update frontend
    io.to(friendId).emit("friendRemoved", userId);

    return res
      .status(200)
      .json({ success: true, message: "Friend removed successfully" });
  } catch (error) {
    console.error("Error unfriending user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
