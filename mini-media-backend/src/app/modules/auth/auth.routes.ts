import { Router } from "express";
import {
  getAllUsers,
  getUser,
  loginUser,
  registerUser,
  searchUsers,
} from "./auth.controllers";
const router = Router();

router.get("/get-user", getUser);
router.get("/get-all-users", getAllUsers);
router.get("/search-users/:query", searchUsers);
router.post("/registration", registerUser);
router.post("/login", loginUser);

export const authRoutes = router;
