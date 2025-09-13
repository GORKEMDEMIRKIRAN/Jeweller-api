



import type { Request, Response } from "express";
import logger from "../utils/logger.js";
import * as customerService from "../services/customerService.js";
import type {CreateCustomerInputProps,UpdateCustomerInputProps} from '../types/customerTypes.js';



/**
 * @openapi
 * /customer/create:
 *   post:
 *     tags:
 *       - Customer
 *     summary: Create a new customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCustomerInputProps'
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       409:
 *         description: Customer already exists
 *       500:
 *         description: Internal server error
 */
export async function createCustomer(req:Request,res:Response){
    try{
        const createCustomerData:CreateCustomerInputProps=req.body;
        const newCustomer=await customerService.createCustomer(createCustomerData);
        logger.info(`[Customer]-[Controller]-[createCustomer]: Created new customer (${newCustomer})`);
        res.status(201).json(newCustomer);
    }catch(error){
        if(error instanceof Error && error.message === "Customer already exists"){
            logger.warn(`[Customer]-[Controller]-[createCustomer]: Customer already exists`);
            return res.status(409).json({ message: "Customer already exists" });
        }
        logger.error(`[Customer]-[Controller]-[createCustomer]: Error occurred - ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
}


/**
 * @openapi
 * /customer/update/{id}:
 *   put:
 *     tags:
 *       - Customer
 *     summary: Update a customer
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
 *             $ref: '#/components/schemas/UpdateCustomerInputProps'
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */
export async function updateCustomer(req:Request,res:Response){
    const { id } = req.params;
    const updateCustomerData:UpdateCustomerInputProps=req.body;
    console.log("updateCustomerData:", updateCustomerData);
    console.log("id:", id);
    try{
        const updatedCustomer=await customerService.updateCustomer(Number(id),updateCustomerData);
        logger.info(`[Customer]-[Controller]-[updateCustomer]: Updated customer (${id})`);
        res.status(200).json(updatedCustomer);
    }catch(error){
        if(error instanceof Error && error.message === "Customer not found"){
            logger.warn(`[Customer]-[Controller]-[updateCustomer]: Customer not found (${id})`);
            return res.status(404).json({ message: "Customer not found" });
        }
        logger.error(`[Customer]-[Controller]-[updateCustomer]: Error occurred - ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
}


/**
 * @openapi
 * /customer/{id}:
 *   get:
 *     tags:
 *       - Customer
 *     summary: Get customer by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Customer data
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */
export async function getCustomerById(req:Request,res:Response){
    const { id } = req.params;
    try {
        const customer= await customerService.getCustomerById(Number(id));
        const {createdAt,...customerData}=customer; // Exclude createdAt and updatedAt
        logger.info(`[Customer]-[Controller]-[getCustomerById]: Retrieved customer (${id})`);
        res.status(200).json(customerData);
    } catch (error) {
        if(error instanceof Error && error.message === "Customer not found"){
            logger.warn(`[Customer]-[Controller]-[getCustomerById]: Customer not found (${id})`);
            return res.status(404).json({ message: "Customer not found" });
        }
        logger.error(`[Customer]-[Controller]-[getCustomerById]: Error occurred - ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
}


/**
 * @openapi
 * /customer:
 *   get:
 *     tags:
 *       - Customer
 *     summary: Get all customers
 *     responses:
 *       200:
 *         description: List of all customers
 *       500:
 *         description: Internal server error
 */
export async function getAllCustomers(req:Request,res:Response){
    try {
        const customers = await customerService.getAllCustomers();
        logger.info(`[Customer]-[Controller]-[getAllCustomers]: Retrieved all customers`);
        res.status(200).json(customers);
    } catch (error) {
        logger.error(`[Customer]-[Controller]-[getAllCustomers]: Error occurred - ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
}


/**
 * @openapi
 * /customer/{id}:
 *   delete:
 *     tags:
 *       - Customer
 *     summary: Delete customer by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       400:
 *         description: No ID provided
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */
export async function deleteCustomerById(req:Request,res:Response){
    const { id } = req.params;
    try {
        if(!id){
            logger.warn(`[Customer]-[Controller]-[deleteCustomer]: No ID provided`);
            return res.status(400).json({ message: "No ID provided" });
        }
        await customerService.deleteCustomerById(Number(id));
        logger.info(`[Customer]-[Controller]-[deleteCustomer]: Deleted customer (${id})`);
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        if(error instanceof Error && error.message === "Customer not found"){
            logger.warn(`[Customer]-[Controller]-[deleteCustomer]: Customer not found (${id})`);
            return res.status(404).json({ message: "Customer not found" });
        }
        logger.error(`[Customer]-[Controller]-[deleteCustomer]: Error occurred - ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
}
