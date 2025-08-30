



import type { Request, Response, NextFunction } from "express";
export function requestAuth(req: Request, res: Response, next: NextFunction) {
    // İstek doğrulama işlemleri burada yapılacak

    // Bearer token controller
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();

    
}
