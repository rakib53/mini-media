import express from "express";
import {
  cancelOutgoingFriendRequest,
  declineFriendRequest,
  getFriendRequests,
  makeFriend,
  sendFriendRequest,
  unfriendUser,
} from "./friendRequest.controllers";
const router = express.Router();

router.get("/friend-requests/:userId", getFriendRequests);
router.post("/send-friend-request", sendFriendRequest);
router.post("/decline-friend-request", declineFriendRequest);
router.post("/cancel-friend-request", cancelOutgoingFriendRequest);
router.post("/make-friend", makeFriend);
router.post("/unfriend", unfriendUser);

export const friendRequestRoutes = router;
