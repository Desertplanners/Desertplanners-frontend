import React, { useState, useEffect } from "react";
import Section from "../Dashboard/Section";
import AdminAddTour from "./AdminAddTour";
import { API } from "../../../config/API";
import DataService from "../../../config/DataService";
import toast from "react-hot-toast";

export default function ToursManagement() {
  const [open, setOpen] = useState(false);
  const [tours, setTours] = useState([]);
  const [editTour, setEditTour] = useState(null);
  const [search, setSearch] = useState(""); // ⭐ Search State

  // Fetch Tours
  const fetchTours = async () => {
    try {
      const api = DataService();
      const res = await api.get(API.GET_TOURS);
      setTours(res.data);
    } catch (err) {
      toast.error("Error fetching tours:", err);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleSuccess = async () => {
    setOpen(false);
    setEditTour(null);
    await fetchTours();
  };

  const handleEdit = (tour) => {
    setEditTour(tour);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tour?")) return;
    try {
      const api = DataService();
      await api.delete(API.DELETE_TOUR(id));
      toast("Tour deleted successfully!");
      fetchTours();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error deleting tour");
    }
  };

  // ⭐ Apply Search Filter
  const filteredTours = tours.filter((t) => {
    const text = `${t.title} ${t.category?.name} ${t.duration}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <Section title="Manage Tours">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">

        <h2 className="text-2xl font-bold text-[var(--color-neutral)]">
          All Tours
        </h2>

        {/* ⭐ SUPER PREMIUM SEARCH BAR */}
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search tours..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full px-12 py-2
              rounded-full
              bg-white/70 backdrop-blur-md
              border border-gray-200
              shadow-md
              focus:ring-2 focus:ring-[var(--color-primary)]
              focus:border-[var(--color-primary)]
              outline-none
              transition-all duration-300
              hover:shadow-lg
              placeholder:text-gray-400
            "
          />

          {/* Search Icon */}
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-[18px]">
            🔍
          </span>

          {/* Clear Button */}
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg hover:text-red-500 transition"
            >
              ✕
            </button>
          )}
        </div>

        {/* Add Button */}
        <button
          onClick={() => {
            setOpen(true);
            setEditTour(null);
          }}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-white)] px-6 py-2 rounded-lg shadow-lg transition-all font-semibold"
        >
          + Add New Tour
        </button>
      </div>

      {/* Add/Edit Modal */}
      {open && (
        <div className="fixed top-0 left-0 w-full h-full flex items-start justify-center z-50 bg-black/30">
          <div className="bg-[var(--color-white)] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[80vh] p-6 overflow-y-auto relative animate-slide-down mt-10">

            <button
              onClick={() => {
                setOpen(false);
                setEditTour(null);
              }}
              className="absolute top-4 right-4 text-[var(--color-neutral)] hover:text-[var(--color-primary)] text-2xl font-bold transition-colors"
            >
              &times;
            </button>

            <AdminAddTour
              tour={editTour}
              onClose={() => {
                setOpen(false);
                setEditTour(null);
              }}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      )}

      {/* TOURS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTours.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">No matching tours found</p>
        ) : (
          filteredTours.map((tour) => (
            <div
              key={tour._id}
              className="bg-[var(--color-white)] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 relative"
            >
              <div className="relative">
                <img
                  src={
                    tour.mainImage
                      ? tour.mainImage.startsWith("http")
                        ? tour.mainImage
                        : `${
                            import.meta.env.VITE_API_URL ||
                            "https://desetplanner-backend.onrender.com"
                          }/${tour.mainImage}`
                      : "https://via.placeholder.com/400x200"
                  }
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                />

                <span className="absolute top-3 left-3 bg-[var(--color-accent)] text-[var(--color-white)] text-xs font-semibold px-2 py-1 rounded-full shadow">
                  {tour.category?.name || "Uncategorized"}
                </span>

                <span
                  className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full shadow ${
                    tour.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {tour.status || "Active"}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="text-lg font-bold text-[var(--color-neutral)] hover:text-[var(--color-primary)] transition-colors cursor-pointer">
                  {tour.title}
                </h3>

                <p className="text-gray-500 text-sm">
                  {tour.description?.slice(0, 80)}...
                </p>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-[var(--color-neutral)] text-xs font-semibold px-2 py-1 rounded-full">
                    {tour.duration || "N/A"}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(tour)}
                      className="bg-[var(--color-primary)] text-[var(--color-white)] px-3 py-1 rounded-lg text-sm hover:bg-[var(--color-primary-dark)] transition-all"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(tour._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Animation */}
      <style>{`
        @keyframes slide-down {
          0% { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
      `}</style>

    </Section>
  );
}
