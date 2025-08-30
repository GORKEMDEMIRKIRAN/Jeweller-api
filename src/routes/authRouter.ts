import { Router } from "express";
import {
  register,
  login,
  verifyEmail,
  logout,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  forgotPassword,
  resetPassword,
  verifyPhone
} from "../controllers/authController.js";
import {requestAuth} from '../middlewares/authMiddleware.js';

const router = Router();

router.post("/register", register);
router.post("/login",requestAuth, login);
router.post("/verify-email", requestAuth, verifyEmail);
router.post("/logout", requestAuth, logout);
router.get("/profile", requestAuth, getUserProfile);
router.put("/profile", requestAuth, updateUserProfile);
router.delete("/profile", requestAuth, deleteUserAccount);
router.post("/forgot-password", requestAuth, forgotPassword);
router.post("/reset-password", requestAuth, resetPassword);
router.post("/verify-phone", requestAuth, verifyPhone);

export default router;
