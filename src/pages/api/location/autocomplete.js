import path from "path";
import fs from "fs";

export default function handler(req, res) {
  const { q } = req.query;
  if (!q) {
    return res.status(200).json({ suggestions: [] });
  }

  // Read and parse the JSON file
  const filePath = path.join(process.cwd(), "indiancity.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const cityData = JSON.parse(raw);

  // Flatten all cities into a single array
  const allCities = Object.values(cityData).flat();

  // Filter cities by query (case-insensitive, startsWith or includes)
  const suggestions = allCities
    .filter(city => city.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 8); // limit results

  res.status(200).json({ suggestions });
}