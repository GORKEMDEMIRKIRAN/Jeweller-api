


import bcrypt from "bcrypt";
import { hashPassword } from "../config/token.js";
import logger from "../utils/logger.js";
import * as token from '../config/token.js';
import * as userRepository from "../repositories/userRepository.js";
import * as customerRepository from "../repositories/customerRepository.js";
import type {RegisterUserInputProps,UpdateUserInputProps} from '../types/userTypes.js';




export async function registerUser({
  email,
  password,
  isEmailVerified,
  isPhoneVerified,
  userTypeId,
  username,
  phone,
  accessToken,
  refreshToken,
}: RegisterUserInputProps) {
  // control
  const userData: RegisterUserInputProps = {
    email,
    password,
    userTypeId,
  };
  if (username !== undefined) userData.username = username;
  if (phone !== undefined) userData.phone = phone;
  if (isEmailVerified !== undefined) userData.isEmailVerified = isEmailVerified;
  if (isPhoneVerified !== undefined) userData.isPhoneVerified = isPhoneVerified;
  if (accessToken !== undefined) userData.accessToken = accessToken;
  if (refreshToken !== undefined) userData.refreshToken = refreshToken;

  logger.info(`[User]-[Service]-[registerUser]: Registering user (${email})`);
  // Check if user already exists
  const existing = await userRepository.findUserByEmail(email);
  if (existing) {
    logger.warn(
      `[User]-[Service]-[registerUser]: User already exists (${email})`
    );
    throw new Error("User already exists");
  }
  logger.info(
    `[User]-[Service]-[registerUser]: User registered successfully (${email})`
  );
  // register user
  return userRepository.createUser({...userData, password: await token.hashPassword(password)});
}

export async function deleteUser(id: number) {
  logger.info(`[User]-[Service]-[deleteUser]: Deleting user (${id})`);
  const user = await userRepository.findUserById(id);
  if (!user) {
    logger.warn(`[User]-[Service]-[deleteUser]: User not found (${id})`);
    throw new Error("User not found");
  }
  logger.info(`[User]-[Service]-[deleteUser]: User deleted successfully (${id})`);
  await customerRepository.deleteAllCustomersByUserId(user.id);
  await userRepository.deleteUserById(user.id);
  // return deleted user info
  return user;
}

export async function getUserById(id:number){
  logger.info(`[User]-[Service]-[getUserById]: Fetching user (${id})`);
  const userInfo=await userRepository.findUserById(id);
  if(!userInfo){
    logger.warn(`[User]-[Service]-[getUserById]: User not found (${id})`);
    throw new Error("User not found");
  }
  return userInfo;
}

export async function getAllUsers(){
  logger.info(`[User]-[Service]-[getAllUsers]: Fetching all users`);
  return await userRepository.findAllUsers();
}

export async function updateUser(
  id: number,
  {  email,
     password,
     isEmailVerified,
      isPhoneVerified,
      phoneVerificationCode,
      phoneCodeExpiresAt,
      userTypeId,
      username,
      phone,
      accessToken,
      refreshToken }: UpdateUserInputProps
) {
  const updateData: UpdateUserInputProps = {};

  
  if (email !== undefined) updateData.email = email;
  if (password !== undefined) updateData.password = await hashPassword(password);
  if (isEmailVerified !== undefined) updateData.isEmailVerified = isEmailVerified;
  if (isPhoneVerified !== undefined) updateData.isPhoneVerified = isPhoneVerified;
  if (phoneVerificationCode !== undefined) updateData.phoneVerificationCode = phoneVerificationCode;
  if (phoneCodeExpiresAt !== undefined) updateData.phoneCodeExpiresAt = phoneCodeExpiresAt;
  if (userTypeId !== undefined) updateData.userTypeId = userTypeId;
  if (username !== undefined) updateData.username = username;
  if (phone !== undefined) updateData.phone = phone;
  if (accessToken !== undefined) updateData.accessToken = accessToken;
  if (refreshToken !== undefined) updateData.refreshToken = refreshToken;

  logger.info(`[User]-[Service]-[updateUser]: Updating user (${id})`);
  // Validate user existence
  const user = await userRepository.findUserById(id);
  if (!user) {
    logger.warn(`[User]-[Service]-[updateUser]: User not found (${id})`);
    throw new Error("User not found");
  }
  logger.info(`[User]-[Service]-[updateUser]: User found (${id})`);
  // Update user
  return userRepository.updateUser(id, updateData);
}