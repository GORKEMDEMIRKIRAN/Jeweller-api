/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Authentication
 */

import { Router } from "express";
import {
  login,
  loginPhone,
  verificationEmail,
  sendVerificationEmail,
  verificationPhone,
  sendVerificationPhone,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { requestAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", login);
router.post("/login-phone", loginPhone);
router.post("/logout", requestAuth, logout);

router.post("/verify-email",sendVerificationEmail);
router.get("/verify-email",verificationEmail);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/send-verification-phone", requestAuth, sendVerificationPhone);
router.post("/verify-phone", requestAuth, verificationPhone);


export default router;
