"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import TechnicianCard from '@/component/components/TechnicianCard'; // Adjust import as needed
import Navbar from '@/component/Nav';

// --- SVG Icons for better self-containment ---
const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const CrosshairsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 110 20 10 10 0 010-20zM12 8v8m-4-4h8" />
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const TechnicianPage = () => {
    const router = useRouter();
    const [userLocation, setUserLocation] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [allTechnicians, setAllTechnicians] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [geoError, setGeoError] = useState('');
    const [showTechRegistration, setShowTechRegistration] = useState(false);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const debounceTimeout = useRef();

    // --- State for the registration form ---
    const [newTechName, setNewTechName] = useState('');
    const [newTechServices, setNewTechServices] = useState(new Set());


    const services = [
        'AC Repair', 'Refrigerator', 'Washing Machine',
        'Oven', 'Computer', 'Mobile', 'Wifi Router', 'Tv Repair'
    ];

    // IMPROVEMENT: Consolidated data fetching into a single useEffect
    useEffect(() => {
        const fetchAllTechnicians = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/techdata?ts=${Date.now()}`, { cache: "no-store" });
                const data = await response.json();
                setAllTechnicians(data);
                setTechnicians(data); // Initially display all technicians
            } catch (err) {
                console.error("Failed to fetch technicians:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllTechnicians();
    }, []);

    // IMPROVEMENT: This useEffect now handles all filtering updates reactively.
    useEffect(() => {
        setLoading(true);
        const filtered = allTechnicians.filter(tech =>
            (!userLocation || (tech.city && tech.city.toLowerCase().includes(userLocation.toLowerCase()))) &&
            (!selectedService || (tech.expertise || []).some(exp => exp.toLowerCase().includes(selectedService.toLowerCase())))
        );
        setTechnicians(filtered);
        setLoading(false);
    }, [userLocation, selectedService, allTechnicians]);

    // IMPROVEMENT: Geolocation is now explicitly triggered by the user.
    const getLocation = async () => {
        setGeoError('');
        try {
            const pos = await new Promise((resolve, reject) =>
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
            );
            const { latitude, longitude } = pos.coords;
            const response = await fetch(`/api/location/reverse?lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            if (data.city) {
                 setUserLocation(data.city);
            } else {
                 setGeoError("Could not determine city from location.");
            }
        } catch (err) {
            console.error(err);
            setGeoError("Couldn't detect location. Please enable permissions or enter manually.");
        }
    };

    const handleLocationChange = (e) => {
        const input = e.target.value;
        setUserLocation(input);
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        if (input.length < 2) {
            setLocationSuggestions([]);
            return;
        }
        debounceTimeout.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/location/autocomplete?q=${input}`);
                const data = await res.json();
                setLocationSuggestions(data.suggestions);
            } catch (err) {
                console.error('Autocomplete error:', err);
            }
        }, 300);
    };

    const handleServiceCheckboxChange = (service, isChecked) => {
        setNewTechServices(prev => {
            const newSet = new Set(prev);
            if (isChecked) {
                newSet.add(service);
            } else {
                newSet.delete(service);
            }
            return newSet;
        });
    };
    
    const handleRegistrationSubmit = (e) => {
        e.preventDefault();
        const applicationData = {
            name: newTechName,
            services: Array.from(newTechServices)
        };
        console.log("Submitting application:", applicationData);
        // Here you would typically send the data to your API
        // await fetch('/api/register-tech', { method: 'POST', body: JSON.stringify(applicationData) });
        setShowTechRegistration(false); // Close modal on submit
    };


    return (
        <div className="min-h-screen text-gray-700 bg-slate-50">
            <Navbar />
            <header className="bg-white shadow-sm mt-20">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                        Find Certified Technicians
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">Get help from trusted experts near you.</p>
                    
                    {/* IMPROVEMENT: Filters are wrapped in a styled container */}
                    <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            {/* Location Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LocationIcon />
                                    </div>
                                    <input
                                        type="text"
                                        value={userLocation}
                                        onChange={handleLocationChange}
                                        className="w-full pl-10 pr-10 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                                        placeholder="Enter your city"
                                    />
                                    <button onClick={getLocation} className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 hover:text-blue-800" aria-label="Detect current location">
                                        <CrosshairsIcon />
                                    </button>
                                    {locationSuggestions.length > 0 && (
                                        <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded-md shadow-lg max-h-48 overflow-auto">
                                            {locationSuggestions.map((suggestion, idx) => (
                                                <li
                                                    key={idx}
                                                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-gray-800"
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

                            {/* Service Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Service Needed</label>
                                <select
                                    value={selectedService}
                                    onChange={e => setSelectedService(e.target.value)}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
                                >
                                    <option value="">All Services</option>
                                    {services.map(service => (
                                        <option key={service} value={service}>{service}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Search Button */}
                            <div className="self-end">
                                {/* The filtering is live, so the search button is less critical but kept for explicit action */}
                                <button
                                    onClick={() => { /* Filtering is already live, but can be used for explicit re-search */ }}
                                    className="w-full flex items-center justify-center cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                >
                                    <SearchIcon />
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto mb-20 lg:mb-5 px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin inline-block w-10 h-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                        <p className="mt-4 text-lg text-gray-600">Finding technicians...</p>
                    </div>
                ) : technicians.length === 0 ? (
                     // IMPROVEMENT: Better empty state
                    <div className="text-center py-20">
                        <div className="mx-auto h-12 w-12 text-gray-400">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-6-6" />
                             </svg>
                        </div>
                        <h3 className="mt-2 text-xl font-semibold text-gray-900">No Technicians Found</h3>
                        <p className="mt-1 text-base text-gray-500">Try adjusting your location or selected service.</p>
                    </div>
                ) : (
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {technicians.map((tech, index) => (
                            <TechnicianCard key={index} tech={tech} />
                        ))}
                    </motion.div>
                )}

                <div className="mt-20 p-8 bg-white rounded-lg shadow-md border border-gray-200 text-center">
                    <h3 className="text-xl font-semibold text-gray-900">Are you a technician?</h3>
                    <p className="mt-2 text-gray-600">Join our network to connect with more customers in your area.</p>
                    <button
                        onClick={() => setShowTechRegistration(true)}
                        className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105"
                    >
                        Register Now
                    </button>
                </div>
            </main>

            {/* IMPROVEMENT: Animated and more functional registration modal */}
            <AnimatePresence>
                {showTechRegistration && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
                        onClick={() => setShowTechRegistration(false)}
                    >
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            className="bg-white rounded-lg p-8 w-full max-w-lg relative"
                            onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Technician Registration</h2>
                                <button onClick={() => setShowTechRegistration(false)} className="text-gray-400 hover:text-gray-600">
                                    <CloseIcon />
                                </button>
                            </div>
                            <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={newTechName}
                                        onChange={(e) => setNewTechName(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Services Offered</label>
                                    <div className="mt-2 grid grid-cols-2 gap-4">
                                        {services.map(service => (
                                            <label key={service} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50">
                                                <input 
                                                    type="checkbox" 
                                                    onChange={(e) => handleServiceCheckboxChange(service, e.target.checked)}
                                                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500" 
                                                />
                                                <span className="text-gray-700">{service}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowTechRegistration(false)}
                                        className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        Submit Application
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TechnicianPage;