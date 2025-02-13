import Router from "express";
import {
  getFriendRequests,
  sendFriendRequest,
} from "./friendRequest.controllers";
const router = Router();

router.get("/friend-requests/:userId", getFriendRequests);
router.post("/send-friend-request", sendFriendRequest);

export const friendRequestRoutes = router;
