import Router from "express";
import {
  declineFriendRequest,
  getFriendRequests,
  makeFriend,
  sendFriendRequest,
} from "./friendRequest.controllers";
const router = Router();

router.get("/friend-requests/:userId", getFriendRequests);
router.post("/send-friend-request", sendFriendRequest);
router.post("/cancel-friend-request", declineFriendRequest);
router.post("/make-friend", makeFriend);

export const friendRequestRoutes = router;
