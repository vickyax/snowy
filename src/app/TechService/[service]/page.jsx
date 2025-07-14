"use client";
import { useEffect, useState } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import TechnicianCard from '@/component/components/TechnicianCard';
import ServiceProcess from '@/component/components/ServiceProcess';
import Navbar from '@/component/Nav';
const serviceDetails = require('@/component/components/servicedetail.json');

export default function ServicePage({ params }) {
  const router = useRouter();
  const { service } = React.use(params);
  const normalizedService = decodeURIComponent(service || '').replace(/-/g, ' ');
  const [userLocation, setUserLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sortBy, setSortBy] = useState('rating');
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen pt-[200px] bg-gradient-to-r from-cyan-200/60 to-cyan-400">
      <Navbar />
      {/* Header */}
      <header className="bg-white shadow-lg rounded-b-xl">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                {serviceDetails[normalizedService]?.icon} {normalizedService}
              </h1>
            </div>
            <p className="mt-2 text-lg text-gray-600 font-medium">
              {serviceDetails[normalizedService]?.priceRange}
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 text-gray-900">
            <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Service Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">What's Included:</h3>
                  <ul className="list-disc pl-6 space-y-3">
                    {serviceDetails[normalizedService]?.includes.map((item, i) => (
                      <li key={i} className="text-green-600 font-medium">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Not Included:</h3>
                  <ul className="list-disc pl-6 space-y-3">
                    {serviceDetails[normalizedService]?.excludes.map((item, i) => (
                      <li key={i} className="text-red-600 font-medium">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-8 bg-cyan-50 p-6 rounded-xl">
                <h3 className="font-semibold text-lg mb-3">📝 Warranty Information</h3>
                <p className="text-gray-700">{serviceDetails[normalizedService]?.warranty}</p>
              </div>
            </div>

            {/* Technicians */}
            <div className="mt-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Available Technicians</h2>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border-cyan-300 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-800 px-4 py-2 transition-all duration-200"
                >
                  <option value="rating">Top Rated</option>
                  <option value="price">Best Price</option>
                  <option value="distance">Nearest First</option>
                </select>
              </div>
              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin inline-block w-10 h-10 border-4 border-cyan-500 rounded-full border-t-transparent"></div>
                </div>
              ) : technicians.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
                  <p className="text-gray-600 text-lg">No technicians available in your area</p>
                  <button className="mt-6 bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-all duration-200">
                    Request Technician
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {technicians.map((tech, index) => (
                    <TechnicianCard key={index} tech={tech} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 text-gray-900">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-6 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Quick Book</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Preferred Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-lg border-cyan-300 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-800 px-4 py-2 transition-all duration-200"
                  />
                </div>
                <div className="bg-yellow-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-lg mb-3">⚠️ Emergency Service?</h3>
                  <p className="text-sm mb-4 text-gray-700">Available 24/7 with priority response</p>
                  <button className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all duration-200">
                    Request Emergency Help
                  </button>
                </div>
                <div className="bg-cyan-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-lg mb-3">Need Multiple Services?</h3>
                  <button className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200">
                    Create Service Package
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">
              <ServiceProcess service={normalizedService} />
            </div>
            <div className="mt-10 bg-white rounded-2xl shadow-xl p-8 text-center">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">Earn up to ₹50k/month</h3>
              <p className="text-sm text-gray-600 mb-4">Join our network of professional technicians</p>
              <button
                onClick={() => router.push("/technicians/create-profile")}
                className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-all duration-200"
              >
                Register as Technician
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}