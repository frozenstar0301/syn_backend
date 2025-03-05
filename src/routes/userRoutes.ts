// src/routes/userRoutes.ts
import express, { Request, Response } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const userController = new UserController();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/verify-email/:token', userController.verifyEmail);
router.post('/forgot-password', userController.requestPasswordReset);
router.post('/reset-password/:token', userController.resetPassword);

// Protected routes
router.get('/profile', authMiddleware, (req: Request, res: Response) => {
  // TypeScript now knows about req.user
  res.json({ user: req.user });
});

export default router;
