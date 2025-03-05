import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getScreen = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('screens')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    res.json(data || {});
  } catch (error) {
    res.status(500).json({ error: 'Error fetching screen' });
  }
};

export const saveScreen = async (req: Request, res: Response) => {
  try {
    const screenData = {
      ...req.body,
      updated_at: new Date().toISOString(),
    };

    // Check if any record exists
    const { data: existingData, error: fetchError } = await supabase
      .from('screens')
      .select('id')
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    let result;
    if (existingData) {
      // Update existing record
      const { data, error } = await supabase
        .from('screens')
        .update(screenData)
        .eq('id', existingData.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('screens')
        .insert([screenData])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error saving screen' });
  }
};
