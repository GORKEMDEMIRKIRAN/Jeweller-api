import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type{JwtPayload} from '../types/express.js';
import logger from "../utils/logger.js";
import redis from "../utils/redisClient.js";


export async function requestAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const secret = process.env.JWT_SECRET;
  if (!authHeader) {
    logger.warn(`[Auth]-[Middleware]-[RequestAuth]: No token`);
    return res.status(401).json({ message: "No token" });
  }
  if (!secret) {
    logger.error(`[Auth]-[Middleware]-[RequestAuth]: JWT secret not configured`);
    return res.status(500).json({ message: "JWT secret not configured" });
  }
  let token = null;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.slice(7).trim();
  } else {
    token=authHeader.trim();
    logger.warn(`[Auth]-[Middleware]-[RequestAuth]: Invalid token format`);
    return res.status(401).json({ message: "Invalid token format" });
  }
  if (!token) {
    logger.warn(`[Auth]-[Middleware]-[RequestAuth]: No token provided`);
    return res.status(401).json({ message: "No token provided" });
  }

  
  // ADDED BLACKLIST CHECK
  try {
    const isBlacklisted = await redis.get(`bl_${token}`);
    if (isBlacklisted) {
      logger.warn(`[Auth]-[Middleware]-[RequestAuth]: Token is blacklisted`);
      return res.status(401).json({ message: "Token is blacklisted" });
    }
  } catch (err) {
    logger.error(`[Auth]-[Middleware]-[RequestAuth]: Redis blacklist check failed - ${err}`);
    // İstersen burada 500 dönebilirsin; şu an devam ediyor
  }


  try {
    const payload = jwt.verify(token, secret as string);
    logger.info(`[Auth]-[Middleware]-[RequestAuth]: Token verified successfully`);
    if (typeof payload === "object" && payload && "id" in payload && "email" in payload) {
      req.user = payload as JwtPayload;
      next();
    } else {
      logger.warn(`[Auth]-[Middleware]-[RequestAuth]: Invalid token payload`);
      return res.status(401).json({ message: "Invalid token payload" });
    }
  } catch (error) {
    logger.error(`[Auth]-[Middleware]-[RequestAuth]: Invalid token - ${error}`);
    return res.status(401).json({ message: "Invalid token" });
  }
}
