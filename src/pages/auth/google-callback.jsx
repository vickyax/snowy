import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import '@/app/globals.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export default function GoogleCallback() {
  const router = useRouter();
  const [status, setStatus] = useState("Setting up your account...");

  useEffect(() => {
    const setupUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setStatus("Could not get user info. Please try logging in again.");
        return;
      }

      const role = localStorage.getItem('pendingGoogleRole') || 'customer';

      // Check if user already exists
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existing) {
        await supabase.from('users').insert([
          {
            id: user.id,
            name: user.user_metadata?.name || user.email,
            email: user.email,
            role: role,
          }
        ]);
      }

      localStorage.removeItem('pendingGoogleRole');
      setStatus("Account setup complete! Redirecting...");
      setTimeout(() => router.push("/"), 2000);
    };

    setupUser();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>{status}</div>
    </div>
  );
}