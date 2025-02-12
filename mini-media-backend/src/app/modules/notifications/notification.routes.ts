import { Router } from "express";
import {
  fetchNotifications,
  sendNotification,
} from "./notifications.controllers";
const router = Router();

router.post("/send-notification", sendNotification);
router.get("/get-notification/:userId", fetchNotifications);

export const notificationRoutes = router;
