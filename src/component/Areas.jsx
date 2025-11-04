// components/CitySelector.js
"use client";

import { useState, useEffect } from 'react';
import Drop from '@mui/icons-material/ArrowDropDown';
const tamilNaduCities = [
  "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Ambattur",
  "Tirunelveli", "Tiruppur", "Avadi", "Tiruvottiyur", "Thoothukkudi",
  "Nagercoil", "Thanjavur", "Pallavaram", "Dindigul", "Vellore", "Tambaram",
  "Cuddalore", "Kancheepuram", "Alandur", "Erode", "Tiruvannamalai",
  "Kumbakonam", "Rajapalayam", "Kurichi", "Madavaram", "Pudukkottai", "Hosur",
  "Ambur", "Karaikkudi", "Neyveli", "Nagapattinam", "Udhagamandalam",
  "Kodaikanal", "Mamallapuram", "Kanyakumari", "Rameswaram", "Velankanni"
];

export default function CitySelector() {
  const [detectedCity, setDetectedCity] = useState('Coimbatore');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   // Check if the Geolocation API is available in the browser
  //   if (!navigator.geolocation) {
  //     setError("Geolocation is not supported by your browser.");
  //     setLoading(false);
  //     return;
  //   }

  //   const handleSuccess = async (position) => {
  //     const { latitude, longitude } = position.coords;

  //     try {
  //       // Use OpenStreetMap's Nominatim API for reverse geocoding
  //       const response = await fetch(
  //         `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
  //       );
  //       const data = await response.json();

  //       // Extract city from the address object. It can be in 'city', 'town', or 'village'.
  //       const cityFromAPI = data.address.city || data.address.town || data.address.village;
        
  //       if (cityFromAPI) {
  //         // Find a matching city in your list (case-insensitive)
  //         const matchedCity = tamilNaduCities.find(
  //           (tnCity) => tnCity.toLowerCase() === cityFromAPI.toLowerCase()
  //         );

  //         if (matchedCity) {
  //           setDetectedCity(matchedCity);
  //         } else {
  //           setError(`Your city (${cityFromAPI}) is not on our list of serviceable areas.`);
  //         }
  //       } else {
  //         setError("Could not determine your city from your location.");
  //       }
  //     } catch (err) {
  //       setError("Failed to fetch city data. Please select a city manually.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const handleError = (err) => {
  //     setError(`Location access denied: ${err.message}. Please select a city manually.`);
  //     setLoading(false);
  //   };

  //   // Request the user's location
  //   navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  // }, []); // The empty dependency array ensures this runs only once on mount

  return (
    <div>
      <select 
        value={detectedCity} 
        onChange={(e) => {
          setDetectedCity(e.target.value);
          setError(null); // Clear error on manual selection
        }}
        className="appearance-none lg:text-lg"
      >
       
        {tamilNaduCities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
{/* Custom arrow */}
  <div className="pointer-events-none absolute inset-y-0 right-8 flex items-center">
    <svg
      className="w-4 h-4 text-gray-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</div>
  );
}