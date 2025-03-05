import { User } from './user';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        // add other JWT payload properties here
      };
    }
  }
}