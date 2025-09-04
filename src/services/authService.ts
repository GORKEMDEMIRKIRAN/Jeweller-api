
import bcrypt from "bcrypt";


import logger from "../utils/logger.js";
import * as authRepository from "../repositories/authRepository.js";
import * as userRepository from "../repositories/userRepository.js";




export async function loginUser(email: string, password: string) {
  logger.info(`[Auth]-[Service]-[loginUser]: Logging in user (${email})`);
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    logger.warn(`[Auth]-[Service]-[loginUser]: User not found (${email})`);
    throw new Error("user not found");
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    logger.warn(`[Auth]-[Service]-[loginUser]: Invalid password (${email})`);
    throw new Error("Invalid password");
  }
  return user;
}

