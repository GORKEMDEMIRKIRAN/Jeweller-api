


import logger from '../utils/logger.js';

import * as productRepository from '../repositories/productRepository.js'
import type {CreateProductInputProps,UpdateProductInputProps} from '../types/productTypes.js';


export async function getAllProducts(){
    try{
        logger.info('[Product]-[Service]-[getAllProducts]: Fetching all products');
        return await productRepository.findAllProducts();
    }catch(error){
        logger.error(`[Product]-[Service]-[getAllProducts]:Error fetching all products - ${error}`);
        throw new Error('Error fetching all products');
    }
}

export async function getProductById(id:number){
    try{
        logger.info(`[Product]-[Service]-[getProductById]: Fetching product by id (${id})`);
        const product=await productRepository.findProductById(id);
        if(!product){
            logger.warn(`[Product]-[Service]-[getProductById]:Product not found (${id})`);
            throw new Error('Product not found');
        }
        return product;
    }catch(error){
        logger.error(`[Product]-[Service]-[getProductById]:Error fetching product by id (${id}) - ${error}`);
        throw new Error('Error fetching product by id');
    }
}

export async function createProduct(createProductData:CreateProductInputProps){
    try{
        const newProduct=await productRepository.createProduct(createProductData);
        logger.info(`[Product]-[Service]-[createProduct]: Product created successfully (${newProduct.id})`);
        return newProduct;
    }catch(error){
        logger.error(`[Product]-[Service]-[createProduct]:Error creating product - ${error}`);
        throw new Error('Error creating product');
    }
}

export async function updateProduct(id:number,updateProductData:UpdateProductInputProps){
    try{
        logger.info(`[Product]-[Service]-[updateProduct]: Updating product (${id})`);
        const updatedProduct=await productRepository.updateProduct(id,updateProductData);
        logger.info(`[Product]-[Service]-[updateProduct]: Product updated successfully (${updatedProduct?.id})`);
        return updatedProduct;
    }catch(error){
        logger.error(`[Product]-[Service]-[updateProduct]:Error updating product (${id}) - ${error}`);
        throw new Error('Error updating product');
    }
}