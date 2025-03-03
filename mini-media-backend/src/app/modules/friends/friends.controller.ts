import { Request, Response } from "express";
import Friendship from "./friends.model";

export const getFriendList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    const friendships = await Friendship.find({
      $or: [{ user1: userId }, { user2: userId }],
    }).populate("user1 user2", "username");

    const friends = friendships.map((friendship) =>
      friendship.user1._id.toString() === userId
        ? friendship.user2
        : friendship.user1
    );

    res.json(friends);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const unfriend = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params; // The ID of the current user
    const { friendId } = req.body; // The ID of the friend to unfriend

    if (!friendId) {
      res.status(400).json({ message: "Friend ID is required" });
      return;
    }

    const friendship = await Friendship.findOneAndDelete({
      $or: [
        { user1: userId, user2: friendId },
        { user1: friendId, user2: userId },
      ],
    });

    if (!friendship) {
      res.status(404).json({ message: "Friendship not found" });
      return;
    }

    res.status(200).json({ message: "Unfriended successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
