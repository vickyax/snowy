"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/utils/supabaseServer";

const TechnicianSettings = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    expertise: "",
    experience: "",
    service_radius: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch technician data on mount
  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    supabase
      .from("technicians")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        if (data) {
          setForm({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            expertise: data.expertise || "",
            experience: data.experience || "",
            service_radius: data.service_radius || "",
            city: data.city || "",
            state: data.state || "",
            country: data.country || "",
            pincode: data.pincode || "",
          });
        }
        if (error) setError("Could not fetch profile.");
        setLoading(false);
      });
  }, [user]);

  // Handle form changes
  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    const { error } = await supabase
      .from("technicians")
      .update(form)
      .eq("id", user.id);
    if (error) {
      setError("Failed to update profile.");
    } else {
      setSuccess("Profile updated successfully!");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-24 text-black bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Technician Settings</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Expertise</label>
          <input
            name="expertise"
            value={form.expertise}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Experience (years)</label>
          <input
            name="experience"
            type="number"
            value={form.experience}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Service Radius (km)</label>
          <input
            name="service_radius"
            type="number"
            value={form.service_radius}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">City</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">State</label>
          <input
            name="state"
            value={form.state}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Country</label>
          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Pincode</label>
          <input
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default TechnicianSettings;