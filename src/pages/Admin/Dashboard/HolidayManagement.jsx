import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaClock,
  FaMoneyBillWave,
  FaTags,
} from "react-icons/fa";
import AddHolidayTourForm from "./AddHolidayTour";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import toast from "react-hot-toast";

export default function HolidayManagement() {
  const api = DataService();

  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [editTour, setEditTour] = useState(null);

  // ---------- Fetch ----------
  const fetchTours = async () => {
    try {
      const res = await api.get(API.GET_ALL_HOLIDAY_TOURS);
      setTours(res.data.tours || []);
    } catch (error) {
      toast.error("Failed to load holiday tours");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTours();
  }, []);

  // ---------- Delete ----------
  const deleteTour = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tour?")) return;

    try {
      await api.delete(API.DELETE_HOLIDAY_TOUR(id));
      setTours(tours.filter((t) => t._id !== id));
      toast.success("Tour deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Holiday Management</h1>

        <button
          onClick={() => {
            setEditTour(null);
            setOpenModal(true);
          }}
          className="flex items-center gap-2 bg-[#e82429] text-white px-4 py-2 rounded hover:bg-[#721011] transition"
        >
          <FaPlus /> Add New Holiday
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-gray-600">Loading holidays...</div>
      ) : tours.length === 0 ? (
        <div className="text-gray-600">No holiday tours found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Thumbnail - HEIGHT UPDATED */}
              <div className="h-56 w-full overflow-hidden relative">
                <img
                  src={t.sliderImages?.[0] || "/no-image.png"}
                  alt={t.title}
                  className="w-full h-full object-cover"
                />

                {/* Category tag */}
                {t.category && (
                  <div className="absolute top-3 left-3 bg-[#721011]/90 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md">
                    {t.category?.name || "Category"}
                  </div>
                )}
              </div>

              {/* Card content */}
              <div className="p-5 space-y-2">
                {/* Category inside */}
                {t.category && (
                  <div className="inline-flex items-center gap-1 bg-[#e82429]/15 text-[#e82429] px-3 py-1 rounded-full text-xs font-semibold">
                    <FaTags className="text-[#e82429]" size={12} />
                    {t.category?.name}
                  </div>
                )}

                <h2 className="text-lg font-bold text-[#404041] truncate mt-1">
                  {t.title}
                </h2>

                <p className="text-sm text-gray-700 flex items-center gap-2 font-medium">
                  <FaClock className="text-[#e82429]" /> {t.duration}
                </p>

                <p className="text-sm text-gray-700 flex items-center gap-2 font-semibold">
                  <FaMoneyBillWave className="text-green-600" /> USD{" "}
                  {t.priceAdult}
                </p>

                <p className="text-gray-600 text-sm line-clamp-3">
                  {t.description || "No description available."}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-[#e82429]/20 text-[#e82429] px-2 py-1 rounded-full text-xs font-medium">
                    Adults: {t.priceAdult}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 mt-3">
                  <button
                    onClick={() => {
                      setEditTour(t);
                      setOpenModal(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 transition"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => deleteTour(t._id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------- TOP-UP POPUP MODAL (Updated) ---------- */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fadeIn">

            {/* Close Button */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
            >
              ✕
            </button>

            {/* Add/Edit Form */}
            <AddHolidayTourForm
              closeModal={() => setOpenModal(false)}
              fetchHolidays={fetchTours}
              editHoliday={editTour}
            />
          </div>
        </div>
      )}
    </div>
  );
}
