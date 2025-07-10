"use client";
import { useEffect, useState } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import TechnicianCard from '@/component/components/TechnicianCard';
import ServiceProcess from '@/component/components/ServiceProcess';
import Navbar from '@/component/Nav';
export default function ServicePage({params}) {
  const router = useRouter();
  const { service } = React.use(params);
  const normalizedService = decodeURIComponent(service || '').replace(/-/g, ' '); 
  const [userLocation, setUserLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sortBy, setSortBy] = useState('rating');
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
const [showSuggestions, setShowSuggestions] = useState(false);
const handleLocationChange = async (e) => {
  const input = e.target.value;
  setUserLocation(input);
  if (input.length < 2) {
    setLocationSuggestions([]);
    setShowSuggestions(false);
    return;
  }
  const res = await fetch(`/api/location/autocomplete?q=${input}`);
  const data = await res.json();
  setLocationSuggestions(data.suggestions || []);
  setShowSuggestions(true);
};
 

  const serviceDetails = {
    'AC Repair': {
      icon: '❄️',
      coverage: ['Split AC', 'Window AC', 'Central Cooling'],
      includes: ['Gas refill', 'Coil cleaning', 'Thermostat repair'],
      excludes: ['New installation', 'Duct work'],
      priceRange: '₹499 - ₹2999',
      warranty: '90-day service warranty'
    }
 ,
  'Laptop and PC': {
    icon: '💻',
    coverage: ['Screen replacement', 'Virus removal', 'Hardware upgrades'],
    includes: ['Software installation', 'Data recovery', 'Keyboard replacement'],
    excludes: ['New laptop purchase', 'Motherboard replacement'],
    priceRange: '₹999 - ₹4999',
    warranty: '30-day service warranty'
  },
  
  'Refrigerator': {
    icon: '🧊',
    coverage: ['Top freezer', 'Bottom freezer', 'Side-by-side'],
    includes: ['Cooling failure', 'Frost buildup', 'Door seal leaks'],
    excludes: ['New refrigerator purchase', 'Compressor replacement'],
    priceRange: '₹799 - ₹3999',
    warranty: '60-day service warranty'
  },
  'Tv Repair': {
    icon: '📺',
    coverage: ['LCD', 'LED', 'OLED'],
    includes: ['Flickering screens', 'Audio delays', 'Remote control issues'],
    excludes: ['New TV purchase', 'Screen replacement'],
    priceRange: '₹499 - ₹2999',
    warranty: '30-day service warranty'
  },
  'Washing Machine': {
    icon: '🧺',
    coverage: ['Top load', 'Front load', 'Semi-automatic'],
    includes: ['Draining problems', 'Washer not turning on', 'Belt replacement'],
    excludes: ['New washing machine purchase', 'Drum replacement'],
    priceRange: '₹699 - ₹3499',
    warranty: '90-day service warranty'
  },
  'Wifi Router': {
    icon: '📶',
    coverage: ['Home routers', 'Business routers', 'Mesh systems'],
    includes: ['Slow connection', 'Frequent drops', 'Overheating'],
    excludes: ['New router purchase', 'Network setup'],
    priceRange: '₹299 - ₹1999',
    warranty: '30-day service warranty'
  }

  };

  useEffect(() => {
    if (!normalizedService) return;
    const fetchTechnicians = async () => {
      setLoading(true);
      const res = await fetch(`/api/technicians?location=${userLocation}&service=${normalizedService}`);
      const data = await res.json();
      setTechnicians(
        [...data].sort((a, b) => {
          if (sortBy === 'rating') return b.rating - a.rating;
          if (sortBy === 'price') return a.hourlyRate - b.hourlyRate;
          if (sortBy === 'distance') return a.distance - b.distance;
          return 0;
        })
      );
      setLoading(false);
    };

    fetchTechnicians();
  }, [userLocation, sortBy, normalizedService]);

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Navbar/>
      {/* Header */}
      <header className="bg-white mt-[200px] text-black shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <div className="items-center mr-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {serviceDetails[normalizedService]?.icon} {normalizedService}
              </h1>
              <p className="mt-2 text-gray-600">{serviceDetails[normalizedService]?.priceRange}</p>
            </div>
            <div className="w-64 mx-auto relative">
              <label className="block text-sm font-medium text-gray-700 ">Your Location</label>
              <input
                type="text"
                value={userLocation}
                onChange={handleLocationChange}
                onFocus={() => setShowSuggestions(locationSuggestions.length > 0)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Enter location"
                autoComplete="off"
              />
              {showSuggestions && locationSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded shadow-md max-h-40 overflow-auto">
                  {locationSuggestions.map((suggestion, idx) => (
                    <li
                      key={idx}
                      className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => {
                        setUserLocation(suggestion);
                        setLocationSuggestions([]);
                        setShowSuggestions(false);
                      }}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
           
          </div>
          
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mb-20 lg:mb-5 px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 text-black">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Service Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">What's Included:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {serviceDetails[normalizedService]?.includes.map((item, i) => (
                      <li key={i} className="text-green-600">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Not Included:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {serviceDetails[normalizedService]?.excludes.map((item, i) => (
                      <li key={i} className="text-red-600">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">📝 Warranty Information</h3>
                <p>{serviceDetails[normalizedService]?.warranty}</p>
              </div>
            </div>

            {/* Technicians */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Available Technicians</h2>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm"
                >
                  <option value="rating">Top Rated</option>
                  <option value="price">Best Price</option>
                  <option value="distance">Nearest First</option>
                </select>
              </div>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin inline-block w-8 h-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              ) : technicians.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <p className="text-gray-600">No technicians available in your area</p>
                  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Request Technician
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {technicians.map((tech, index) => (
                    <TechnicianCard key={index} tech={tech} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 text-black">
            <div className="bg-white  rounded-lg shadow-sm p-6  top-4">
              <h2 className="text-xl font-bold mb-4">Quick Book</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">⚠️ Emergency Service?</h3>
                  <p className="text-sm mb-2">Available 24/7 with priority response</p>
                  <button className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                    Request Emergency Help
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Need Multiple Services?</h3>
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                    Create Service Package
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
              <ServiceProcess service={normalizedService} />
            </div>
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6 text-center">
              <h3 className="font-medium mb-2">Earn up to ₹50k/month</h3>
              <p className="text-sm text-gray-600 mb-4">Join our network of professional technicians</p>
              <button onClick={() => router.push("/technicians/create-profile")} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Register as Technician
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
