import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export default class AuthMiddleware {
  
  public authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123') as any;
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  }

  public authorize(...allowedRoles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
      }

      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({ 
          message: 'Access denied',
          yourRole: req.user.role,
          allowedRoles: allowedRoles
        });
        return;
      }

      next();
    };
  }
}