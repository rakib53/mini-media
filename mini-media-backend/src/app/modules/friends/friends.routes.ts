import express from "express";
import { getFriendList, unfriend } from "./friends.controller";
const router = express.Router();

router.get("/get-friends/:userId", getFriendList);
router.post("/unfriend/:userId", unfriend);

export const friendsRoutes = router;
