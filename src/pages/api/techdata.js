import supabase from "@/utils/supabaseServer"; // This can use your service key (not public)

export default async function handler(req, res) {
    res.setHeader("Cache-Control", "no-store");
  const { data, error } = await supabase.from("technicians").select("*");
  
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
}