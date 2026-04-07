import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET!;

// Extend tipe Request Express agar bisa menampung data user
interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (allowedRoles?: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, jwtSecret) as any;
      req.user = decoded; // Simpan data user ke request

      // Jika ada batasan role, cek di sini
      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid or expired token" });
    }
  };
};
