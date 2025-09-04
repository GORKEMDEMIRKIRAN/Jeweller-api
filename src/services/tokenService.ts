


import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

import logger from "../utils/logger.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// create refresh token and accesstoken
export function generateTokens(user: { id: number; email: string }) {
  logger.info(
    `[User]-[Service]-[generateTokens]: Generating tokens for user (${user.email})`
  );
  const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1d",
  });
  logger.info(
    `[User]-[Service]-[generateTokens]: Tokens generated successfully for user (${user.email})`
  );
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  logger.info(
    `[User]-[Service]-[generateTokens]: Refresh token generated successfully for user (${user.email})`
  );
  return { accessToken, refreshToken };
}
