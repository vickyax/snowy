//login.jsx
import { useState } from 'react';
import '@/app/globals.css';
import { useRouter } from 'next/router';
const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userRole, setUserRole] = useState('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    expertise: [],
    hourly_rate: '',
    available: true,
    location: '',
    service_radius: '',
    license_number: '',
    insurance_info: '',
    profile_photo: '',
    city: '',
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length === 0) {
    setErrors({});
    let profilePhotoUrl = "";

    // Upload profile photo if present and is a File
    if (!isLogin && userRole === "technician" && formData.profile_photo instanceof File) {
      const file = formData.profile_photo;
      const fileExt = file.name.split('.').pop();
      const filePath = `profile_photos/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Use a separate API route to upload (for security)
      const uploadRes = await fetch("/api/uploadProfilePhoto", {
        method: "POST",
        body: (() => {
          const fd = new FormData();
          fd.append("file", file);
          fd.append("path", filePath);
          return fd;
        })(),
      });
      const uploadData = await uploadRes.json();
      if (uploadData.url) {
        profilePhotoUrl = uploadData.url;
      }
    } else if (typeof formData.profile_photo === "string") {
      profilePhotoUrl = formData.profile_photo;
    }

    try {
      const submitData = {
        ...formData,
        profile_photo: profilePhotoUrl,
        expertise: userRole === 'technician'
          ? (typeof formData.expertise === "string"
              ? formData.expertise.split(',').map(e => e.trim()).filter(Boolean)
              : formData.expertise)
          : [],
        userRole,
        isLogin,
      };
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });
      const data = await res.json();
      if (data.error) {
        setErrors({ email: data.error });
      } else {
        // Inside handleSubmit, after successful signup (not login)
        if (!isLogin && !data.error) {
          // Save registration data for callback
          localStorage.setItem('pendingRegistration', JSON.stringify(submitData));
          alert('Account created! Please check your email to verify your account.');
          router.push('/auth/callback');
        }
        else {
        alert( 'Login successful!');
        router.push('/');
        }
      }
    } catch (err) {
      setErrors({ email: 'Something went wrong. Please try again.' });
    }
  } else {
    setErrors(validationErrors);
  }
};
  const validateForm = () => {
    const errors = {};
    if (!isLogin && !formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      errors.email = 'Invalid email address';
    }
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-black">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Sign in to continue' : 'Choose your account type'}
          </p>
        </div>

        {!isLogin && (
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => setUserRole('customer')}
              className={`px-6 py-2 rounded-full font-medium ${
                userRole === 'customer'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              👤 User
            </button>
            <button
              type="button"
              onClick={() => setUserRole('technician')}
              className={`px-6 py-2 rounded-full font-medium ${
                userRole === 'technician'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              🔧 Technician
            </button>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
                {!isLogin && userRole === 'technician' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Expertise (comma separated)</label>
                      <input
                        type="text"
                        value={formData.expertise}
                        onChange={e => setFormData({ ...formData, expertise: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        placeholder="e.g. Washing Machine, Electrical"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Hourly Rate (₹)</label>
                      <input
                        type="number"
                        value={formData.hourly_rate}
                        onChange={e => setFormData({ ...formData, hourly_rate: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Service Radius (km)</label>
                      <input
                        type="number"
                        value={formData.service_radius}
                        onChange={e => setFormData({ ...formData, service_radius: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">License Number</label>
                      <input
                        type="text"
                        value={formData.license_number}
                        onChange={e => setFormData({ ...formData, license_number: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Insurance Info</label>
                      <input
                        type="text"
                        value={formData.insurance_info}
                        onChange={e => setFormData({ ...formData, insurance_info: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                      <input
                        type="file"
                        onChange={e => setFormData({ ...formData, profile_photo: e.target.files[0] })}
                        className="mt-1 block bg-blue-400 w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-500"
            >
              {isLogin 
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </button>
          </div>
        </form>

        {!isLogin && (
          <p className="mt-4 text-xs text-gray-500 text-center">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;