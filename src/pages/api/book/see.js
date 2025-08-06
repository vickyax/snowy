// pages/api/bookings/delete.js

import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const supabase = createPagesServerClient({ req, res });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  // Get the booking ID from the request body
  const { booking_id } = req.body;

  if (!booking_id) {
    return res.status(400).json({ error: 'Booking ID is required' });
  }

  // Delete the booking. The RLS policy ensures the user can only delete their own bookings.
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', booking_id)
    .eq('user_id', user.id); // Double-check ownership

  if (error) {
    return res.status(500).json({ error: `Database error: ${error.message}` });
  }

  return res.status(200).json({ success: true, message: 'Bookings' });
}