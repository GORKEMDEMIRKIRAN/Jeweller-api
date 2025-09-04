

/**
 * @openapi
 * tags:
 *   name: User
 *   description: User Management Transactions
 */

import {Router} from "express";
import {
    register,
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
    getAllUsers
} from '../controllers/userController.js';
import {requestAuth} from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @openapi
 * /user/register:
 *   post:
 *     summary: User Registration
 */
router.post("/register", register);

/**
 * @openapi
 * /user/profile/{id}:
 *   get:
 *     summary: Get User Profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get("/profile/:id",requestAuth, getUserProfile);

/**
 * @openapi
 * /user/profile/{id}:
 *   put:
 *     summary: Update User Profile
 */
router.put("/profile/:id",requestAuth, updateUserProfile);

/**
 * @openapi
 * /user/profile/{id}:
 *   delete:
 *     summary: Delete User Account
 */
router.delete("/profile/:id",requestAuth, deleteUserAccount);

/**
 * @openapi
 * /user:
 *   get:
 *     summary: Get All Users
 */
router.get("/",requestAuth, getAllUsers);

export default router;
