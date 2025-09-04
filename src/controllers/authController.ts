import type { Request, Response } from "express";


import logger from "../utils/logger.js";
import * as authService from "../services/authService.js";
import * as tokenService from '../services/tokenService.js';
import * as userService from "../services/userService.js";
import type {LoginUserInputProps} from '../types/authTypes.js';


//------------------------------------------------------------
/**
 * @openapi
 * /auth/login:
 *   post:
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
  const login:LoginUserInputProps = req.body;
  if (!login.email || !login.password) {
    logger.warn(`[Auth]-[Controller]-[Login]: Email or password missing`);
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await authService.loginUser(login.email, login.password);
    const tokens = tokenService.generateTokens({
      id: user.id,
      email: user.email,
    });
    await userService.updateUser(user.id, {
      refreshToken: tokens.refreshToken,
    });
    logger.info(
      `[Auth]-[Controller]-[Login]: User logged in successfully (${login.email})`
    );
    // response
    res.status(200).json({
      access: true,
      message: "Login successful",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    logger.error(`[Auth]-[Controller]-[Login]:: Error occurred - ${error}`);
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

export async function verifyEmail(req: Request, res: Response) {
  res.status(200).json({ message: "Email verified successfully" });
}
//------------------------------------------------------------
export async function verifyPhone(req: Request, res: Response) {
  res.status(200).json({ message: "Phone number verified successfully" });
}
//------------------------------------------------------------
export async function logout(req: Request, res: Response) {
  if (!req.user) {
    logger.warn("Logout: Unauthorized, Token missing");
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.status(200).json({ message: "User logged out successfully" });
}
//------------------------------------------------------------
export async function forgotPassword(req: Request, res: Response) {
  res.status(200).json({ message: "Password reset link sent to email" });
}
//------------------------------------------------------------
export async function resetPassword(req: Request, res: Response) {
  res.status(200).json({ message: "Password reset successfully" });
}
//------------------------------------------------------------
