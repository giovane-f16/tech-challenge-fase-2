import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET;

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!SECRET) {
        res.status(500).json({ error: "JWT_SECRET não configurado no ambiente." });
        return;
    }

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                res.status(403).json({ error: "Token inválido ou expirado." });
                return;
            }
            next();
        });
    } else {
        res.status(401).json({ error: "Token de autenticação não fornecido." });
    }
}