import { Request, Response } from "express";
import { io, userList } from "../../../server";
import Notification from "./notification.models";

export const sendNotification = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId, message } = req.body;

    // Save to DB first
    const newNotification = new Notification({ senderId, receiverId, message });
    await newNotification.save();

    // Emit real-time event after saving
    const socketId = userList[receiverId];
    if (socketId) {
      io.to(socketId).emit("receiveNotification", {
        senderId,
        receiverId,
        message,
      });
    }

    res
      .status(201)
      .json({ success: true, message: "Notification sent and stored." });
  } catch (error) {
    console.error("Error saving notification:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const fetchNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const allNotifications = await Notification.find({
      receiverId: userId,
    });

    res.status(200).json(allNotifications);
  } catch (error) {
    console.log(error);
  }
};
