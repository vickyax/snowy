// pages/my-account.js
"use client";
import { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import supabase from "@/utils/supabaseServer";

export default function MyAccountPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Checkout form state
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    selectedDate: new Date().toISOString().split('T')[0]
  });

  // Prefill form when profile data is available
  useEffect(() => {
    if (profile) {
      setCheckoutForm(prev => ({
        ...prev,
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.location || '',
        email: profile.email || ''
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError('');

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch cart items
      const { data: cartData, error: cartError } = await supabase
        .from('cart_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (bookingsError || cartError) {
        setError('Failed to fetch your data. Please try again.');
        console.error('Fetch Error:', bookingsError || cartError);
      } else {
        setBookings(bookingsData || []);
        setCartItems(cartData || []);
      }
      setLoading(false);
    };

    fetchData();
  }, [user, router]);

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    const res = await fetch('/api/book/del', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: bookingId }),
    });

    if (res.ok) {
      setBookings(bookings.filter((b) => b.id !== bookingId));
      setSuccessMessage('Booking cancelled successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      alert('Failed to cancel booking.');
    }
  };

  const handleRemoveFromCart = async (cartItemId) => {
    const res = await fetch('/api/cart/del', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart_item_id: cartItemId }),
    });

    if (res.ok) {
      setCartItems(cartItems.filter((item) => item.id !== cartItemId));
      setSuccessMessage('Item removed from cart!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      alert('Failed to remove item from cart.');
    }
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) return;
    setShowCheckoutPopup(true);
    setError('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCheckoutForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.address) {
      setError('Please fill in all required fields');
      return;
    }

    // Phone validation
    if (!/^\d{10}$/.test(checkoutForm.phone.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setError('');
      
      // Book all cart items
      const bookingPromises = cartItems.map(item => 
        fetch('/api/book/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...item.product_info,
            customerName: checkoutForm.name,
            customerPhone: checkoutForm.phone,
            customerAddress: checkoutForm.address,
            customerEmail: checkoutForm.email,
            selectedDate: checkoutForm.selectedDate
          }),
        })
      );

      const responses = await Promise.all(bookingPromises);
      const allSuccessful = responses.every(res => res.ok);

      if (allSuccessful) {
        // Clear cart after successful booking
        const deletePromises = cartItems.map(item => 
          fetch('/api/cart/del', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart_item_id: item.id }),
          })
        );
        
        await Promise.all(deletePromises);
        
        setCartItems([]);
        setShowCheckoutPopup(false);
        setSuccessMessage(`Successfully booked ${cartItems.length} service(s)!`);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        // Refresh bookings
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });
        setBookings(bookingsData || []);
      } else {
        setError('Some bookings failed. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Checkout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <button onClick={() => router.back()} className="top-3 p-1 rounded-lg bg-gray-300/50 left-3 text-3xl fixed z-10">
        {'<'}
      </button>

      {showSuccess && (
        <Alert severity="success" className="fixed top-20 right-4 z-50">
          {successMessage}
        </Alert>
      )}

      {/* Checkout Popup Modal */}
      {showCheckoutPopup && (
        <div className="fixed inset-0  bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Complete Your Checkout</h2>
                <button
                  onClick={() => setShowCheckoutPopup(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Cart Summary */}
              <div className="mb-6 bg-cyan-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Booking Summary</h3>
                <div className="space-y-2">
                  {cartItems.map((item, index) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{index + 1}. {item.product_info.name}</span>
                      <span className="font-medium">{item.product_info.priceRange}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-cyan-200">
                  <p className="font-bold text-gray-800">Total Services: {cartItems.length}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={checkoutForm.name}
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
                    value={checkoutForm.phone}
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
                    value={checkoutForm.address}
                    onChange={handleFormChange}
                    required
                    rows={3}
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
                    value={checkoutForm.email}
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
                    name="selectedDate"
                    value={checkoutForm.selectedDate}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-800 px-4 py-2"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutPopup(false)}
                    className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCheckoutSubmit}
                    className="flex-1 bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-all duration-200 font-semibold"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Account</h1>

        {error && !showCheckoutPopup && <p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}

        {/* Bookings Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-6">My Booked Services</h2>
          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-cyan-700">{booking.product_info.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">Booked on: {new Date(booking.created_at).toLocaleDateString()}</p>
                    <p className="font-semibold text-gray-800">{booking.product_info.priceRange}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-300">Reschedule</button>
                    <button onClick={() => handleCancelBooking(booking.id)} className="flex-1 bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm hover:bg-red-200">Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You have no active bookings.</p>
          )}
        </section>

        {/* Cart Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-6">My Cart</h2>
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{item.product_info.name}</h3>
                    <p className="font-semibold text-gray-800">{item.product_info.priceRange}</p>
                  </div>
                  <button onClick={() => handleRemoveFromCart(item.id)} className="text-red-500 hover:text-red-700 font-medium">Remove</button>
                </div>
              ))}
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleProceedToCheckout}
                  className="bg-green-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-green-700 transition-all"
                >
                  Proceed to Checkout ({cartItems.length} items)
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}
        </section>
      </main>
    </div>
  );
}