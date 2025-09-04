


import logger from '../utils/logger.js';
import { PrismaClient } from '@prisma/client';
import type {CreateProductInputProps,UpdateProductInputProps} from '../types/productTypes.js';

const prisma=new PrismaClient();

export async function findAllProducts(){
  try {
    const products = await prisma.product.findMany();
    logger.info(`[Product]-[ProductRepository]-[findAllProducts]: Retrieved ${products.length} products`);
    return products;
  } catch (error) {
    logger.error(`[Product]-[ProductRepository]-[findAllProducts]: Error occurred - ${error}`);
    throw new Error("Error retrieving products");
  }
}

export async function findProductById(id: number) {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            logger.warn(`[Product]-[ProductRepository]-[findProductById]: Product not found (${id})`);
            throw new Error("Product not found");
        }
        logger.info(`[Product]-[ProductRepository]-[findProductById]: Product retrieved successfully (${id})`);
        return product;
    } catch (error) {
        logger.error(`[Product]-[ProductRepository]-[findProductById]: Error occurred - ${error}`);
        throw new Error("Error retrieving product");
    }
}

export async function createProduct(data:CreateProductInputProps){
    try{
        const product=await prisma.product.create({
            data
        });
        logger.info(`[Product]-[ProductRepository]-[createProduct]: Product created successfully (${product.id})`);
        return product;
    }catch(error){
        logger.error(`[Product]-[ProductRepository]-[createProduct]:Product create failed - ${error}`);
        throw new Error("Error creating product");
    }
}

export async function updateProduct(id:number,data:UpdateProductInputProps){
    try{
        const existingProduct=await prisma.product.update({
            where:{id},
            data
        });
        logger.info(`[Product]-[ProductRepository]-[updateProduct]: Updating product (${id})`);
        return existingProduct;
    }catch(error){
        logger.error(`[Product]-[ProductRepository]-[updateProduct]: Product update failed - ${error}`);
    }
}
