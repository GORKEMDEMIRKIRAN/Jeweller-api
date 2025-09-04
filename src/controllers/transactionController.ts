import type { Request, Response } from "express";
import logger from "../utils/logger.js";
import * as transctionService from "../services/transactionService.js";
import type { CreateAllTransactionInputProps} from "../types/transactionTypes.js";



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
        if(!transactionData.customerId || !transactionData.customer){
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
        }
    }
}

export async function updateTransaction(req:Request,res:Response){

}

export async function getTransactionById(req:Request,res:Response){

}

export async function getAllTransactions(req:Request,res:Response){
    
}