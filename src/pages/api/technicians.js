// pages/api/technicians.js
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
