import express from "express";
import { authRoutes } from "../modules/auth/auth.routes";
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
