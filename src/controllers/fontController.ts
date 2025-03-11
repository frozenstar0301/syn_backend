// src/controllers/fontController.ts
import { Request, Response } from 'express';
import { collection, query, orderBy, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { supabase } from '../config/supabase';

export const getFonts = async (req: Request, res: Response): Promise<void> => {
  try {
    const fontsRef = collection(db, 'fonts');
    const q = query(fontsRef, orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const fonts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(fonts);
  } catch (error) {
    console.error('Error fetching fonts:', error);
    res.status(500).json({ error: 'Failed to fetch fonts' });
  }
};

export const uploadFont = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Use Supabase for storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('fonts')
      .upload(`${Date.now()}-${req.file.originalname}`, req.file.buffer);

    if (uploadError) {
      res.status(500).json({ error: 'Failed to upload to storage' });
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('fonts')
      .getPublicUrl(uploadData.path);

    // Use Firebase for database
    const fontData = {
      url: publicUrl,
      name: req.file.originalname.replace(/\.[^/.]+$/, ''),
      created_at: Timestamp.now()
    };

    const fontsRef = collection(db, 'fonts');
    const docRef = await addDoc(fontsRef, fontData);
    
    // Fetch all fonts after successful upload
    const q = query(fontsRef, orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const allFonts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(201).json(allFonts);
  } catch (error) {
    console.error('Error uploading font:', error);
    res.status(500).json({ error: 'Failed to upload font' });
  }
};
