



import logger from '../utils/logger.js';
import { PrismaClient } from '@prisma/client';

import type {RegisterUserInputProps,UpdateUserInputProps} from '../types/userTypes.js';

const prisma=new PrismaClient();


/*
  Database functions
  1-findAllUsers        = Find all users
  2-findUserById        = Find user by ID  
  3-findUserByEmail     = Find user by email
  4-findUserByName      = Find user by name
  5-deleteUserById      = Delete user by ID
  6-createUser          = Create new user
  7-updateUser          = Update user by ID
 */

//----------------------------------------------------------------------------------------
export async function findAllUsers(){
    try{
        logger.info(`[User]-[Repository]-[findAllUsers]: Finding all users`)
        return await prisma.user.findMany();
    }catch(error){
        logger.error(`[User]-[Repository]-[findAllUsers]: Error finding all users - ${error}`)
    }
}
//----------------------------------------------------------------------------------------
export async function findUserById(id:number){
    try{
        logger.info(`[User]-[Repository]-[findUserById]: Finding user by id (${id})`)
        return await prisma.user.findUnique({
            where: { id }
        });
    }catch(error){
        logger.error(`[User]-[Repository]-[findUserById]: Error finding user by id (${id}) - ${error}`)
    }
}
//----------------------------------------------------------------------------------------
export async function findUserByEmail(email:string){
    try{
        logger.info(`[User]-[Repository]-[findUserByEmail]: Finding user by email (${email})`)
        return await prisma.user.findUnique({
            where: { email:email }
        });
    }catch(error){
        logger.error(`[User]-[Repository]-[findUserByEmail]: Error finding user by email (${email}) - ${error}`)
    }
}
//----------------------------------------------------------------------------------------
export async function findUserByName(username:string){
    try{
        logger.info(`[User]-[Repository]-[findUserByName]: Finding user by name (${username})`)
        return await prisma.user.findMany({
            where: { username: username }
        });
    }catch(error){
        logger.error(`[User]-[Repository]-[findUserByName]: Error finding user by name (${username}) - ${error}`)
    }
}
//----------------------------------------------------------------------------------------
export async function deleteUserById(id:number){
    try{
        logger.info(`[User]-[Repository]-[deleteUserById]: Deleting user by id (${id})`)
        return await prisma.user.delete({
            where: { id }
        });
    }catch(error){
        logger.error(`[User]-[Repository]-[deleteUserById]: Error deleting user by id (${id}) - ${error}`)
    }
}
//----------------------------------------------------------------------------------------
export async function createUser(data:RegisterUserInputProps){
    try{
        logger.info(`[User]-[Repository]-[createUser]: Creating user (${data.email})`)
        return await prisma.user.create({
            data
        });
    }catch(error){
        logger.error(`[User]-[Repository]-[createUser]: Error creating user (${data.email}) - ${error}`)
    }
}
//----------------------------------------------------------------------------------------
export async function updateUser(
    userId:number,
    data:UpdateUserInputProps
){
    try{
        logger.info(`[User]-[Repository]-[updateUser]: Updating user (${userId})`)
        return await prisma.user.update({
            where: { id:userId },
            data
        });
    }catch(error){
        logger.error(`[User]-[Repository]-[updateUser]: Error updating user (${userId}) - ${error}`)
    }
}
//----------------------------------------------------------------------------------------