import { Router } from "express";
import { getUser, loginUser, registerUser } from "./auth.controllers";
const router = Router();

router.get("/get-user", getUser);
router.post("/registration", registerUser);
router.post("/login", loginUser);

export const authRoutes = router;
