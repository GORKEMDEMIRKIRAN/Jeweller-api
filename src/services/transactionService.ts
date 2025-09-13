

// ORKESTRASYON SERVICE
import logger from '../utils/logger.js';
// Repositories
import * as transactionRepository from '../repositories/transactionRepository.js';
import * as userRepository from '../repositories/userRepository.js';
import * as productRepository from '../repositories/productRepository.js';
import * as customerRepository from '../repositories/customerRepository.js';
// Types
import type { CreateAllTransactionInputProps, CreateTransactionInputProps } from '../types/transactionTypes.js';
import type { CreateProductInputProps } from '../types/productTypes.js';
import type { CreateCustomerInputProps } from '../types/customerTypes.js';


export async function createTransaction(createData: CreateAllTransactionInputProps) {
    const productsData = [];
    const customerId = [];
    try{
        // 1. Kullanıcının varlığını doğrula
        const user = await userRepository.findUserById(createData.userId);
        logger.info(`[Transaction]-[Service]-[createTransaction]: Verifying user (${createData.userId})`);
        if (!user) {
            logger.warn(`[Transaction]-[Service]-[createTransaction]: User not found (${createData.userId})`);
            throw new Error('User not found');
        }
        // 2. Müşterinin varlığını doğrula yoksa oluştur
        const customer = await customerRepository.findCustomerById(createData.customerId as number);
        logger.info(`[Transaction]-[Service]-[createTransaction]: Verifying customer (${createData.customerId})`);
        if (!customer) {
            logger.info(`[Transaction]-[Service]-[createTransaction]: Customer not found (${createData.customerId})`);
            if(!createData.customer){
                logger.warn(`[Transaction]-[Service]-[createTransaction]: Customer data is missing`);
                throw new Error("Customer data is missing");
            }
            const newCustomerData=await customerRepository.createCustomer(createData.customer as CreateCustomerInputProps);
            logger.info(`[Transaction]-[Service]-[createTransaction]: Creating new customer`);
            if(!newCustomerData){
                logger.error(`[Transaction]-[Service]-[createTransaction]: Error creating customer`);
                throw new Error("Error creating customer");
            }
            customerId.push(newCustomerData?.id);
            logger.info(`[Transaction]-[Service]-[createTransaction]: Customer created (${newCustomerData?.id})`);
        }else{
            customerId.push(customer.id);
            logger.info(`[Transaction]-[Service]-[createTransaction]: Customer found (${customer.id})`);
        }
        // 3. Create products
        if(!createData.products || createData.products.length === 0){
            logger.warn(`[Transaction]-[Service]-[createTransaction]: No products provided`);
            throw new Error("At least one product is required");
        }else{
            // oluşan ürün id array oluşturma
            for(const product of createData.products){
                const existingProduct = await productRepository.createProduct(product as CreateProductInputProps);
                productsData.push(existingProduct);
            }
            logger.info(`[Transaction]-[Service]-[createTransaction]: Products processed (${productsData.length})`);
        }
        // 4. Create Transaction
        const transactionInput: CreateTransactionInputProps = {
            userId: user.id,
            transactionTypeId: createData.transactionTypeId ? createData.transactionTypeId : 2,
            customerId: createData.customerId ? createData.customerId : Number(customerId[0]),
            products: productsData.map(product => ({ productId: product.id, quantity: product.quantity })),
        };
        logger.info(`[Transaction]-[Service]-[createTransaction]: Creating transaction for user (${user.id}) with customer (${transactionInput.customerId}) and products (${transactionInput.products.length})`);
        await transactionRepository.createTransaction(transactionInput);
        logger.info(`[Transaction]-[Service]-[createTransaction]: Transaction created successfully`);
        return;
    } 
    catch (error) {
        logger.error(`[Transaction]-[Service]-[createTransaction]: Error creating transaction - ${error}`);
        throw new Error('Internal server error');
    }
}

export async function transactionById(transactionId:number){
    try{
        const transaction = await transactionRepository.findTransactionById(transactionId);
        if (!transaction) {
            logger.warn(`[Transaction]-[Service]-[transactionById]: Transaction not found (${transactionId})`);
            throw new Error('Transaction not found');
        }
        return transaction;
    } catch (error) {
        logger.error(`[Transaction]-[Service]-[transactionById]: Error fetching transaction - ${error}`);
        throw new Error('Internal server error');
    }
}

export async function allTransactions(){
    try{
        logger.info(`[Transaction]-[Service]-[getAllTransactions]: Fetching all transactions`);
        const transactions = await transactionRepository.findAllTransactions();
        return transactions;
    } catch (error) {
        logger.error(`[Transaction]-[Service]-[getAllTransactions]: Error fetching transactions - ${error}`);
        throw new Error('Internal server error');
    }
}