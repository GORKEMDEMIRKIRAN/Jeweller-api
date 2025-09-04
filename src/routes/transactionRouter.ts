
import {Router} from "express";
import {
    createTransaction,
    updateTransaction,
    getTransactionById,
    getAllTransactions,
} from "../controllers/transactionController.js";
import {requestAuth} from "../middlewares/authMiddleware.js";

const router = Router();


/**
 * @openapi
 * /transaction/update/{id}:
 *   put:
 *    summary: Update Transaction
 */
router.put("/update/:id", requestAuth, updateTransaction);
/**
 * @openapi
 * /transaction/{id}:
 *   get:
 *    summary: Get Transaction by ID
 */
router.get("/:id", requestAuth, getTransactionById);
/**
 * @openapi
 * /transaction:
 *   get:
 *    summary: Get All Transactions
 */
router.get("/", requestAuth, getAllTransactions);
/**
 * @openapi
 * /transaction/create:
 *   post:
 *    summary: Create Transaction
 */
router.post("/create", requestAuth, createTransaction);

export default router;
