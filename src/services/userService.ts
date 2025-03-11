// src/services/userService.ts
import { 
  collection, query, where, getDocs, addDoc, updateDoc, doc, 
  Timestamp, getDoc, setDoc 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto, LoginDto, User } from '../types/users';

const JWT_SECRET = process.env.JWT_SECRET || '123123';

export class UserService {
  async createUser(userData: CreateUserDto): Promise<User> {
    const { email, password, full_name } = userData;
    
    // Check if user exists
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('User already exists');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    // Generate verification token
    const verification_token = uuidv4();
    
    // Insert new user
    const now = Timestamp.now();
    const newUserData = {
      email,
      password_hash,
      full_name: full_name || null,
      is_verified: true, // Set to true as per original code
      verification_token,
      created_at: now,
      updated_at: now
    };
    
    const docRef = await addDoc(usersRef, newUserData);
    
    // Send verification email
    await this.sendVerificationEmail(email, verification_token);
    
    // Return user data
    const newUser = {
      id: docRef.id,
      email,
      full_name: full_name || null,
      created_at: now.toDate().toISOString(),
      updated_at: now.toDate().toISOString(),
      is_verified: true
    };
    
    return newUser;
  }

  async login(loginData: LoginDto): Promise<{ user: User; token: string }> {
    const { email, password } = loginData;
    
    // Find user
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Invalid credentials');
    }
    
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, userData.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }
    
    // Check if user is verified
    if (!userData.is_verified) {
      throw new Error('Please verify your email first');
    }
    
    // Generate JWT token
    const token = jwt.sign({ userId: userDoc.id }, JWT_SECRET, {
      expiresIn: '24h',
    });
    
    // Format user data
    const user: User = {
      id: userDoc.id,
      email: userData.email,
      full_name: userData.full_name,
      created_at: userData.created_at.toDate().toISOString(),
      updated_at: userData.updated_at.toDate().toISOString(),
      is_verified: userData.is_verified
    };
    
    return {
      user,
      token,
    };
  }

  async verifyEmail(token: string): Promise<void> {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('verification_token', '==', token));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Invalid verification token');
    }
    
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, 'users', userDoc.id);
    
    await updateDoc(userRef, {
      is_verified: true,
      verification_token: null,
      updated_at: Timestamp.now()
    });
  }

  async requestPasswordReset(email: string): Promise<void> {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Don't reveal if email exists or not for security
      return;
    }
    
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, 'users', userDoc.id);
    
    const resetToken = uuidv4();
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);
    
    await updateDoc(userRef, {
      reset_password_token: resetToken,
      reset_password_expires: Timestamp.fromDate(resetExpires),
      updated_at: Timestamp.now()
    });
    
    await this.sendPasswordResetEmail(email, resetToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('reset_password_token', '==', token));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Invalid or expired reset token');
    }
    
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    
    // Check if token is expired
    const now = new Date();
    const expires = userData.reset_password_expires.toDate();
    if (now > expires) {
      throw new Error('Reset token has expired');
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);
    
    const userRef = doc(db, 'users', userDoc.id);
    await updateDoc(userRef, {
      password_hash,
      reset_password_token: null,
      reset_password_expires: null,
      updated_at: Timestamp.now()
    });
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
