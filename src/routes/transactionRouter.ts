
/**
 * @openapi
 * tags:
 *   name: Transaction
 *   description: Transaction Management
 */


import { Router } from "express";
import {
  createTransaction,
  getTransactionById,
  getAllTransactions,
} from "../controllers/transactionController.js";
import { requestAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/:id", requestAuth, getTransactionById);
router.get("/", requestAuth, getAllTransactions);
router.post("/create", requestAuth, createTransaction);

export default router;
