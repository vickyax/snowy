"use client";
//create-profile.jsx
import { useState, useRef,useEffect } from "react";
import { useRouter } from 'next/navigation';
import Card from "../../component/components/NormalCard"; // Adjust path if needed
import Alert from '@mui/material/Alert';
import supabase from '@/utils/supabaseServer'; // Adjust path if needed
// --- START: Added for the code to be runnable ---
// NOTE: You should replace this with a complete list of countries
const countryList = [
    { name: 'India', code: '+91' },
    { name: 'United States', code: '+1' },
    { name: 'United Kingdom', code: '+44' },
];
const allCountries = ['India', 'United States', 'United Kingdom'];
// --- END: Added for the code to be runnable ---


const questions = [
    {
        key: "job_role",
        question: "What type of job role you want?",
        options: [
            { label: "Want to work Freelance", value: "freelance", title: "Freelancer" },
            { label: "Want to work Permanently", value: "permanent", title: "Permanent" },
        ],
        multi: false,
    },
    {
        key: "age",
        question: "What is your Age Range?",
        options: [
            { label: "18-25", value: "18-25", title: "🙎" },
            { label: "26-32", value: "26-32", title: "👨‍💻" },
            { label: "32+", value: "32+", title: "🤵" },
        ],
        multi: false,
    },
    {
        key: "expertise",
        question: "What is your main area of expertise?",
        options: [
            { label: "Washing Machine", value: "Washing Machine", title: "🧺" },
            { label: "Electrical", value: "Electrical", title: "💡" },
            { label: "Refrigerator", value: "Refrigerator", title: "🧊" },
        ],
        multi: true,
    },
    {
        key: "experience",
        question: "How many years of experience do you have?",
        options: [
            { label: "0-2 years", value: "0-2", title: "🌱" },
            { label: "3-5 years", value: "3-5", title: "🌿" },
            { label: "6+ years", value: "6+", title: "🌳" },
        ],
        multi: false,
    },
    {
        key: "service_radius",
        question: "What is your preferred service radius?",
        options: [
            { label: "10 km", value: 10, title: "🚶" },
            { label: "25 km", value: 25, title: "🚗" },
            { label: "50 km", value: 50, title: "🛣️" },
        ],
        multi: false,
    },
];

export default function CreateTechnicianProfile() {
    const [answers, setAnswers] = useState({
        job_role: "",
        expertise: [],
        experience: "",
        service_radius: "",
        age: "",
        profile_photo: null,
        dob: "",
        country: "",
        state: "",
        city: "",
        pincode: "",
        phone: "",
        phone_country_code: "+91",
    });

    // **CHANGE 1: Fixed case sensitivity from answers.Job_Role to answers.job_role**
    const filteredQuestions = questions.filter(
        q => !(q.key === "service_radius" && answers.job_role === "permanent")
    );

   
    const [step, setStep] = useState(0);
    const debounceTimeout = useRef(null);
    const [userCity, setUserCity] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const isFinalStep = step === filteredQuestions.length;

// ...existing code...
const [stateSuggestions, setStateSuggestions] = useState([]);
const [citySuggestions, setCitySuggestions] = useState([]);

const handleStateChange = async (e) => {
  const input = e.target.value;
  setAnswers(a => ({ ...a, state: input }));
  if (input.length < 1) {
    setStateSuggestions([]);
    return;
  }
  const res = await fetch(`/api/location/state-autocomplete?q=${input}`);
  const data = await res.json();
  setStateSuggestions(data.suggestions || []);
};

const handleCityChange = async (e) => {
  const input = e.target.value;
  setAnswers(a => ({ ...a, city: input }));
  if (input.length < 1 || !answers.state) {
    setCitySuggestions([]);
    return;
  }
  const res = await fetch(`/api/location/autocomplete?q=${input}&state=${answers.state}`);
  const data = await res.json();
  setCitySuggestions(data.suggestions || []);
};
// ...existing code...
    
    const handleSelect = (key, value, multi) => {
        setAnswers((prev) => {
            if (multi) {
                const arr = prev[key] || [];
                return {
                    ...prev,
                    [key]: arr.includes(value)
                        ? arr.filter((v) => v !== value)
                        : [...arr, value],
                };
            }
            return { ...prev, [key]: value };
        });
    };

    const handleNext = () => setStep((s) => s + 1);
    const handleBack = () => setStep((s) => s - 1);

    const handleSubmit = async () => {
        setSubmitting(true);
        setError("");
            const { data: { user }, error: userError } = await supabase.auth.getUser();
  
         let profilePhotoUrl = "";

  if (answers.profile_photo) {

    const formData = new FormData();

    formData.append("file", answers.profile_photo);

    formData.append("path", `profile_photos/${Date.now()}_${answers.profile_photo.name}`);

    const uploadRes = await fetch("/api/uploadProfilePhoto", {

      method: "POST",

      body: formData,

    });

    const uploadData = await uploadRes.json();

    profilePhotoUrl = uploadData.url || "";

  }



    if (userError || !user) {

      setError("Could not get user info. Please log in again.");

      setSubmitting(false);

      return;

    }

    const res = await fetch("/api/technician-profile", {

    method: "POST",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({

      id: user.id,

      job_role: answers.job_role,

      expertise: answers.expertise,

      experience: answers.experience,

      service_radius: answers.service_radius,

      age: answers.age,

      profile_photo: profilePhotoUrl,

      dob: answers.dob,

      country: answers.country,

      state: answers.state,

      city: answers.city,

      pincode: answers.pincode,

      phone: answers.phone_country_code + answers.phone,

      email: user.email,

      name: user.user_metadata?.name || user.email,

    }),

  });


    const data = await res.json();

    if (!res.ok) {

      setError("Failed to save profile: " + (data.error || "Unknown error"));

      setSubmitting(false);

      return;

    }
        // Simulating a successful submission for demonstration
        setTimeout(() => {
            alert("Application submitted successfully!");
            alert("Profile updated!");
            router.push("/");
            setSubmitting(false);
        }, 1000);
    };

    // **CHANGE 2: Moved the question object (`q`) definition inside the component's return logic**
    const q = filteredQuestions[step];
    // Remove the direct call to supabase.auth.getUser() here; useEffect or async logic should be used for auth in React.
    // For now, let's assume user info is handled via state or props, or you can use a loading state.
    // Remove the destructuring and use a placeholder for demonstration.
    // Example: const user = true; // Replace with actual user logic

    // For demonstration, let's use a placeholder for user
    // You should replace this with your actual authentication logic
    const [user, setUser] = useState(null);

    // Simulate fetching user on mount (replace with your actual logic)
    useEffect(() => {
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        }
        fetchUser();
    }, []);

    
    if (!user) {
//         <Alert severity="success" className="fixed top-30 right-50 z-50">
//     Successfully logged out.
//   </Alert>
        router.push('/login');
        return ;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6 text-center">Technician Registration</h2>

                {isFinalStep ? (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-center">Personal Details</h3>
                        <div className="flex flex-col gap-4">
                            {/* Profile Photo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Profile Photo (optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setAnswers(a => ({ ...a, profile_photo: e.target.files[0] }))}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>
                            {/* Date of Birth */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                <input
                                    type="date"
                                    value={answers.dob}
                                    onChange={e => setAnswers(a => ({ ...a, dob: e.target.value }))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>
                            {/* Country */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Country</label>
                                <select
                                    value={answers.country}
                                    onChange={e => setAnswers(a => ({ ...a, country: e.target.value }))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                >
                                    <option value="">Select Country</option>
                                    {allCountries.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            {/* State */}
                            <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700">State</label>
                                    <input
                                        type="text"
                                        value={answers.state}
                                        onChange={handleStateChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        autoComplete="off"
                                    />
                                    {stateSuggestions.length > 0 && (
                                        <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded shadow-md max-h-40 overflow-auto">
                                        {stateSuggestions.map((suggestion, idx) => (
                                            <li
                                            key={idx}
                                            className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                                            onClick={() => {
                                                setAnswers(a => ({ ...a, state: suggestion, city: "" }));
                                                setStateSuggestions([]);
                                            }}
                                            >
                                            {suggestion}
                                            </li>
                                        ))}
                                        </ul>
                                    )}
                                    </div>
                                    {/* City */}
                                    <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                    <input
                                        type="text"
                                        value={answers.city}
                                        onChange={handleCityChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        autoComplete="off"
                                    />
                                    {citySuggestions.length > 0 && (
                                        <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded shadow-md max-h-40 overflow-auto">
                                        {citySuggestions.map((suggestion, idx) => (
                                            <li
                                            key={idx}
                                            className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                                            onClick={() => {
                                                setAnswers(a => ({ ...a, city: suggestion }));
                                                setCitySuggestions([]);
                                            }}
                                            >
                                            {suggestion}
                                            </li>
                                        ))}
                                        </ul>
                                    )}
                                    </div>
                            {/* Pincode */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Pincode (optional)</label>
                                <input
                                    type="text"
                                    value={answers.pincode}
                                    onChange={e => setAnswers(a => ({ ...a, pincode: e.target.value }))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>
                            {/* Phone Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <div className="flex gap-2">
                                    <select
                                        value={answers.phone_country_code}
                                        onChange={e => setAnswers(a => ({ ...a, phone_country_code: e.target.value }))}
                                        className="rounded-md border-gray-300 shadow-sm"
                                    >
                                        {countryList.map(c => (
                                            <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                                        ))}
                                    </select>
                                    <input
                                        type="tel"
                                        value={answers.phone}
                                        onChange={e => setAnswers(a => ({ ...a, phone: e.target.value }))}
                                        className="block w-full rounded-md border-gray-300 shadow-sm"
                                        placeholder="Phone number"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // **CHANGE 3: This is the critical fix. Check if `q` exists *here*.**
                    // If `q` is undefined, this block won't render, preventing crashes.
                    q && <div>
                        <h3 className="text-lg font-semibold mb-4 text-center">{q.question}</h3>
                        <div className="flex flex-wrap gap-6 justify-center mt-5 mb-6">
                            {q.options.map((opt) => {
                                const selected = q.multi
                                    ? answers[q.key]?.includes(opt.value)
                                    : answers[q.key] === opt.value;
                                return (
                                    <div
                                        key={opt.value}
                                        className={`transition-transform cursor-pointer ${
                                            selected ? "scale-105" : "opacity-80 hover:opacity-100"
                                        }`}
                                        style={{ minWidth: 180, maxWidth: 220 }}
                                        onClick={() => handleSelect(q.key, opt.value, q.multi)}
                                    >
                                        <Card
                                            content1={opt.title ? (
                                                <span className="text-4xl block mb-2">{opt.title}</span>
                                            ) : ""}
                                            content2={opt.label}
                                            image={undefined}
                                        />
                                        {selected && (
                                            <div className="text-center text-blue-600 font-bold mt-1">✓ Selected</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="flex justify-between mt-8">
                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={step === 0}
                        className="px-4 py-2 rounded hover:shadow-[0px_3px_7px_0px_#2d63c2] bg-red-600 text-white disabled:opacity-50"
                    >
                        Back
                    </button>

                    {isFinalStep ? (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-4 py-2 rounded hover:shadow-[0px_3px_7px_0px_#2d63c2] bg-green-600 text-white disabled:opacity-50"
                        >
                            {submitting ? "Submitting..." : "Finish"}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={
                                // Ensure q exists before accessing its properties
                                q && (q.multi
                                    ? !answers[q.key] || answers[q.key].length === 0
                                    : !answers[q.key])
                            }
                            className="px-4 py-2 rounded hover:shadow-[0px_3px_7px_0px_#2d63c2] bg-blue-600 text-white disabled:opacity-50"
                        >
                            Next
                        </button>
                    )}
                </div>

                {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
            </div>
        </div>
    );
}