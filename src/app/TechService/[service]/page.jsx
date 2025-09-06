"use client";

import { useEffect, useState } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import Alert from "@mui/material/Alert";
import { useAuth } from "@/context/AuthContext";
// import TechnicianCard from '@/component/components/TechnicianCard';
import ServiceProcess from '@/component/components/ServiceProcess';
import Navbar from '@/component/Nav';
import Scroll from '@/component/components/Scroll';
const serviceDetails = require('@/component/components/servicedetail.json');

export default function ServicePage({ params }) {
   const { user} = useAuth();
  const router = useRouter();
  const { service } = React.use(params);
  const [showSuccess, setShowSuccess] = useState(false);
  const normalizedService = decodeURIComponent(service || '').replace(/-/g, ' ');
  const [userLocation, setUserLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sortBy, setSortBy] = useState('rating');
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [info,setinfo] = useState({});
  const [errors, setErrors] = useState("");
   const [successMessage, setSuccessMessage] = useState(''); // For different messages
  
  const handleApiRequest = async (apiEndpoint, successMsg) => {
    if (!user) {
      setErrors("Please log in to proceed.");
      router.push('/login');
      return;
    }
    try {
      setErrors(''); // Clear previous errors
      const submitData = {...serviceDetails[normalizedService],name:normalizedService}
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });
      const data = await res.json();
      if (data.error) {
        setErrors(data.error);
      } else {
        setSuccessMessage(successMsg);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      setErrors('Something went wrong. Please try again.');
    }
  };

  const handlebook = (e) => {
    e.preventDefault();
    handleApiRequest('/api/book/add', 'Service booked successfully!');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    handleApiRequest('/api/cart/add', 'Service added to cart!');
  };


  // useEffect(() => {
  //   if (!normalizedService) return;
  //   const fetchTechnicians = async () => {
  //     setLoading(true);
  //     const res = await fetch(`/api/technicians?location=${userLocation}&service=${normalizedService}`);
  //     const data = await res.json();
  //     setTechnicians(
  //       [...data].sort((a, b) => {
  //         if (sortBy === 'rating') return b.rating - a.rating;
  //         if (sortBy === 'price') return a.hourlyRate - b.hourlyRate;
  //         if (sortBy === 'distance') return a.distance - b.distance;
  //         return 0;
  //       })
  //     );
  //     setLoading(false);
  //   };
  //   fetchTechnicians();
  // }, [userLocation, sortBy, normalizedService]);

  return (
    <div className="min-h-screen bg-gray-100 mb-10 pt-[180px] lg:pt-[120px] text-black">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        {/* Mobile-first Hero Section with Image Carousel */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image Carousel */}
           <div className="w-full overflow-x-auto scroll-smooth whitespace-nowrap scrollbar-hide pt-4 px-2">
      <Scroll group={serviceDetails[normalizedService]?.group} img={serviceDetails[normalizedService]?.img} numcards={5} />
    </div>
 {showSuccess && (
          <Alert severity="success" className="fixed top-20 right-4 z-50">
            {successMessage}
          </Alert>
        )}
          {/* Service Info */}
          <div className="w-full md:w-1/2 space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
               {normalizedService}
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              {serviceDetails[normalizedService]?.priceRange}
            </p>
            <p className="text-gray-700">
              {serviceDetails[normalizedService]?.description}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.5 3 1.5-5.5L2 7.5l5.5-.5L10 2l2.5 5 5.5.5-4 4 1.5 5.5z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600">(128 Reviews)</span>
            </div>
            <div className="space-y-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-800 px-4 py-2"
              />
              <button onClick={handlebook} className="cursor-pointer  w-full  bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-all duration-200">
                Book Now
              </button>
              <button onClick={handleAddToCart} className="cursor-pointer  w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200">
                Add to Cart
              </button>
            </div>
            {errors && <div className="text-red-500 mt-4 text-center">{errors}</div>}
          </div>
        </div>

       

        {/* Service Details and Technicians */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Service Details</h2>
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
              <div className="mt-6 bg-cyan-50 p-6 rounded-xl">
                <h3 className="font-semibold text-lg mb-3">📝 Warranty Information</h3>
                <p className="text-gray-700">{serviceDetails[normalizedService]?.warranty}</p>
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Customer Reviews</h2>
              <div className="space-y-4">
                {[{ name: "John D.", rating: 5, comment: "Excellent service!" }, 
                  { name: "Sarah M.", rating: 4, comment: "Very professional." }].map((review, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{review.name}</span>
                      <div className="flex text-yellow-400">
                        {[...Array(review.rating)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.5 3 1.5-5.5L2 7.5l5.5-.5L10 2l2.5 5 5.5.5-4 4 1.5 5.5z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technicians
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Available Technicians</h2>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-800 px-4 py-2"
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
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <p className="text-gray-600 text-lg">No technicians available in your area</p>
                  <button className="cursor-pointer  mt-4 bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-all duration-200">
                    Request Technician
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {technicians.map((tech, index) => (
                    <TechnicianCard key={index} tech={tech} />
                  ))}
                </div>
              )}
            </div> */}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 top-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Quick Book</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Preferred Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-800 px-4 py-2"
                  />
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-lg mb-2">⚠️ Emergency Service?</h3>
                  <p className="text-sm mb-3 text-gray-700">Available 24/7 with priority response</p>
                  <button className="cursor-pointer  w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200">
                    Request Emergency Help
                  </button>
                </div>
              
              </div>
            </div>
            <div className="bg-white text-black rounded-2xl  shadow-lg p-6">
              <ServiceProcess service={normalizedService} />
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Earn up to ₹50k/month</h3>
              <p className="text-sm text-gray-600 mb-3">Join our network of professional technicians</p>
              <button
                onClick={() => router.push("/technicians/create-profile")}
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-all duration-200"
              >
                Register as Technician
              </button>
            </div>
            {/* FAQs */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  { q: "What is the booking process?", a: "Select a date, choose a technician, and confirm your booking." },
                  { q: "Can I cancel my booking?", a: "Yes, cancellations are free up to 24 hours before the service." }
                ].map((faq, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-800">{faq.q}</h3>
                    <p className="text-gray-600 text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
       {/* Sticky Booking Bar for Mobile */}
        <div className="fixed flex flex-row bottom-0 overflow-auto bg-transparent shadow-lg  min-w-full md:hidden z-10">
          <button onClick={handleAddToCart} className="cursor-pointer  w-1/2 bg-green-600 text-white px-6  py-2 hover:bg-green-700 transition-all duration-200">
                Add to Cart
              </button>
          <button onClick={handlebook}  className="cursor-pointer  w-1/2 bg-cyan-600 text-white  px-6 py-2  hover:bg-cyan-700 transition-all duration-200">
            Book Now
          </button>
        </div>
    </div>
  );
}