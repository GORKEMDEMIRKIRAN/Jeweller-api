
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'; 
import logger from "../utils/logger.js";
import * as userRepository from "../repositories/userRepository.js";
import { sendEmailFunction } from "../config/email.js";
import {generateEmailVerificationToken,hashPassword,validateToken} from '../config/token.js';




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

export async function sendEmail(to: string) {
  try{
    const user= await userRepository.findUserByEmail(to);
    if(!user){
      logger.warn(`[Auth]-[Service]-[sendEmail]: User not found (${to})`);
      throw new Error("User not found");
    }
    const verificationToken = await generateEmailVerificationToken({ id: user.id, email: user.email });
    logger.info(`[Auth]-[Service]-[sendEmail]: Created verification token for email to (${to})`);
    // Mail içeriğinde bu linki kullan
    await sendEmailFunction(to, verificationToken, "/auth/verify-email", "Verify your email", "Click on the button below to verify your email", "Verify Email");
    logger.info(`[Auth]-[Service]-[sendEmail]: Sending email to (${to})`);

  }catch(error){
    logger.error(`[Auth]-[Service]-[sendEmail]: Error sending email to (${to}) - ${error}`);
    throw new Error("Error sending email");
  }
}

export async function verifyEmail(token: string) {
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    if(!payload || typeof payload !== 'object' || !('id' in payload) || !('email' in payload)){
      logger.warn(`[Auth]-[Service]-[verifyEmail]: Invalid token payload`);
      throw new Error("Invalid token payload");
    }
    const user = await userRepository.findUserById(payload.id as number);
    if (!user) {
      logger.warn(`[Auth]-[Service]-[verifyEmail]: User not found (${payload.id})`);
      throw new Error("User not found");
    }
    await userRepository.updateUser(user.id, {isEmailVerified: true});
    logger.info(`[Auth]-[Service]-[verifyEmail]: Email verified successfully for user (${user.email})`);
    return;
  }catch(error){
    logger.error(`[Auth]-[Service]-[verifyEmail]: Invalid or expired token - ${error}`);
    throw new Error("Invalid or expired token");
  }
}

export async function sendForgotPasswordEmail(email: string) {
  try{
    // 1 - find user by email
    const user= await userRepository.findUserByEmail(email);
    if(!user){
      logger.warn(`[Auth]-[Service]-[sendForgotPasswordEmail]: User not found (${email})`);
      throw new Error("User not found");
    }
    // 2 - create reset token
    const resetToken = await generateEmailVerificationToken({ id: user.id, email: user.email });
    console.log('resetToken:', resetToken);
    logger.info(`[Auth]-[Service]-[sendForgotPasswordEmail]: Created reset token for email to (${email})`);
    // 3 - send email with token
    await sendEmailFunction(email,resetToken,"/auth/reset-password","Password Reset","Click on the button below to reset your password","Reset Password");
    logger.info(`[Auth]-[Service]-[sendForgotPasswordEmail]: Sending forgot password email to (${email})`);

  }catch(error){
    logger.error(`[Auth]-[Service]-[sendForgotPasswordEmail]: Error sending forgot password email to (${email}) - ${error}`);
    throw new Error("Error sending forgot password email");
  }
}

export async function resetForgotPassword(token: string, newPassword: string) {
  try{
    // 1 - validate token
    const payload = await validateToken(token);
    if(!payload || typeof payload !== 'object' || !('id' in payload) || !('email' in payload)){
      logger.warn(`[Auth]-[Service]-[resetForgotPassword]: Invalid token payload`);
      throw new Error("Invalid token payload");
    } 
    // 2 - find user by id from token
    const user = await userRepository.findUserById(payload.id as number);
    if (!user) {
      logger.warn(`[Auth]-[Service]-[resetForgotPassword]: User not found (${payload.id})`);
      throw new Error("User not found");
    }
    // 3 - hash new password and update user
    const hashedPassword = await hashPassword(newPassword);
    await userRepository.updateUser(user.id, { password: hashedPassword });
    logger.info(`[Auth]-[Service]-[resetForgotPassword]: Password reset successfully for user (${user.email})`);
    return;
  }catch(error){
    logger.error(`[Auth]-[Service]-[resetForgotPassword]: Invalid or expired token - ${error}`);
    throw new Error("Invalid or expired token");
  }
}




