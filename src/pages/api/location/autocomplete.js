export default async function handler(req, res) {
  const { q } = req.query;
  const apiKey = process.env.LOCATIONIQ_API_KEY;

  if (!q) {
    return res.status(400).json({ suggestions: [] });
  }

  try {
    const response = await fetch(
      `https://us1.locationiq.com/v1/autocomplete?key=${apiKey}&q=${encodeURIComponent(q)}&limit=5&dedupe=1&normalizecity=1&tag=place:city`
    );

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Unexpected response from LocationIQ:", data);
      return res.status(500).json({ suggestions: [] });
    }

    const cities = data.map(place => place.display_name);
    res.status(200).json({ suggestions: cities });

  } catch (error) {
    console.error("Autocomplete error:", error);
    res.status(500).json({ suggestions: [] });
  }
}
