


import bcrypt from "bcrypt";  // for hashing passwords
import jwt from 'jsonwebtoken';  // for creating and verifying JSON Web Tokens
import logger from "../utils/logger.js";
import redis from "../utils/redisClient.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// create refresh token and accesstoken
export function generateTokens(user: { id: number; email: string }) {
  logger.info(
    `[Config]-[Token]-[generateTokens]: Generating tokens for user (${user.email})`
  );
  const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1d",
  });
  logger.info(
    `[Config]-[Token]-[generateTokens]: Tokens generated successfully for user (${user.email})`
  );
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  logger.info(
    `[Config]-[Token]-[generateTokens]: Refresh token generated successfully for user (${user.email})`
  );
  return { accessToken, refreshToken };
}

// hash password
export async function hashPassword(password: string) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  logger.info(`[Config]-[Token]-[hashPassword]: Password hashed successfully`);
  return hashedPassword;
}

// generate email verification token
export async function generateEmailVerificationToken(user: { id: number; email: string }) {
  logger.info(`[Config]-[Token]-[generateEmailVerificationToken]: Generating email verification token for user (${user.email})`);
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" } // 1 hour valid
  );
}

// validate token
export async function validateToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    logger.info(`[Config]-[Token]-[validateToken]: Token validated successfully`);
    return payload;
  } catch (error) {
    logger.error(`[Config]-[Token]-[validateToken]: Invalid token - ${error}`);
    throw new Error("Invalid token");
  }
}

// calculate time of token and store in redis for blacklist
export async function calculateTimeOfToken(token:string){
  // calculate token its time
  const decoded:any=jwt.decode(token); // decode the JWT without verifying
  const exp=decoded?.exp ? decoded.exp: Math.floor(Date.now()/1000)+900;
  // exp: token'ın bitiş zamanı (epoch saniye cinsinden)
  let ttl=exp-Math.floor(Date.now()/1000);
  // ttl: token'ın şu anki zamana göre kalan süresi (saniye cinsinden)
  if (ttl <= 0) ttl = 1; // Negatif veya sıfırsa 1 saniye olarak ayarla
  await redis.set(`bl_${token}`,"1",{ EX: ttl });
  // Redis'e "bl_token" anahtarıyla ekle, ttl kadar saniye sonra otomatik silinsin
  logger.info(`[Config]-[Token]-[calculateTimeOfToken]: Blacklisted token with ttl=${ttl}s`);
}