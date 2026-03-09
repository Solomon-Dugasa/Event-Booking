import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    }
}

export const protect = (
    req: AuthRequest, 
    res: Response, 
    next: NextFunction ) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const token = authHeader.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, role: string };
            req.user = decoded

            next()
        } catch (error) {
            res.status(401).json({ message: "Unauthorized", error });
        }
    }

    // Middleware to check if user is admin
    export const adminOnly = (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    )=>{
        if ( req.user?.role !== "admin") {
            return res.status(403).json({ message: "Admin access only" });
        }
        next()
    }