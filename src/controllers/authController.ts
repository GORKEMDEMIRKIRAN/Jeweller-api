import type { Request, Response } from "express";

import logger from "../utils/logger.js";
import * as authService from "../services/authService.js";
import * as token from "../config/token.js";
import * as userService from "../services/userService.js";
import type { LoginUserInputProps } from "../types/authTypes.js";
import { calculateTimeOfToken } from "../config/token.js";
import { sendSMSCode } from "../utils/twillo.js";
import {generateSixDigitCode} from '../config/config.js';

//------------------------------------------------------------
/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login Successful
 *       400:
 *         description: Missing information
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export async function login(req: Request, res: Response) {
  const login: LoginUserInputProps = req.body;
  if (!login.email || !login.password) {
    logger.warn(`[Auth]-[Controller]-[Login]: Email or password missing`);
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await authService.loginUser(login.email, login.password);
    const tokens = token.generateTokens({
      id: user.id,
      email: user.email,
    });
    // send code to phone number
    const digitalCode = generateSixDigitCode(); // örn: "482193"
    console.log("Login Generated Code:", digitalCode); // Log the generated code
    // update user
    await userService.updateUser(user.id, {
      refreshToken: tokens.refreshToken,
      phoneVerificationCode: Number(digitalCode),
      phoneCodeExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 dakika geçerli
    });
    logger.info(`[Auth]-[Controller]-[Login]: User logged in successfully (${login.email})`);
    // send code to phone number
    await sendSMSCode(String(user?.phone), digitalCode);
    // response
    res.status(200).json({
      access: true,
      message: "Login successful",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    logger.error(`[Auth]-[Controller]-[Login]: Error occurred - ${error}`);
    if (error instanceof Error) {
      if (error.message === "user not found") {
        return res.status(404).json({ message: "User not found" });
      }
      if (error.message === "Invalid password") {
        return res.status(401).json({ message: "Invalid password" });
      }
    }
    res.status(500).json({ message: "Internal server error" });
  }
}
//------------------------------------------------------------

/**
 * @openapi
 * /auth/verify-email:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Send User Email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sending successful
 *       400:
 *         description: Missing information
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export async function sendVerificationEmail(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      logger.warn(`[Auth]-[Controller]-[VerificationEmail]: Email is required`);
      return res.status(400).json({ message: "Email is required" });
    }
    await authService.sendEmail(email);
    // Verify email logic here
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    }
    logger.error(
      `[Auth]-[Controller]-[VerificationEmail]:: Error occurred - ${error}`
    );
  }
}
//------------------------------------------------------------
/**
 * @openapi
 * /auth/verify-email:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Verify User Email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verification successful
 *       400:
 *         description: Missing information
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export async function verificationEmail(req: Request, res: Response) {
  try {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      logger.warn(`[Auth]-[Controller]-[VerificationEmail]: Token is required`);
      return res.status(400).json({ message: "Token is required" });
    }
    await authService.verifyEmail(token);
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Invalid token payload") {
        return res.status(400).json({ message: "Invalid token payload" });
      }
      if (error.message === "User not found") {
        return res.status(404).json({ message: "User not found" });
      }
    }
    logger.error(
      `[Auth]-[Controller]-[VerificationEmail]:: Error occurred - ${error}`
    );
  }
}
//------------------------------------------------------------

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User Logout
 *   security:
 *    - bearerAuth: []
 *   responses:
 *     200:
 *       description: User logged out successfully
 *     401:
 *       description: Unauthorized
 *     500:
 *       description: Internal server error
 */
export async function logout(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const authHeader = req.headers.authorization;
    let token = null;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7).trim();
    }
    if (token) {
      await calculateTimeOfToken(token);
    }
    await userService.updateUser(req.user.id, { refreshToken: null });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    logger.error(`[Auth]-[Controller]-[Logout]:: Error occurred - ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//------------------------------------------------------------

/**
 * @openapi
 * /auth/send-verification-phone:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Send verification code to user's phone
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification code sent to phone number
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User phone number not found
 *       500:
 *         description: Internal server error
 */
export async function sendVerificationPhone(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const digitalCode = generateSixDigitCode(); // örn: "482193"
    console.log("sendVerificationPhone Generated Code:", digitalCode); // Log the generated code
    const user = await userService.getUserById(req.user.id);
    if (!user.phone) {
      logger.warn(`[Auth]-[Controller]-[sendVerificationPhone]: User phone number not found`);
      return res.status(404).json({ message: "User phone number not found" });
    }
    // update user
    await userService.updateUser(req.user.id, {
      phoneVerificationCode: Number(digitalCode),
      phoneCodeExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 dakika geçerli
    });
    logger.info(`[Auth]-[Controller]-[sendVerificationPhone]: Updated user (${req.user.id}) with verification code`);
    // send code to phone number
    await sendSMSCode(String(user.phone), digitalCode);
    logger.info(`[Auth]-[Controller]-[sendVerificationPhone]: Sending verification code to phone number (${user.phone}- Digital Code: ${digitalCode})`);
    res.status(200).json({ message: "Verification code sent to phone number" });
  } catch (error) {
    logger.error(`[Auth]-[Controller]-[sendVerificationPhone]:: Error occurred - ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @openapi
 * /auth/verify-phone:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify user's phone with code
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Phone number verified successfully
 *       400:
 *         description: Code is required or invalid verification code
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export async function verificationPhone(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const { code } = req.body;
    if (!code) {
      logger.warn(`[Auth]-[Controller]-[VerificationPhone]: Code is required`);
      return res.status(400).json({ message: "Code is required" });
    }
    const user = await userService.getUserById(req.user.id);
    if( user?.phoneVerificationCode !== Number(code) || !user?.phoneCodeExpiresAt || user.phoneCodeExpiresAt < new Date()){
      logger.warn(`[Auth]-[Controller]-[VerificationPhone]: Invalid verification code`);
      return res.status(400).json({ message: "Invalid verification code" });
    }
    await userService.updateUser(req.user.id, { isPhoneVerified: true});
    logger.info(`[Auth]-[Controller]-[VerificationPhone]: User phone verified successfully (${user.email})`);
    // await authService.verifyPhoneNumber(String(req.user.phone), code);
    res.status(200).json({ message: "Phone number verified successfully" });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Invalid verification code") {
        return res.status(400).json({ message: "Invalid verification code" });
      }
      if (error.message === "User not found") {
        return res.status(404).json({ message: "User not found" });
      }
    }
    logger.error(`[Auth]-[Controller]-[VerificationPhone]: Error occurred - ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @openapi
 * /auth/login-phone:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login with phone verification code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Code is required or invalid verification code
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export async function loginPhone(req: Request, res: Response) {
  try{
    const {code,userId} = req.body;
    if(!code){
      logger.warn(`[Auth]-[Controller]-[LoginPhone]: Code is required`);
      return res.status(400).json({message: "Code is required"});
    }
    const user = await userService.getUserById(userId);
    if(!user){
      logger.warn(`[Auth]-[Controller]-[LoginPhone]: User not found (${userId})`);
      return res.status(404).json({message: "User not found"});
    }
    if(user?.phoneVerificationCode !== Number(code) || !user?.phoneCodeExpiresAt || user.phoneCodeExpiresAt < new Date()){
      logger.warn(`[Auth]-[Controller]-[LoginPhone]: Invalid verification code`);
      return res.status(400).json({ message: "Invalid verification code" });
    }
    logger.info(`[Auth]-[Controller]-[LoginPhone]: User phone verified successfully (${user.email})`);
    res.status(200).json({message: "Login successful"});
  }catch(error){
    logger.error(`[Auth]-[Controller]-[LoginPhone]: Error occurred - ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//------------------------------------------------------------
/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Send link reset email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 *       400:
 *         description: Email is required
 *       500:
 *         description: Internal server error
 */
export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      logger.warn(`[Auth]-[Controller]-[ForgotPassword]: Email is required`);
      return res.status(400).json({ message: "Email is required" });
    }
    await authService.sendForgotPasswordEmail(email);
    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (error) {
    if (error instanceof Error && error.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    }
    logger.error(
      `[Auth]-[Controller]-[ForgotPassword]: Error occurred - ${error}`
    );
    return res.status(500).json({ message: "Internal server error" });
  }
}
//------------------------------------------------------------
/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset user password
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Missing information or invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export async function resetPassword(req: Request, res: Response) {
  try {
    const resetToken = req.query.token;
    if (!resetToken || typeof resetToken !== "string") {
      logger.warn(`[Auth]-[Controller]-[ResetPassword]: Token is required`);
      return res.status(400).json({ message: "Token is required" });
    }
    const { newPassword } = req.body;
    if (!newPassword) {
      logger.warn(
        `[Auth]-[Controller]-[ResetPassword]: New password is required`
      );
      return res.status(400).json({ message: "New password is required" });
    }
    await authService.resetForgotPassword(resetToken, newPassword);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Invalid token payload") {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      if (error.message === "User not found") {
        return res.status(404).json({ message: "User not found" });
      }
      logger.error(
        `[Auth]-[Controller]-[ResetPassword]: Error occurred - ${error}`
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
