"use client";

import { useEffect, useState } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import Alert from "@mui/material/Alert";
import { useAuth } from "@/context/AuthContext";
import ServiceProcess from '@/component/components/ServiceProcess';
import Navbar from '@/component/Nav';
import Scroll from '@/component/components/Scroll';
const serviceDetails = require('@/component/components/servicedetail.json');

export default function ServicePage({ params }) {
  const { user, profile } = useAuth();
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
  const [info, setinfo] = useState({});
  const [errors, setErrors] = useState("");
  const [successMessage, setSuccessMessage] = useState('');
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  
  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    address: '',
    email: ''
  });

  // Prefill form when profile data is available
  useEffect(() => {
    if (profile) {
      setBookingForm({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.location || '',
        email: profile.email || ''
      });
    }
  }, [profile]);

  const handleApiRequest = async (apiEndpoint, successMsg, bookingData = null) => {
    if (!user) {
      setErrors("Please log in to proceed.");
      router.push('/login');
      return;
    }
    try {
      setErrors('');
      const submitData = {
        ...serviceDetails[normalizedService],
        name: normalizedService,
        ...(bookingData && bookingData)
      };
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
        setShowBookingPopup(false);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      setErrors('Something went wrong. Please try again.');
    }
  };

  const handleBookNowClick = (e) => {
    e.preventDefault();
    if (!user) {
      setErrors("Please log in to proceed.");
      router.push('/login');
      return;
    }
    setShowBookingPopup(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.address) {
      setErrors('Please fill in all required fields');
      return;
    }

    // Phone validation (basic)
    if (!/^\d{10}$/.test(bookingForm.phone.replace(/\D/g, ''))) {
      setErrors('Please enter a valid 10-digit phone number');
      return;
    }

    handleApiRequest('/api/book/add', 'Service booked successfully!', {
      customerName: bookingForm.name,
      customerPhone: bookingForm.phone,
      customerAddress: bookingForm.address,
      customerEmail: bookingForm.email,
      selectedDate: selectedDate
    });
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    handleApiRequest('/api/cart/add', 'Service added to cart!');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 mb-10 pt-[180px] lg:pt-[120px] text-black">
      <Navbar />
      
      {/* Booking Popup Modal */}
      {showBookingPopup && (
        <div className="fixed inset-0  bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Complete Your Booking</h2>
                <button
                  onClick={() => setShowBookingPopup(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={bookingForm.name}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-800 px-4 py-2"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={bookingForm.phone}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-800 px-4 py-2"
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Service Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={bookingForm.address}
                    onChange={handleFormChange}
                    required
                    rows="3"
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-800 px-4 py-2"
                    placeholder="Enter complete service address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={bookingForm.email}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-800 px-4 py-2"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-800 px-4 py-2"
                  />
                </div>

                {errors && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {errors}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingPopup(false)}
                    className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-all duration-200 font-semibold"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full overflow-x-auto scroll-smooth whitespace-nowrap scrollbar-hide pt-4 px-2">
            <Scroll group={serviceDetails[normalizedService]?.group} img={serviceDetails[normalizedService]?.img} numcards={5} />
          </div>
          
          {showSuccess && (
            <Alert severity="success" className="fixed top-20 right-4 z-50">
              {successMessage}
            </Alert>
          )}
          
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
              <button onClick={handleBookNowClick} className="cursor-pointer w-full bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-all duration-200">
                Book Now
              </button>
              <button onClick={handleAddToCart} className="cursor-pointer w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200">
                Add to Cart
              </button>
            </div>
            {errors && !showBookingPopup && <div className="text-red-500 mt-4 text-center">{errors}</div>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Service Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">What's Included:</h3>
                  <ul className="list-disc pl-6 space-y-6">
                    {serviceDetails[normalizedService]?.includes.map((item, i) => (
                      <li key={i} className="text-green-600 font-medium">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-6 bg-cyan-50 p-6 rounded-xl">
                <h3 className="font-semibold text-lg mb-3">📝 Warranty Information</h3>
                <p className="text-gray-700">{serviceDetails[normalizedService]?.warranty}</p>
              </div>
            </div>

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
          </div>

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
                  <button className="cursor-pointer w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200">
                    Request Emergency Help
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white text-black rounded-2xl shadow-lg p-6">
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
      
      <div className="fixed flex flex-row bottom-0 overflow-auto bg-transparent shadow-lg min-w-full md:hidden z-10">
        <button onClick={handleAddToCart} className="cursor-pointer w-1/2 bg-green-600 text-white px-6 py-2 hover:bg-green-700 transition-all duration-200">
          Add to Cart
        </button>
        <button onClick={handleBookNowClick} className="cursor-pointer w-1/2 bg-cyan-600 text-white px-6 py-2 hover:bg-cyan-700 transition-all duration-200">
          Book Now
        </button>
      </div>
    </div>
  );
}