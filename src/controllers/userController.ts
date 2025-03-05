// src/controllers/userController.ts
import { Request, Response } from 'express';
import { UserService } from '../services/userService';

const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({
        message: 'User created successfully. Please check your email for verification.',
        user,
      });
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { user, token } = await userService.login(req.body);
      res.json({ user, token });
    } catch (error:any) {
      res.status(401).json({ error: error.message });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      await userService.verifyEmail(req.params.token);
      res.json({ message: 'Email verified successfully' });
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  }

  async requestPasswordReset(req: Request, res: Response) {
    try {
      await userService.requestPasswordReset(req.body.email);
      res.json({ message: 'Password reset email sent' });
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      await userService.resetPassword(req.params.token, req.body.password);
      res.json({ message: 'Password reset successfully' });
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  }
}
