import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: 'Failed to fetch images' });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(`${Date.now()}-${req.file.originalname}`, req.file.buffer);

    if (uploadError) {
      res.status(500).json({ error: 'Failed to upload to storage' });
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(uploadData.path);

    const { error: insertError } = await supabase
      .from('images')
      .insert([
        {
          url: publicUrl,
          name: req.file.originalname,
        },
      ]);

    if (insertError) {
      res.status(500).json({ error: 'Failed to save to database' });
      return;
    }

    // Fetch all images after successful upload
    const { data: allImages, error: fetchError } = await supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      res.status(500).json({ error: 'Failed to fetch images after upload' });
      return;
    }

    res.status(201).json(allImages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
};
