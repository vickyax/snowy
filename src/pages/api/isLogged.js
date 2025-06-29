import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default async function handler(req, res) {
const { data: { user }, error: userError } = await supabase.auth.getUser();
if (error) return res.status(500).json({ error: error.message });
if(!user) {
    return res.status(500).json({ alert:"User not Logged, please Login again."});
  }

  return res.status(200).json({ alert:"User is Logged in"})
}