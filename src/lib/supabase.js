import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_DATABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to fetch products from Supabase
export const fetchProducts = async (callback) => {
  try {
    const { data: products, error } = await supabase
      .from('Products') // Replace 'Products' with your actual table name
      .select('*');

    if (error) {
      console.error('Error fetching products:', error);
      return;
    }

    if (typeof callback === 'function') {
      callback(products);
    } else {
      console.error('Callback is not a function');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

// Function to add a new product to the database
export const addProduct = async (product) => {
  try {
    const { data, error } = await supabase
      .from('Products') // Replace 'Products' with your actual table name
      .insert([product]);

    if (error) {
      console.error('Error adding product:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
};

// Function to upload an image to Supabase Storage and return the URL
export const uploadImage = async (file) => {
  try {
    const { data, error } = await supabase.storage
      .from('images') // Replace 'images' with your actual storage bucket name
      .upload(`images/${file.name}`, file);

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(`images/${file.name}`);

    if (!publicUrlData) {
      console.error('Error getting public URL');
      return null;
    }

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
};

// Function to listen for real-time updates
export const subscribeToProducts = (callback) => {
  const channel = supabase
    .channel('products-changes') // Create a channel for real-time updates
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'Products' }, // Adjust schema and table name as needed
      (payload) => {
        if (typeof callback === 'function') {
          callback(payload.new);
        }
      }
    )
    .subscribe();

  return channel;
};

// Function to unsubscribe from real-time updates
export const unsubscribeFromProducts = (channel) => {
  supabase.removeChannel(channel);
};

