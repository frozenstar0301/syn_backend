// src/types/express/index.d.ts
declare namespace Express {
    export interface Request {
      user?: {
        userId: string;
        email?: string;  // Make sure this matches your JWT payload
      }
    }
  }
  