// src/controllers/screenController.ts
import { Request, Response } from 'express';
import { 
  collection, query, orderBy, limit, getDocs, 
  addDoc, updateDoc, doc, Timestamp, where 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const getScreen = async (req: Request, res: Response) => {
  try {
    const screensRef = collection(db, 'checkinrewardscreen');
    const q = query(screensRef, orderBy('created_at', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      res.json({});
      return;
    }
    
    const screenDoc = querySnapshot.docs[0];
    const screenData = {
      id: screenDoc.id,
      ...screenDoc.data()
    };
    
    res.json(screenData);
  } catch (error) {
    console.error('Error fetching screen:', error);
    res.status(500).json({ error: 'Error fetching screen' });
  }
};

export const saveScreen = async (req: Request, res: Response) => {
  try {
    const now = Timestamp.now();
    const screenData = {
      ...req.body,
      updated_at: now
    };

    // Check if any record exists
    const screensRef = collection(db, 'checkinrewardscreen');
    const q = query(screensRef, orderBy('created_at', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    
    let result;
    if (!querySnapshot.empty) {
      // Update existing record
      const screenDoc = querySnapshot.docs[0];
      const screenRef = doc(db, 'checkinrewardscreen', screenDoc.id);
      await updateDoc(screenRef, screenData);
      
      result = {
        id: screenDoc.id,
        ...screenData
      };
    } else {
      // Insert new record
      screenData.created_at = now;
      const docRef = await addDoc(screensRef, screenData);
      
      result = {
        id: docRef.id,
        ...screenData
      };
    }

    res.json(result);
  } catch (error) {
    console.error('Error saving screen:', error);
    res.status(500).json({ error: 'Error saving screen' });
  }
};