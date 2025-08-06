
import { createPagesBrowserClient} from '@supabase/auth-helpers-nextjs';

// This client is safe to use in the browser
 const supabase = createPagesBrowserClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
});
export default supabase;