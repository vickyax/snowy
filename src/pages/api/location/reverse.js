// /pages/api/location/reverse.js

export default async function handler(req, res) {
  const { lat, lon } = req.query;
  const apiKey = process.env.LOCATIONIQ_API_KEY;

  try {
    const response = await fetch(`https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${lat}&lon=${lon}&format=json`);
    const data = await response.json();
    res.status(200).json({ city: data.address.city || data.address.town || data.address.village || data.address.state || 'Your Area' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch location data' });
  }
}
