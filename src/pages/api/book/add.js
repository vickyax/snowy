// pages/api/book/add.js
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Create a new Supabase client for THIS request
  const supabase = createPagesServerClient({ req, res });
  
  // Get the authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const {
      customerName,
      customerPhone,
      customerAddress,
      customerEmail,
      selectedDate,
      ...productInfo
    } = req.body;

    // Check if user profile exists and needs updating
    const { data: existingProfile, error: profileFetchError } = await supabase
      .from('users')
      .select('name, phone, location, email')
      .eq('id', user.id)
      .single();

    if (profileFetchError && profileFetchError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is okay
      console.error('Error fetching profile:', profileFetchError);
    }
    
    // Determine which fields need to be updated
    const profileUpdates = {};
    
    if (customerName && (!existingProfile?.name || existingProfile.name === '')) {
      profileUpdates.name = customerName;
    }
    
    if (customerPhone && (!existingProfile?.phone || existingProfile.phone === '')) {
      profileUpdates.phone = customerPhone;
    }
    
    if (customerAddress && (!existingProfile?.location || existingProfile.location === '')) {
      profileUpdates.location = customerAddress;
    }
    
    if (customerEmail && (!existingProfile?.email || existingProfile.email === '')) {
      profileUpdates.email = customerEmail;
    }

    // Update user profile if there are fields to update
    if (Object.keys(profileUpdates).length > 0) {
      const { error: updateError } = await supabase
        .from('users')
        .update(profileUpdates)
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating user profile:', updateError);
        // Don't fail the booking if profile update fails, just log it
      }
    }

    // Create the booking with all information
    const bookingData = {
      user_id: user.id,
      product_info: {
        ...productInfo,
        customerName,
        customerPhone,
        customerAddress,
        customerEmail,
        selectedDate
      }
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select();

    if (error) {
      console.error('Supabase booking error:', error.message);
      return res.status(500).json({ error: 'Failed to book service.' });
    }

    return res.status(200).json({ 
      success: true, 
      booking: data,
      profileUpdated: Object.keys(profileUpdates).length > 0
    });

  } catch (error) {
    console.error('Booking error:', error);
    return res.status(500).json({ error: 'An error occurred while processing your booking.' });
  }
}