import { createClient } from '@supabase/supabase-js';

export const createSupabaseClient = (url: string, key: string) =>
  createClient(url, key);
