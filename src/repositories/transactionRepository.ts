

import logger from "../utils/logger.js";
import { PrismaClient } from "@prisma/client/extension";
import type { CreateTransactionInputProps } from "../types/transactionTypes.js";

const prisma = new PrismaClient();

export async function createTransaction(createTransactionData: CreateTransactionInputProps) {
    try{
        logger.info(`[Transaction]-[Service]-[createTransaction]: Creating transaction for user (${createTransactionData.userId})`);
        const transaction = await prisma.transaction.create({
            data: {
                userId: createTransactionData.userId,
                transactionTypeId: createTransactionData.transactionTypeId,
                TransactionProduct: {
                    create: createTransactionData.products.map(product => ({
                        productId: product.productId,
                        quantity: product.quantity
                    }))
                }
            }
        });
        return transaction;
    }catch(error){
        logger.error(`[Transaction]-[Service]-[createTransaction]: Error creating transaction - ${error}`);
    }
}