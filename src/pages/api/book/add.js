// pages/api/book.js


// Import the server-side helper
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  // Create a new Supabase client for THIS request
  // It automatically reads the session cookie from the request object
  const supabase = createPagesServerClient({ req, res });

  // Now you can securely get the user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  // Your RLS policy `auth.uid() = user_id` will now work because
  // this `supabase` instance is authenticated as the user.
  const { data, error } = await supabase
    .from('bookings')
    .insert([{ user_id: user.id, product_info: req.body }]);

  if (error) {
    console.error('Supabase booking error:', error.message);
    console.error(user.id, info.product);
    return res.status(500).json({ error: 'Failed to book service.' });
  }

  // 6. Return a success response
  return res.status(200).json({ success: true, booking: data });
}