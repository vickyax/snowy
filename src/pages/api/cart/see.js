// pages/api/cart/delete.js

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

  // Get the cart item ID from the request body
  const { cart_item_id } = req.body;

  if (!cart_item_id) {
    return res.status(400).json({ error: 'Cart item ID is required' });
  }

  const { error } = await supabase
    .from('cart_items')
     .select('*')
    .eq('id', cart_item_id)
    .eq('user_id', user.id);

  if (error) {
    return res.status(500).json({ error: `Database error: ${error.message}` });
  }

  return res.status(200).json({ success: true, message: 'Item retreived from cart.' });
}