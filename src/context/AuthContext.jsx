"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Supabase user object
  const [profile, setProfile] = useState(null); // User row from users table
  const [loading, setLoading] = useState(true);

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
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}