// /pages/auth/callback.jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import '@/app/globals.css'; // Assuming this is correctly pointing to your global styles

// Ensure these environment variables are correctly set in your .env.local
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

function parseHashParams(hash) {
  if (!hash) return {};
  return hash
    .substring(1)
    .split('&')
    .reduce((acc, part) => {
      const [key, value] = part.split('=');
      acc[decodeURIComponent(key)] = decodeURIComponent(value || ''); // Decode URI components
      return acc;
    }, {});
}

export default function Callback() {
  const router = useRouter();
  const [status, setStatus] = useState("Verifying your email and setting up account...");

  useEffect(() => {
    const checkAndInsert = async () => {
      // 1. Parse tokens from URL hash (if magic link or OAuth, not typical for email/password verification redirect)
      // For email verification, Supabase often handles session automatically upon redirect if cookies are set.
      // However, if tokens are indeed in the hash after email verification (check Supabase docs for your specific setup):
      if (typeof window !== 'undefined' && window.location.hash) {
        const params = parseHashParams(window.location.hash);
        const access_token = params.access_token;
        const refresh_token = params.refresh_token;

        if (access_token && refresh_token) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          if (sessionError) {
            setStatus(`Error setting session: ${sessionError.message}. Please try logging in.`);
            // router.push('/login'); // Optionally redirect
            return;
          }
        }
      }

      // 2. Get the authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        setStatus("Could not verify user. Please log in after verifying your email, or try signing up again.");
        // router.push('/login'); // Optionally redirect
        return;
      }

      if (!user.email_confirmed_at) {
        // This case might occur if user lands here before Supabase updates email_confirmed_at
        // or if they haven't clicked the verification link.
        setStatus("Email not verified. Please check your inbox for the verification link and click on it.");
        return;
      }

      // 3. Get registration data from localStorage
      const regDataString = localStorage.getItem("pendingRegistration");
      if (!regDataString) {
        setStatus("No pending registration data found. If you have already registered, please log in. Otherwise, try signing up again.");
        // Redirect or offer options
        // router.push('/login');
        return;
      }

      let regData;
      try {
        regData = JSON.parse(regDataString);
      } catch (e) {
        setStatus("Failed to parse registration data. Please try signing up again.");
        localStorage.removeItem("pendingRegistration");
        return;
      }

      if (!regData || !regData.email || !regData.name || !regData.userRole) {
        setStatus("Incomplete registration data. Please try signing up again.");
        localStorage.removeItem("pendingRegistration");
        return;
      }

      // Validate that the logged-in user matches the pending registration email
      if (user.email !== regData.email) {
          setStatus("Session email does not match registration data email. Please ensure you verified the correct email or try signing up again.");
          localStorage.removeItem("pendingRegistration");
          return;
      }

      // 4. Check if user profile already exists in the specific table
      const targetTable = regData.userRole === "technician" ? "technicians" : "users";
      const { data: existingProfile, error: checkError } = await supabase
        .from(targetTable)
        .select("id")
        .eq("id", user.id)
        .maybeSingle(); // Use maybeSingle to handle null if not found without error

      if (checkError) {
        setStatus(`Error checking for existing profile: ${checkError.message}.`);
        return;
      }

      if (existingProfile) {
        setStatus("Account profile already set up. Redirecting...");
      } else {
        // 5. Profile does not exist, so insert it.
        // Construct the data object carefully, picking only relevant fields.
        let dataToInsert = {
          id: user.id, // Primary key, foreign key to auth.users.id
          name: regData.name,
          email: user.email, // Use the confirmed email
          city: regData.city || null, // Ensure 'city' exists in regData or handle if optional
          location: regData.location || null, // Ensure 'location' exists in regData or handle
          // Add other common fields if present in regData and your tables
        };

        if (regData.userRole === 'technician') {
          // Ensure these field names match your 'technicians' table columns
          dataToInsert = {
            ...dataToInsert,
            expertise: (typeof regData.expertise === "string"
                          ? regData.expertise.split(',').map(e => e.trim()).filter(Boolean)
                          : Array.isArray(regData.expertise) ? regData.expertise : []), // Ensure it's an array
            hourly_rate: regData.hourly_rate ? parseFloat(regData.hourly_rate) : null,
            available: typeof regData.available === 'boolean' ? regData.available : (regData.available === 'true'), // Convert string 'true' to boolean
            service_radius: regData.service_radius ? parseInt(regData.service_radius, 10) : null,
            license_number: regData.license_number || null,
            insurance_info: regData.insurance_info || null,
            profile_photo: regData.profile_photo || null, // This should be the URL string from upload
          };
        } else if (regData.userRole === 'customer') {
          // Add any customer-specific fields if your 'users' table needs them from regData
          // Example: dataToInsert.address = regData.address || null;
        }
        
        // Remove undefined properties to prevent Supabase errors for columns that don't allow null
        // Or ensure your regData provides defaults for all required table columns.
        Object.keys(dataToInsert).forEach(key => {
            if (dataToInsert[key] === undefined) {
                dataToInsert[key] = null; // Or delete dataToInsert[key] if null is not appropriate
            }
        });


        const { error: insertError } = await supabase.from(targetTable).insert([dataToInsert]);

        if (insertError) {
          console.error("Supabase insert error in callback:", insertError);
          setStatus(`Failed to save profile details: ${insertError.message}. Please try again or contact support.`);
          // Do NOT remove pendingRegistration here, so user/dev can inspect regData if needed.
          return;
        }
        setStatus("Account setup complete! Redirecting...");
      }

      // 6. Clean up and redirect
      localStorage.removeItem("pendingRegistration");
      setTimeout(() => {
        // Redirect to a relevant dashboard or home page based on role if desired
        // Example: router.push(regData.userRole === 'technician' ? '/technician-dashboard' : '/');
        router.push("/");
      }, 3000); // Increased timeout to allow user to read status
    };

    checkAndInsert().catch(err => {
        console.error("Error in callback checkAndInsert:", err);
        setStatus("An unexpected error occurred. Please try again.");
    });

  }, [router]); // router is a dependency

  return (
    <div className="flex items-center text-black justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Account Verification</h2>
        <p className="text-lg">{status}</p>
        {/* Optional: Add a spinner or loading animation */}
      </div>
    </div>
  );
}