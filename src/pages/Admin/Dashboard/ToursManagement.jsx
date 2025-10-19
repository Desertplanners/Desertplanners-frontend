// src/pages/admin/ToursManagement.jsx
import React, { useState, useEffect } from "react";
import Section from "../Dashboard/Section";
import AdminAddTour from "./AdminAddTour";
import axios from "axios";

export default function ToursManagement() {
  const [open, setOpen] = useState(false);
  const [tours, setTours] = useState([]);

  // Fetch all tours
  const fetchTours = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tours");
      setTours(res.data);
    } catch (err) {
      console.error("Error fetching tours:", err);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleSuccess = async () => {
    setOpen(false);
    await fetchTours(); // refresh list after adding tour
  };

  return (
    <Section title="Manage Tours">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Tours</h2>
        <button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white px-6 py-2 rounded-lg shadow-lg transition-all font-semibold"
        >
          + Add New Tour
        </button>
      </div>

      {/* Admin Add Tour Modal */}
      {open && <AdminAddTour onClose={() => setOpen(false)} onSuccess={handleSuccess} />}

      {/* Tours Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">No tours available</p>
        ) : (
          tours.map((tour) => (
            <div
              key={tour._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 relative"
            >
              {/* Tour Image */}
              <div className="relative">
                <img
                  src={tour.mainImage || "https://via.placeholder.com/400x200"}
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                />
                <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                  {tour.category}
                </span>
                <span
                  className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full shadow ${
                    tour.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {tour.status || "Active"}
                </span>
              </div>

              {/* Tour Info */}
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-bold text-gray-800 hover:text-indigo-600 transition-colors cursor-pointer">
                  {tour.title}
                </h3>
                <p className="text-gray-500 text-sm">{tour.description?.slice(0, 80)}...</p>

                <div className="flex justify-between items-center mt-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {tour.services.length} Services
                  </span>
                  <div className="flex gap-2">
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-600 transition-all">
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-all">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Section>
  );
}             
