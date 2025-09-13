



import type { Request, Response } from "express";
import logger from "../utils/logger.js";
import * as productService from '../services/productService.js';
import type {CreateProductInputProps,UpdateProductInputProps} from '../types/productTypes.js';



/**
 * @openapi
 * /product/{id}:
 *   delete:
 *     tags:
 *       - Product
 *     summary: Delete product by ID
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
 *         description: Product deleted successfully
 *       400:
 *         description: Invalid product ID
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error deleting product
 */
export async function deleteProductById(req:Request,res:Response){
    try{
        const id = Number(req.params.id);
        if(!id || isNaN(id)){
            logger.warn(`[Product]-[ProductController]-[deleteProductById]: Invalid product ID (${req.params.id})`);
            return res.status(400).json({ error: "Invalid product ID" });
        }
        const deletedProduct = await productService.deleteProductById(id);
        if(!deletedProduct){
            logger.warn(`[Product]-[ProductController]-[deleteProductById]: Product not found (${id})`);
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    }catch(error){
        logger.error(`[Product]-[ProductController]-[deleteProductById]: Error occurred - ${error}`);
        res.status(500).json({ error: "Error deleting product" });
    }
}

/**
 * @openapi
 * /product/{id}:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get product by ID
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
 *         description: Product data
 *       400:
 *         description: Invalid product ID
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error retrieving product
 */
export async function getProductById(req:Request,res:Response){
    const id = Number(req.params.id);
    try{
        if(!id || isNaN(id)){
            logger.warn(`[Product]-[ProductController]-[getProductById]: Invalid product ID (${req.params.id})`);
            return res.status(400).json({ error: "Invalid product ID" });
        }
        const product = await productService.productById(Number(req.params.id));
        res.status(200).json(product);
    }catch(error){
        if(error instanceof Error){
            if(error.message === "Product not found"){
                return res.status(404).json({ error: "Product not found" });
            }
        }
        logger.error(`[Product]-[ProductController]-[getProductById]: Error occurred - ${error}`);
        res.status(500).json({ error: "Error retrieving product" });
    }
}

/**
 * @openapi
 * /product:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get all products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 *       404:
 *         description: No products found
 *       500:
 *         description: Error retrieving products
 */
export async function getAllProducts(req:Request,res:Response){
    try{
        const products = await productService.allProducts();
        if(!products || products.length === 0){
            logger.warn(`[Product]-[ProductController]-[getAllProducts]: No products found`);
            return res.status(404).json({ error: "No products found" });
        }
        res.status(200).json(products);
    }catch(error){
        logger.error(`[Product]-[ProductController]-[getAllProducts]: Error occurred - ${error}`);
        res.status(500).json({ error: "Error retrieving products" });
    }
}

/**
 * @openapi
 * /product/update/{id}:
 *   put:
 *     tags:
 *       - Product
 *     summary: Update a product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductInputProps'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid product ID or no update data provided
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error updating product
 */
export async function updateProduct(req:Request,res:Response){
    try{
        const id = Number(req.params.id);
        const updateData:UpdateProductInputProps = req.body;
        if(!updateData || Object.keys(updateData).length === 0){
            logger.warn(`[Product]-[ProductController]-[updateProduct]: No update data provided`);
            return res.status(400).json({ error: "No update data provided" });
        }
        if(!id || isNaN(id)){
            logger.warn(`[Product]-[ProductController]-[updateProduct]: Invalid product ID (${req.params.id})`);
            return res.status(400).json({ error: "Invalid product ID" });
        }
        const updatedProduct = await productService.updateProduct(id, updateData);
        if(!updatedProduct){
            logger.warn(`[Product]-[ProductController]-[updateProduct]: Product not found (${id})`);
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json(updatedProduct);
    }catch(error){
        logger.error(`[Product]-[ProductController]-[updateProduct]: Error occurred - ${error}`);
        res.status(500).json({ error: "Error updating product" });
    }
}

/**
 * @openapi
 * /product/create:
 *   post:
 *     tags:
 *       - Product
 *     summary: Create a new product
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductInputProps'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: No product data provided
 *       500:
 *         description: Error creating product
 */
export async function createProduct(req:Request,res:Response){
    try{
        const productData:CreateProductInputProps = req.body;
        console.log("productData:", productData);
        if(!productData || Object.keys(productData).length === 0){
            logger.warn(`[Product]-[ProductController]-[createProduct]: No product data provided`);
            return res.status(400).json({ error: "No product data provided" });
        }
        const newProduct = await productService.createProduct(productData);
        res.status(201).json(newProduct);
    }catch(error){
        logger.error(`[Product]-[ProductController]-[createProduct]: Error occurred - ${error}`);
        res.status(500).json({ error: "Error creating product" });
    }
}  