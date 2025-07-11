"use client";
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import supabase from '@/utils/supabaseServer';
// --- Helper Icons (using SVG for simplicity) ---
const MailIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
);

const PhoneIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

const LockIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

// --- Country Code Data ---
const countryCodes = [
   { name: 'India', code: '+91' },
    { name: 'USA', code: '+1' },
    { name: 'UK', code: '+44' },
    { name: 'Australia', code: '+61' },
    { name: 'Germany', code: '+49' },
];


// --- Main Component ---
const LoginPage = () => {
  // State management for form data, UI flow, and errors
  const [loginMethod, setLoginMethod] = useState('phone'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('input'); // 'input', 'otp_verify'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Next.js router and search params for redirection
  const router = useRouter();
  // Wrap useSearchParams in a Suspense boundary as recommended by Next.js
  // See: https://nextjs.org/docs/messages/missing-suspense-with-use-search-params
  // This is a workaround for client components using useSearchParams.
  let searchParams;
  let redirect = '/';
  try {
    searchParams = useSearchParams();
    redirect = searchParams.get('redirect') || '/';
  } catch (e) {
    // If not in a Suspense boundary, fallback to default redirect
    redirect = '/';
  }

  const clearMessages = () => {
      setError('');
      setMessage('');
  }

  /**
   * Sends an OTP to the user's phone number using Supabase.
   */
  const handleSendOtp = async () => {
    if (!phone) {
        setError('Please enter a valid phone number.');
        return;
    }
    setLoading(true);
    clearMessages();
    
    const fullPhoneNumber = `${countryCode}${phone}`;

    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: fullPhoneNumber,
    });

    setLoading(false);
    if (otpError) {
      setError(`Failed to send OTP: ${otpError.message}`);
    } else {
      setMessage('An OTP has been sent to your phone.');
      setStep('otp_verify');
    }
  };

  /**
   * Handles the final login submission for both email/password and phone/OTP.
   */
   const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    clearMessages();

    try {
      if (loginMethod === 'email') {
        // --- Email & Password Login ---
        if (!email || !password) {
          setError('Email and password are required.');
          setLoading(false);
          return;
        }
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, isLogin: true }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || 'Login failed. Please check your credentials.');
        }
        setMessage('Login successful! Redirecting...');
        router.push(redirect);

      } else if (loginMethod === 'phone' && step === 'otp_verify') {
        // --- Phone & OTP Verification ---
        if (!otp) {
          setError('OTP is required.');
          setLoading(false);
          return;
        }
        const fullPhoneNumber = `${countryCode}${phone}`;
        const { data, error: verifyError } = await supabase.auth.verifyOtp({
          phone: fullPhoneNumber,
          token: otp,
          type: 'sms',
        });
        
        if (verifyError) {
          throw new Error(`Verification failed: ${verifyError.message}`);
        }
        setMessage('Login successful! Redirecting...');
        router.push(redirect);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-black font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back!</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to continue</p>
        </div>
        
        <div className="flex justify-center rounded-md shadow-sm" role="group">
           <button type="button" onClick={() => { setLoginMethod('phone'); clearMessages(); setStep('input'); }} className={`px-4 py-2 text-sm font-medium rounded-r-lg ${loginMethod === 'phone' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 hover:bg-gray-100'}`}>
                Phone
            </button>
            <button type="button" onClick={() => { setLoginMethod('email'); clearMessages(); setStep('input'); }} className={`px-4 py-2 text-sm font-medium rounded-l-lg ${loginMethod === 'email' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 hover:bg-gray-100'}`}>
                Email
            </button>
           
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {loginMethod === 'email' ? (
            <>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MailIcon className="h-5 w-5 text-gray-400" /></div>
                <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-3" placeholder="Email address" />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LockIcon className="h-5 w-5 text-gray-400" /></div>
                <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-3" placeholder="Password"/>
              </div>
            </>
          ) : (
            <>
              {step === 'input' && (
                <div className="flex items-center">
                    <select id="country-code" name="country-code" value={countryCode} onChange={e => setCountryCode(e.target.value)} className="h-full rounded-md rounded-r-none border border-r-0 border-gray-300 bg-transparent py-3 pl-3 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm">
                        {countryCodes.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                    </select>
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><PhoneIcon className="h-5 w-5 text-gray-400" /></div>
                        <input type="tel" name="phone" id="phone" required value={phone} onChange={e => setPhone(e.target.value)} className="pl-10 block w-full rounded-md rounded-l-none border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-3" placeholder="Phone number" />
                    </div>
                </div>
              )}
              {step === 'otp_verify' && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LockIcon className="h-5 w-5 text-gray-400" /></div>
                  <input id="otp" name="otp" type="text" inputMode="numeric" autoComplete="one-time-code" required value={otp} onChange={(e) => setOtp(e.target.value)} className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-3" placeholder="Enter OTP" />
                </div>
              )}
            </>
          )}

          {/* --- Error and Message Display --- */}
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">{error}</div>}
          {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative" role="alert">{message}</div>}

          {/* --- Action Buttons --- */}
          <div>
            {loginMethod === 'phone' && step === 'input' && (
                <button type="button" onClick={handleSendOtp} disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
                    {loading ? 'Sending...' : 'Send OTP'}
                </button>
            )}
            {loginMethod === 'email' || (loginMethod === 'phone' && step === 'otp_verify') ? (
              <>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>
                <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-100 mt-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
<path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
</svg>
          Sign in with Google
        </button>
        </>
          
            ) : null}
          </div>
        </form>

        <div className="text-center text-sm mt-4">
          <button type="button" onClick={() => router.push('/signup')} className="font-medium text-blue-600 hover:text-blue-500">
            Don't have an account? Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
