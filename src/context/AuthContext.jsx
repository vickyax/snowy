"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from '@/utils/supabaseServer'; // Adjust the import path as necessary
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Supabase user object
  const [profile, setProfile] = useState(null); // User row from users table
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard"); // default page
  const router = useRouter();

  useEffect(() => {
    // Check session on mount
    const getSession = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch user profile from users table
        const { data: userProfile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(userProfile);

        // Check if user is a technician
        const { data: tech } = await supabase
          .from("technicians")
          .select("id")
          .eq("id", user.id)
          .single();
        const { data: verified } = await supabase
          .from("technicians")
          .select("id")
          .eq("verification_status","TRUE")
          .single();
        
        if (tech && tech.id && verified) {
          router.push("/technicians-dashboard");
        }
      } else {
        setProfile(null);
        
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getSession();
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, currentPage, setCurrentPage }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}