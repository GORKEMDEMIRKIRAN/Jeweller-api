

import logger from "../utils/logger.js";
import type { CreateTransactionInputProps } from "../types/transactionTypes.js";
import prisma from './lib/prisma.js';


export async function createTransaction(createTransactionData: CreateTransactionInputProps) {
    try{
        logger.info(`[Transaction]-[Service]-[createTransaction]: Creating transaction for user (${createTransactionData.userId})`);
        const transaction = await prisma.transaction.create({
            data: {
                userId: createTransactionData.userId,
                customerId: createTransactionData.customerId,
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

export async function findTransactionById(transactionId: number) {
    try{
        logger.info(`[Transaction]-[Service]-[findTransactionById]: Fetching transaction (${transactionId})`);
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: { TransactionProduct: true }
        });
        return transaction;
    } catch (error) {
        logger.error(`[Transaction]-[Service]-[findTransactionById]: Error fetching transaction - ${error}`);
        throw new Error('Internal server error');
    }
}

export async function findAllTransactions() {
    try{
        logger.info(`[Transaction]-[Service]-[findAllTransactions]: Fetching all transactions`);
        const transactions = await prisma.transaction.findMany({
            include: { TransactionProduct: true }
        });
        return transactions;
    } catch (error) {
        logger.error(`[Transaction]-[Service]-[findAllTransactions]: Error fetching transactions - ${error}`);
        throw new Error('Internal server error');
    }   
}