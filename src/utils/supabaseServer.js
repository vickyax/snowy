import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_SUPABASE_DATABASE_URL,
  process.env.NEXT_SUPABASE_KEY // Only used server-side!
);

export default supabase;