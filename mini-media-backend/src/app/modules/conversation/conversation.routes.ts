import { Router } from "express";
import {
  addConversation,
  getCurrentUserConversations,
} from "./conversation.controller";
const route = Router();

route.get("/get-conversations/:userId", getCurrentUserConversations);
route.post("/add-conversation", addConversation);

export const conversationRoutes = route;
