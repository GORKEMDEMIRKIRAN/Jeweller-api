

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
    const productIds = [];
    const customerId=[];
    try{
        // 1. Kullanıcının varlığını doğrula
        const user = await userRepository.findUserById(createData.userId);
        if (!user) {
            logger.warn(`[Transaction]-[Service]-[createTransaction]: User not found (${createData.userId})`);
            throw new Error('User not found');
        }
        // 2. Müşterinin varlığını doğrula
        const customer = await customerRepository.findCustomerById(createData.userId);
        if (!customer) {
            logger.info(`[Transaction]-[Service]-[createTransaction]: Customer not found (${createData.userId})`);
            if(!createData.customer){
                logger.warn(`[Transaction]-[Service]-[createTransaction]: Customer data is missing`);
                throw new Error("Customer data is missing");
            }
            const newCustomerData=await customerRepository.createCustomer(createData.customer as CreateCustomerInputProps);
            customerId.push(newCustomerData?.id);
            logger.info(`[Transaction]-[Service]-[createTransaction]: Customer created (${newCustomerData?.id})`);
        }else{
            logger.info(`[Transaction]-[Service]-[createTransaction]: Customer found (${createData.userId})`);
        }
        // 3. Ürünler oluşturma
        if(!createData.products || createData.products.length === 0){
            logger.warn(`[Transaction]-[Service]-[createTransaction]: No products provided`);
            throw new Error("At least one product is required");
        }else{
            // oluşan ürün id array oluşturma
            for(const product of createData.products){
                const existingProduct = await productRepository.createProduct(product as CreateProductInputProps);
                productIds.push(existingProduct);
            }
        }
        // 4. Transaction oluşturma
        const transactionInput: CreateTransactionInputProps = {
            userId: createData.userId,
            transactionTypeId: createData.transactionTypeId,
            customerId: createData.customerId ? createData.customerId : Number(customerId[0]),
            products: productIds.map(product => ({ productId: product.id, quantity: product.quantity })),
        };
        await transactionRepository.createTransaction(transactionInput);
        logger.info(`[Transaction]-[Service]-[createTransaction]: Transaction created successfully`);
        return;
    } 
    catch (error) {
        logger.error(`[Transaction]-[Service]-[createTransaction]: Error creating transaction - ${error}`);
        throw new Error('Internal server error');
    }
}