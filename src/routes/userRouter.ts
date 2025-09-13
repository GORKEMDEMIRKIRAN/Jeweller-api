/**
 * @openapi
 * tags:
 *   name: User
 *   description: User Management
 */

import { Router } from "express";
import {
  register,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getAllUsers,
} from "../controllers/userController.js";
import { requestAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", requestAuth, getAllUsers);
router.post("/register", register);
router.get("/profile/:id", requestAuth, getUserProfile);
router.put("/profile/:id", requestAuth, updateUserProfile);
router.delete("/profile/:id", requestAuth, deleteUserAccount);


export default router;
