import { Request, Response } from 'express';
import { collection, query, orderBy, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

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

    // Create a storage reference
    const storageRef = ref(storage, `images/${Date.now()}-${req.file.originalname}`);
    
    // Upload file to Firebase Storage
    const snapshot = await uploadBytes(storageRef, req.file.buffer);
    
    // Get the download URL
    const publicUrl = await getDownloadURL(snapshot.ref);

    // Use Firebase for database
    const imageData = {
      url: publicUrl,
      name: req.file.originalname,
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
