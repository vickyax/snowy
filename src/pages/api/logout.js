import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  // This will only work if you pass the user's session/access token in the request
  // For client-side logout, see below
  await supabase.auth.signOut();
  return res.status(200).json({ alert: "User Successfully Logged out." });
}