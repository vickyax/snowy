import React, { useEffect, useState } from 'react';
import TechnicianCard from '@/component/components/TechnicianCard'; // Adjust import as needed
import '@/app/globals.css';
const TechnicianPage = () => {
  const [userLocation, setUserLocation] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [geoError, setGeoError] = useState('');
  const [showTechRegistration, setShowTechRegistration] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  const services = [
    'AC Repair', 'Refrigerator', 'Washing Machine',
    'Oven', 'Computer', 'Mobile'
  ];
const getLocation = async () => {
  try {
    const pos = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );

    const { latitude, longitude } = pos.coords;

    const response = await fetch(`/api/location/reverse?lat=${latitude}&lon=${longitude}`);
    const data = await response.json();
    setUserLocation(data.city);
    setGeoError('');
  } catch (err) {
    console.error(err);
    setGeoError("Couldn't detect location. Please enter manually.");
  }
};

const handleLocationChange = async (e) => {
  const input = e.target.value;
  setUserLocation(input);

  if (input.length < 2) {
    setLocationSuggestions([]);
    return;
  }

  try {
    const res = await fetch(`/api/location/autocomplete?q=${input}`);
    const data = await res.json();
    setLocationSuggestions(data.suggestions);
  } catch (err) {
    console.error('Autocomplete error:', err);
  }
};

const loadTechnicians = async () => {
  try {
    setLoading(true);
    const response = await fetch(`/api/technicians?location=${userLocation}&service=${selectedService}`);
    const data = await response.json();
    setTechnicians(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
   useEffect(() => {
  getLocation().then(loadTechnicians);
}, []);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="lg:text-3xl text-2xl font-bold text-gray-900">
            Find Certified Technicians
          </h1>
            <a
        href="/"
        className="absolute right-6 mx-auto top-10 -translate-y-1/2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-sm flex items-center"
      >
        <span className="mr-2">🏠</span> Home
      </a>
          {/* Location & Service Selector */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-black">
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <div className="relative">
                <input
                    type="text"
                    value={userLocation} // Display only the city name
                    onChange={handleLocationChange}
                    className="flex-1 rounded-l-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 w-full"
                    placeholder="Enter your city"
                />
                {locationSuggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded shadow-md max-h-40 overflow-auto">
                    {locationSuggestions.map((suggestion, idx) => (
                        <li
                        key={idx}
                        className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                        onClick={() => {
                            setUserLocation(suggestion.split(',')[0].trim());
                            setLocationSuggestions([]);
                        }}
                        >
                        {suggestion}
                        </li>
                    ))}
                    </ul>
                )}
                </div>

              {geoError && <p className="mt-1 text-sm text-red-600">{geoError}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Service Needed</label>
              <select
                value={selectedService}
                onChange={e => setSelectedService(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Service</option>
                {services.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div className="self-end">
              <button
                onClick={loadTechnicians}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin inline-block w-8 h-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Finding technicians near you...</p>
          </div>
        ) : technicians.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No technicians found matching your criteria</p>
           
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicians.map((tech, index) => (
              <TechnicianCard key={index} tech={tech} />
            ))}
          </div>
        )}

        {/* Registration CTA */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-blue-100 text-center">
          <h3 className="text-lg font-medium text-gray-900">Are you a technician?</h3>
          <p className="mt-2 text-gray-600">Join our network and get more customers</p>
          <button
            onClick={() => setShowTechRegistration(true)}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Register as Technician
          </button>
        </div>
      </main>

      {/* Registration Modal */}
      {showTechRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Technician Registration</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Services Offered</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {services.map(service => (
                    <label key={service} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span>{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowTechRegistration(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianPage;
