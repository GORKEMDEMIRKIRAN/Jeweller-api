


import type { Request, Response } from "express";
import logger from "../utils/logger.js";
import * as token from '../config/token.js';
import * as userService from "../services/userService.js";
import * as authService from "../services/authService.js";
import type { RegisterUserInputProps ,UpdateUserInputProps} from "../types/userTypes.js";




/**
 * @openapi
 * /user/register:
 *   post:
 *     tags:
 *       - User
 *     summary: User Registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *               phone:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Missing information or user already exists
 *       500:
 *         description: Internal server error
 */
export async function register(req: Request, res: Response) {
  // take email and password from request body
  const registerData: RegisterUserInputProps = req.body;
  if (!registerData.email || !registerData.password) {
    logger.warn(
      `[User]-[Controller]-[Register]: Missing email or password (${registerData.email}, ${registerData.password})`
    );
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    // create user
    const user:any= await userService.registerUser({
      ...registerData,
      userTypeId: 1,
      password: registerData.password,
    });
    logger.info(`[User]-[Controller]-[Register]: User created in DB (${registerData.email})`);
    const tokens = token.generateTokens({
      id: user.id,
      email: user.email,
    });
    logger.info(`[User]-[Controller]-[Register]:Tokens created (${tokens.accessToken},${tokens.refreshToken})`);
    await userService.updateUser(user.id, {
      refreshToken: tokens.refreshToken,
    });
    await authService.sendEmail(user.email);
    logger.info(`[User]-[Controller]-[Register]: Verification email sent (${registerData.email})`);
    logger.info(`[User]-[Controller]-[Register]: User registered successfully (${registerData.email})`);
    // respond with success message
    res.status(201).json({
      access: true,
      message: "User registered successfully",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    logger.error(`[User]-[Controller]-[Register]: Error occurred - ${error}`);
    if (error instanceof Error) {
      if (error.message === "User already exists") {
        res.status(400).json({ message: "User already exists" });
      }
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @openapi
 * /user/profile/{id}:
 *   get:
 *     tags:
 *        - User
 *     summary: Get User Profil
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: UserId is required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export async function getUserProfile(req: Request, res: Response) {
  const userId = Number(req.params.id);
  if (!userId) {
    logger.warn(`[User]-[Controller]-[GetUserProfile]: UserId missing (${userId})`);
    return res.status(401).json({ message: "UserId is required" });
  }
  try{
    const userInfo = await userService.getUserById(userId);
    const {password,refreshToken,accessToken,...rest}=userInfo;
    logger.info(`[User]-[Controller]-[GetUserProfile]: User profile retrieved successfully (${userId})`);
    res.status(200).json(rest);
  }catch(error){
    logger.error(`[User]-[Controller]-[GetUserProfile]: Error occurred - ${error}`);
    if (error instanceof Error) {
      if (error.message === "User not found") {
        return res.status(404).json({ message: "User not found" });
      }
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @openapi
 * /user/:
 *   get:
 *     tags:
 *        - User
 *     summary: Get All Users 
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       500:
 *         description: Internal server error
 */
export async function getAllUsers(req:Request,res:Response){
  try{
    const users=await userService.getAllUsers();
    const usersWithoutSensitiveInfo = users.map(({password,refreshToken,accessToken,...rest})=>rest);
    console.log(usersWithoutSensitiveInfo);
    logger.info(`[User]-[Controller]-[GetAllUsers]: All users retrieved successfully`);
    res.status(200).json(usersWithoutSensitiveInfo);
  }catch(error){
    logger.error(`[User]-[Controller]-[GetAllUsers]: Error occurred - ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @openapi
 * /user/profile/{id}:
 *   put:
 *     tags:
 *       - User
 *     summary: Update User Profile
 *     parameters:
 *       - in: path
 *         name: id
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *               phone:
 *                 type: number
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Email or password missing
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export async function updateUserProfile(req: Request, res: Response) {
  const userId = req.params.id;
  const reqData: UpdateUserInputProps = req.body;
  if (!userId) {
    logger.warn("[User]-[Controller]-[updateUserProfile]:: User ID missing");
    return res.status(400).json({ message: "User ID is required" });
  }
  if (!reqData.email && !reqData.password) {
    logger.warn(`[User]-[Controller]-[updateUserProfile]:: User email or password missing (${userId})-(${reqData.email}-${reqData.password})`);
    return res.status(400).json({
      message: "At least one of email or password is required to update",
    });
  }
  try {
    await userService.updateUser(Number(userId), reqData);
    logger.info(`[User]-[Controller]-[updateUserProfile]: User profile updated successfully (${userId})`);
    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    logger.error(`[User]-[Controller]-[updateUserProfile]: Error occurred - ${error}`);
    if (error instanceof Error) {
      if (error.message === "User not found") {
        return res.status(404).json({ message: "User not found" });
      }
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @openapi
 * /user/profile:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete User Profile
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export async function deleteUserAccount(req: Request, res: Response) {
  // if (!req.user) {
  //   logger.warn(
  //     `[User]-[Controller]-[DeleteUserAccount]: Unauthorized, Token missing`
  //   );
  //   return res.status(401).json({ message: "Unauthorized" });
  // }
  const userId=Number(req.params.id);
  if(!userId){
    logger.warn(`[User]-[Controller]-[DeleteUserAccount]: UserId missing (${userId})`);
    return res.status(401).json({ message: "UserId is required" });
  }
  try {
    await userService.deleteUser(userId);
    logger.info(
      `[User]-[Controller]-[DeleteUserAccount]: User account deleted successfully (${userId})`
    );
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    logger.error(
      `[User]-[Controller]-[DeleteUserAccount]: Error occurred - ${error}`
    );
    if (error instanceof Error && error.message === "User not found") {
      res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

