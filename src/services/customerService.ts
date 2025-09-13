


import logger from '../utils/logger.js';
import * as customerRepository from '../repositories/customerRepository.js';
import type {CreateCustomerInputProps,UpdateCustomerInputProps} from '../types/customerTypes.js';


export async function getAllCustomers(){
    try{
        logger.info(`[Customer]-[Service]-[getAllCustomers]: Getting all customers`)
        return await customerRepository.findAllCustomers();
    }catch(error){
        logger.error(`[Customer]-[Service]-[getAllCustomers]: Error getting all customers - ${error}`)
        throw new Error('Internal server error');
    }
}

export async function getCustomerById(id:number){
    try{
        logger.info(`[Customer]-[Service]-[getCustomerById]: Getting customer by id (${id})`)
        const customer=await customerRepository.findCustomerById(id);
        if(!customer){
            logger.warn(`[Customer]-[Service]-[getCustomerById]: Customer not found (${id})`)
            throw new Error('Customer not found');
        }
        return customer;
    }catch(error){
        logger.error(`[Customer]-[Service]-[getCustomerById]: Error getting customer by id (${id}) - ${error}`)
        throw new Error('Internal server error');
    }
}

export async function createCustomer(createCustomerData:CreateCustomerInputProps){
    try{
        const {email}=createCustomerData
        logger.info(`[Customer]-[Service]-[createCustomer]: Creating customer (${email})`)
        const existingCustomer=await customerRepository.findCustomerByEmail(email);
        if(existingCustomer){
            logger.warn(`[Customer]-[Service]-[createCustomer]: Customer already exists (${email})`)
            throw new Error('Customer already exists');
        }
        return await customerRepository.createCustomer(createCustomerData);
    }catch(error){
        logger.error(`[Customer]-[Service]-[createCustomer]: Error creating customer - ${error}`)
        throw new Error('Internal server error');
    }
}

export async function updateCustomer(id:number,updateCustomerData:UpdateCustomerInputProps){
    try{
        logger.info(`[Customer]-[Service]-[updateCustomer]: Updating customer (${id})`)
        const existingCustomer=await customerRepository.findCustomerById(id);
        if(!existingCustomer){
            logger.warn(`[Customer]-[Service]-[updateCustomer]: Customer not found (${id})`)
            throw new Error('Customer not found');
        }
        return await customerRepository.updateCustomer(id,updateCustomerData);
    }catch(error){
        logger.error(`[Customer]-[Service]-[updateCustomer]: Error updating customer (${id}) - ${error}`)
        throw new Error('Internal server error');
    }
}

export async function deleteCustomerById(id:number){
    try{
        logger.info(`[Customer]-[Service]-[deleteCustomerById]: Deleting customer (${id})`)
        const existingCustomer=await customerRepository.findCustomerById(id);
        if(!existingCustomer){
            logger.warn(`[Customer]-[Service]-[deleteCustomerById]: Customer not found (${id})`)
            throw new Error('Customer not found');
        }
        await customerRepository.deleteCustomerById(id);
        logger.info(`[Customer]-[Service]-[deleteCustomerById]: Deleted customer (${id})`)
    }catch(error){
        logger.error(`[Customer]-[Service]-[deleteCustomerById]: Error deleting customer (${id}) - ${error}`)
        throw new Error('Internal server error');
    }
}
