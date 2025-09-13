import type { Request, Response } from "express";
import logger from "../utils/logger.js";
import * as transctionService from "../services/transactionService.js";
import type { CreateAllTransactionInputProps} from "../types/transactionTypes.js";




/**
 * @openapi
 * /transaction/create:
 *   post:
 *     tags:
 *       - Transaction
 *     summary: Create a new purchase transaction
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAllTransactionInputProps'
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: At least one product and customer information is required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Error creating customer
 */
export async function createTransaction(req:Request,res:Response){
    if(!req.user){
        logger.warn(`[Transaction]-[Controller]-[createTransaction]: Unauthorized access attempt`);
        return res.status(401).json({message: "Unauthorized"});
    }
    try{
        // gönderilen veriler
        // 1- userId (kullanıcı var sadece id alacağız)
        // 2- ürün bilgileri alacağız (Array)
        // 3- müşteri bilgilerini alacağız( müşteri varsa sadece id gelecek)
        // 4- transactionTypeId (1-purchase) sabit olacak
        const transactionData:CreateAllTransactionInputProps = req.body;
        if(!transactionData.products || transactionData.products.length === 0){
            logger.warn(`[Transaction]-[Controller]-[createTransaction]: No products provided`);
            return res.status(400).json({message: "At least one product is required"});
        }
        if(!transactionData.customerId && !transactionData.customer){
            logger.warn(`[Transaction]-[Controller]-[createTransaction]: No customer information provided`);
            return res.status(400).json({message: "Customer id or customer information is required"});
        }
        // transactionTpyeId:2 (purchase)
        await transctionService.createTransaction({...transactionData,transactionTypeId:2});
        logger.info(`[Transaction]-[Controller]-[createTransaction]: Transaction created successfully`);
        return res.status(201).json({
            success: true,
            message: "Transaction created successfully"
        });
    }catch(error){
        if(error instanceof Error){
            if(error.message === "User not found"){
                return res.status(404).json({message: "User not found"});
            }
            if(error.message === "Customer data is missing"){
                return res.status(400).json({message: "Customer data is missing"});
            }
            if(error.message === "Error creating customer"){
                return res.status(500).json({message: "Error creating customer"});
            }
            if(error.message === "At least one product is required"){
                return res.status(400).json({message: "At least one product is required"});
            }
        }
    }
}



/**
 * @openapi
 * /transaction/{id}:
 *   get:
 *     tags:
 *       - Transaction
 *     summary: Get transaction by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction data
 *       404:
 *         description: Transaction not found
 */
export async function getTransactionById(req:Request,res:Response){
    const { id } = req.params;
    try{
        const transaction = await transctionService.transactionById(Number(id));
        return res.status(200).json(transaction);
    }catch(error){
        if(error instanceof Error){
            if(error.message === "Transaction not found"){
                return res.status(404).json({message: "Transaction not found"});
            }
        }
    }
}



/**
 * @openapi
 * /transaction:
 *   get:
 *     tags:
 *       - Transaction
 *     summary: Get all transactions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all transactions
 *       500:
 *         description: Internal server error
 */
export async function getAllTransactions(req:Request,res:Response){
    try{
        const transactions = await transctionService.allTransactions();
        return res.status(200).json(transactions);
    }catch(error){
        if(error instanceof Error){
            return res.status(500).json({message: "Internal server error"});
        }
    }
}