// pages/api/technicians.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default async function handler(req, res) {
  const { location, service } = req.query;
  res.setHeader("Cache-Control", "no-store"); // Disable caching for this endpoint
 const { data, error } = await supabase.from("technicians").select("*");
 
  if (error) return res.status(500).json({ error: error.message });

  const filtered = data.filter(
    tech =>(
      (!location || tech.city.toLowerCase().includes(location.toLowerCase())) &&
      (!service || tech.expertise.some(exp => exp.toLowerCase().includes(service.toLowerCase())))
    )
  );

  res.status(200).json(filtered);
}
