// pages/my-account.js
"use client";
import { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Card from "@/component/components/Card";
import supabase from "@/utils/supabaseServer";
export default function MyAccountPage() {
   const { user } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
  }, [user, router, supabase]);

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    const res = await fetch('/api/book/del', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: bookingId }),
    });

    if (res.ok) {
      // Remove the booking from the local state for an instant UI update
      setBookings(bookings.filter((b) => b.id !== bookingId));
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
      // Remove the item from the local state
      setCartItems(cartItems.filter((item) => item.id !== cartItemId));
    } else {
      alert('Failed to remove item from cart.');
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
      <button onClick={()=>router.back()} className="top-3 p-1 rounded-lg bg-gray-300/50 left-3 text-3xl fixed z-10">
        {'<'}
      </button>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Account</h1>

        {error && <p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}

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
                <button className="bg-green-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-green-700 transition-all">
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