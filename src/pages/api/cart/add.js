// pages/api/cart/add.js

import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  // We only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  // Create a Supabase client that can access the user's session
  const supabase = createPagesServerClient({ req, res });

  // Securely get the logged-in user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  // Get the product info from the request body
  const productInfo = req.body;

  // Insert the new item into the user's cart
  const { data, error } = await supabase
    .from('cart_items') // Target the new 'cart_items' table
    .insert([{
        user_id: user.id,
        product_info: productInfo,
        quantity: 1 // Default quantity to 1
    }])
    .select()
    .single();

  if (error) {
    // Note: You could add logic here to check for duplicate items
    // and update the quantity instead of inserting, but for now,
    // this will add the service as a new line item in the cart.
    console.error('Supabase cart error:', error.message);
    return res.status(500).json({ error: `Database error: ${error.message}` });
  }

  // Success!
  return res.status(200).json({ success: true, cartItem: data });
}