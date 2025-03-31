import { Request, Response } from 'express';
import { collection, query, orderBy, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db, adminStorage } from '../config/firebase';
import * as admin from 'firebase-admin';

export const getImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const imagesRef = collection(db, 'images');
    const q = query(imagesRef, orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const images = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Get the bucket name directly from the admin app configuration
    const bucketName = admin.app().options.storageBucket;
    
    if (!bucketName) {
      throw new Error('Storage bucket name is not available in the admin app configuration');
    }
    
    // Get the bucket with explicit name
    const bucket = admin.storage().bucket(bucketName);
    
    // Create a file name with timestamp to ensure uniqueness
    const filename = `images/${Date.now()}-${req.file.originalname}`;
    
    // Create a file object
    const file = bucket.file(filename);
    
    // Upload the file buffer
    await file.save(req.file.buffer, {
      contentType: req.file.mimetype,
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          originalName: req.file.originalname
        }
      }
    });
    
    // Make the file publicly accessible
    await file.makePublic();
    
    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;

    // Store metadata in Firestore
    const imageData = {
      url: publicUrl,
      name: req.file.originalname,
      contentType: req.file.mimetype,
      size: req.file.size,
      created_at: Timestamp.now()
    };

    const imagesRef = collection(db, 'images');
    const docRef = await addDoc(imagesRef, imageData);
    
    // Fetch all images after successful upload
    const q = query(imagesRef, orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const allImages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(201).json(allImages);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};
