import express from "express";
import { getMessages } from "./messages.controllers";
const router = express.Router();

router.get("/get-messages/:userId/:friendId", getMessages);

export const messagesRoutes = router;
