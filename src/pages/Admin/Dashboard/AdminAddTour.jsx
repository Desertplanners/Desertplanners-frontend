import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function AdminAddTour({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "",
    mainImage: "",
    description: "",
    services: [],
  });

  const [service, setService] = useState({
    title: "",
    slug: "",
    img: "",
    price: "",
    duration: "",
    overview: "",
    highlights: [""],
    needToKnow: [""],
    restrictions: [""],
    mapUrl: "",
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    "Dubai Tours",
    "Abu Dhabi Tours",
    "Desert Safari",
    "Yacht Ride",
    "Theme Parks",
    "Adventure",
    "Luxury Tours",
    "City Tours",
    "Sightseeing",
    "Romantic Tours",
    "Family Tours",
  ];

  // handlers
  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleServiceChange = (e) => setService({ ...service, [e.target.name]: e.target.value });

  const addServiceToTour = () => {
    if (!service.title) return alert("Please enter service title");
    setForm({ ...form, services: [...form.services, service] });
    setService({
      title: "",
      slug: "",
      img: "",
      price: "",
      duration: "",
      overview: "",
      highlights: [""],
      needToKnow: [""],
      restrictions: [""],
      mapUrl: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/tours", form);
      alert("✅ Tour added successfully!");
      setForm({
        title: "",
        slug: "",
        category: "",
        mainImage: "",
        description: "",
        services: [],
      });
      setLoading(false);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Error adding tour");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white/95 rounded-2xl shadow-2xl w-[90%] max-w-3xl overflow-hidden max-h-[90vh] flex flex-col"
          initial={{ scale: 0.9, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 50, opacity: 0 }}
          transition={{ duration: 0.35, type: "spring" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#e82429] to-[#721011] px-6 py-3 flex justify-between items-center">
            <h2 className="text-white text-lg font-semibold">Add New Tour</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <X size={22} />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="title"
                value={form.title}
                onChange={handleFormChange}
                placeholder="Tour Title"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#e82429] outline-none"
              />
              <input
                name="slug"
                value={form.slug}
                onChange={handleFormChange}
                placeholder="Slug (e.g. dubai-city-tour)"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#e82429] outline-none"
              />

              <select
                name="category"
                value={form.category}
                onChange={handleFormChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#e82429] outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <input
                name="mainImage"
                value={form.mainImage}
                onChange={handleFormChange}
                placeholder="Main Image URL"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#e82429] outline-none"
              />
            </div>

            <textarea
              name="description"
              value={form.description}
              onChange={handleFormChange}
              placeholder="Description"
              rows="3"
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#e82429] outline-none"
            />

            <hr className="my-4 border-gray-300" />

            <h3 className="text-lg font-semibold text-[#721011]">
              ➕ Add Service
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="title"
                value={service.title}
                onChange={handleServiceChange}
                placeholder="Service Title"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#e82429] outline-none"
              />
              <input
                name="slug"
                value={service.slug}
                onChange={handleServiceChange}
                placeholder="Service Slug (e.g. morning-desert)"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#e82429] outline-none"
              />
              <input
                name="img"
                value={service.img}
                onChange={handleServiceChange}
                placeholder="Service Image URL"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#e82429] outline-none"
              />
              <input
                name="price"
                value={service.price}
                onChange={handleServiceChange}
                placeholder="Price (AED)"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#e82429] outline-none"
              />
              <input
                name="duration"
                value={service.duration}
                onChange={handleServiceChange}
                placeholder="Duration"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#e82429] outline-none"
              />
            </div>

            <textarea
              name="overview"
              value={service.overview}
              onChange={handleServiceChange}
              placeholder="Service Overview"
              rows="3"
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#e82429] outline-none"
            />

            <input
              name="mapUrl"
              value={service.mapUrl}
              onChange={handleServiceChange}
              placeholder="Google Map Embed URL"
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#e82429] outline-none"
            />

            <button
              type="button"
              onClick={addServiceToTour}
              className="bg-[#721011] hover:bg-[#a31616] text-white py-2 px-4 rounded-lg mt-2 transition-all"
            >
              ➕ Add Service to Tour
            </button>

            {form.services.length > 0 && (
              <div className="bg-[#fff4f4] border border-[#e82429]/30 rounded-xl p-3 mt-3">
                <h4 className="font-semibold mb-2 text-[#721011]">
                  Services Added:
                </h4>
                <ul className="text-sm text-gray-700 list-disc list-inside">
                  {form.services.map((s, i) => (
                    <li key={i}>{s.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#e82429] to-[#721011] text-white font-semibold shadow-md hover:scale-[1.02] transition-all"
            >
              {loading ? "Saving..." : "Save Tour"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
