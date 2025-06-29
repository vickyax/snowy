import path from "path";
import fs from "fs";

export default function handler(req, res) {
  const { q } = req.query;
  if (!q || q.length < 1) {
    return res.status(200).json({ suggestions: [] });
  }

  const filePath = path.join(process.cwd(), "src/pages/api/location/indiancity.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const cityData = JSON.parse(raw);

  const allStates = Object.keys(cityData);
  const suggestions = allStates
    .filter(state => state.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 8);

  res.status(200).json({ suggestions });
}