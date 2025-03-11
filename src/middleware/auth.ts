import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define the JWT payload interface
interface JWTPayload {
  userId: string;
  email?: string;  // Make it optional if it might not always be present
}

// Define the User interface that matches your Request user property
interface User {
  userId: string;
  email?: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');


    if (!token) {

      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    // Create user object with explicit type
    const user: User = {
      userId: decoded.userId
    };
    
    // Only add email if it exists in decoded token
    if (decoded.email) {
      user.email = decoded.email;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
};
