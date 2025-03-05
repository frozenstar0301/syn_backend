// src/services/userService.ts
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CreateUserDto, LoginDto, User } from '../types/users';
import { supabase } from '../config/supabase';

const JWT_SECRET = process.env.JWT_SECRET || '123123';

export class UserService {
  async createUser(userData: CreateUserDto): Promise<User> {
    const { email, password, full_name } = userData;


    
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    console.log("existingUser:: ", existingUser);
    if (existingUser) {
      throw new Error('User already exists');
    }


    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);



    // Insert new user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password_hash,
          full_name,
          is_verified: true,
        },
      ])
      .select()
      .single();

      console.log(newUser);
    if (error) throw error;
    if (!newUser) throw new Error('Failed to create user');

    // Send verification email
    await this.sendVerificationEmail(newUser.email, newUser.verification_token);

    return newUser;
  }

  async login(loginData: LoginDto): Promise<{ user: User; token: string }> {
    const { email, password } = loginData;

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Check if user is verified
    if (!user.is_verified) {
      throw new Error('Please verify your email first');
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '24h',
    });

    return {
      user,
      token,
    };
  }

  async verifyEmail(token: string): Promise<void> {
    const { data: user, error } = await supabase
      .from('users')
      .update({ is_verified: true, verification_token: null })
      .eq('verification_token', token)
      .select()
      .single();

    if (error || !user) {
      throw new Error('Invalid verification token');
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    const resetToken = crypto.randomUUID();
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);

    const { error } = await supabase
      .from('users')
      .update({
        reset_password_token: resetToken,
        reset_password_expires: resetExpires,
      })
      .eq('email', email);

    if (error) throw error;

    await this.sendPasswordResetEmail(email, resetToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    const { error } = await supabase
      .from('users')
      .update({
        password_hash,
        reset_password_token: null,
        reset_password_expires: null,
      })
      .eq('reset_password_token', token)
      .gt('reset_password_expires', new Date());

    if (error) throw new Error('Invalid or expired reset token');
  }

  private async sendVerificationEmail(email: string, token: string) {
    // Implement email sending logic using nodemailer
    // This is just a placeholder
    console.log(`Verification email sent to ${email} with token ${token}`);
  }

  private async sendPasswordResetEmail(email: string, token: string) {
    // Implement email sending logic using nodemailer
    // This is just a placeholder
    console.log(`Password reset email sent to ${email} with token ${token}`);
  }
}
