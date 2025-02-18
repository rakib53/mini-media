import express from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { friendRequestRoutes } from "../modules/friendRequest/friendRequest.routes";
import { messagesRoutes } from "../modules/messages/messages.routes";
import { notificationRoutes } from "../modules/notifications/notification.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/",
    route: notificationRoutes,
  },
  {
    path: "/",
    route: authRoutes,
  },
  {
    path: "/",
    route: friendRequestRoutes,
  },
  {
    path: "/",
    route: messagesRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
