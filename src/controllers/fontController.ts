import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getFonts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('fonts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: 'Failed to fetch fonts' });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fonts' });
  }
};

export const uploadFont = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

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

    const { error: insertError } = await supabase
      .from('fonts')
      .insert([
        {
          url: publicUrl,
          name: req.file.originalname.replace(/\.[^/.]+$/, ''),
        },
      ]);

    if (insertError) {
      res.status(500).json({ error: 'Failed to save to database' });
      return;
    }

    // Fetch all fonts after successful upload
    const { data: allFonts, error: fetchError } = await supabase
      .from('fonts')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      res.status(500).json({ error: 'Failed to fetch fonts after upload' });
      return;
    }

    res.status(201).json(allFonts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload font' });
  }
};
