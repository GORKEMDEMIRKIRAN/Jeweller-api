

import logger from '../utils/logger.js';
import { PrismaClient } from '@prisma/client';

import type {CreateCustomerInputProps,UpdateCustomerInputProps} from '../types/customerTypes.js';


const prisma=new PrismaClient();

/*
    Database functions 
    1-findAllCustomers    = Find all customers
    2-findCustomerById    = Find customer by ID
    3-findCustomerByEmail = Find customer by email
    4-findCustomerByName   = Find customer by name
    5-deleteCustomerById   = Delete customer by ID
    6-createCustomer       = Create new customer
    7-updateCustomer       = Update customer by ID
 */


//----------------------------------------------------------------------------------------
export async function findAllCustomers(){
    try{
        logger.info(`[Customer]-[Repository]-[findAllCustomers]: Finding all customers`)
        return await prisma.customer.findMany();
    }catch(error){
        logger.error(`[Customer]-[Repository]-[findAllCustomers]: Error finding all customers - ${error}`)
    }
}
//----------------------------------------------------------------------------------------
export async function findCustomerById(id:number) {
    try{
        logger.info(`[Customer]-[Repository]-[findCustomerById]: Finding customer by id (${id})`)
        return await prisma.customer.findUnique({
            where: { id }
        });
    }catch(error){
        logger.error(`[Customer]-[Repository]-[findCustomerById]: Error finding customer by id (${id}) - ${error}`)
    }
}
//----------------------------------------------------------------------------------------
export async function findCustomerByEmail(email:string){
    try{
        logger.info(`[Customer]-[Repository]-[findCustomerByEmail]:Finding customer by email (${email})`);
        return await prisma.customer.findUnique({
            where:{email:email}
        });
    }catch(error){
        logger.error(`[Customer]-[Repository]-[findCustomerByEmail]: Error finding customer by email (${email}) - ${error}`)
    }
    
}
//----------------------------------------------------------------------------------------
export async function findCustomerByName(nameSurname:string){
    try{
        logger.info(`[Customer]-[Repository]-[findCustomerByName]: Finding customer by name (${nameSurname})`);
        return await prisma.customer.findMany({
            where:{nameSurname}
        });
    }
    catch(error){
        logger.error(`[Customer]-[Repository]-[findCustomerByName]: Error finding customer by name (${nameSurname}) - ${error}`);
    }
}
//----------------------------------------------------------------------------------------
export async function deleteCustomerById(id:number){
    try{
        logger.info(`[Customer]-[Repository]-[deleteCustomerById]: Deleting customer by id (${id})`);
        return await prisma.customer.delete({
            where: { id }
        });
    }catch(error){
        logger.error(`[Customer]-[Repository]-[deleteCustomerById]: Error deleting customer by id (${id}) - ${error}`);
    }
}
//----------------------------------------------------------------------------------------
export async function createCustomer(
    data:CreateCustomerInputProps
){
    try{
        logger.info(`[Customer]-[Repository]-[createCustomer]: Creating customer (${data.email})`);
        return await prisma.customer.create({
            data
        });
    }catch(error){
        logger.error(`[Customer]-[Repository]-[createCustomer]: Error creating customer (${data.email}) - ${error}`);
    }
}
//----------------------------------------------------------------------------------------
export async function updateCustomer(
    customerId:number,
    data:UpdateCustomerInputProps
){
    try{
        logger.info(`[Customer]-[Repository]-[updateCustomer]: Updating customer by id (${customerId})`);
        return await prisma.customer.update({
            where: { id: customerId },
            data
        });
    }catch(error){
        logger.error(`[Customer]-[Repository]-[updateCustomer]: Error updating customer by id (${customerId}) - ${error}`);
    }
}
//----------------------------------------------------------------------------------------
