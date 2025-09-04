/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Authentication Transactions
 */

import { Router } from "express";
import {
  login,
  verifyEmail,
  verifyPhone,
  logout,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";
import {requestAuth} from "../middlewares/authMiddleware.js";

const router = Router();


/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: User Login
 */
router.post("/login", login);

/**
 * @openapi
 * /auth/verify-email:
 *   post:
 *     summary: E-mail Verification
 */
router.post("/verify-email", verifyEmail);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: User Logout
 */
router.post("/logout",requestAuth, logout);

/**
 * @openapi
 * /auth/forgot-password/{id}:
 *   post:
 *     summary: Send Password Reset Request
 */
router.post("/forgot-password/:id", forgotPassword);

/**
 * @openapi
 * /auth/reset-password/{id}:
 *   post:
 *     summary: Reset Password
 */
router.post("/reset-password/:id", resetPassword);

/**
 * @openapi
 * /auth/verify-phone:
 *   post:
 *     summary: Phone Number Verification
 */
router.post("/verify-phone", verifyPhone);

export default router;
