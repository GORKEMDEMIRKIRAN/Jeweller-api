
// import { Request } from "express";

// JWT payload tipini burada tanımla
export interface JwtPayload {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}

// declare module 'express-serve-static-core' {
//   interface Request {
//     user?: JwtPayload;
//   }
// }

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
} 