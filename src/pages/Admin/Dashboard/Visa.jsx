import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaMoneyBillWave,
} from "react-icons/fa";
import AdminAddVisa from "./AdminAddVisa";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import toast from "react-hot-toast";

export default function AdminVisaManagement() {
  const [visas, setVisas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editVisa, setEditVisa] = useState(null);
  const [search, setSearch] = useState(""); // ⭐ NEW - search bar
  const api = DataService();

  const fetchVisas = async () => {
    try {
      const res = await api.get(API.GET_VISAS);
      const visasArray = Array.isArray(res.data)
        ? res.data
        : res.data.visas || [];
      setVisas(visasArray);
    } catch (err) {
      toast.error("Error fetching visas");
      setVisas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisas();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this visa?")) return;
    try {
      await api.delete(API.DELETE_VISA(id));
      setVisas(visas.filter((v) => v._id !== id));
      toast.success("Visa deleted successfully");
    } catch (err) {
      toast.error("Error deleting visa");
    }
  };

  // ⭐ FILTER by Search
  const filteredVisas = visas.filter((v) => {
    const text = `
      ${v.title}
      ${v.slug}
      ${v.visaType}
      ${v.entryType}
      ${v.visaCategory?.name}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Visa Management
        </h1>

        {/* ⭐ PREMIUM SEARCH BAR */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search visas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full px-12 py-2
              rounded-full
              bg-white/70 backdrop-blur-md
              border border-gray-200
              shadow-md
              hover:shadow-lg
              focus:ring-2 focus:ring-red-500
              outline-none
              transition-all duration-300
            "
          />

          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
            🔍
          </span>

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-red-600 transition text-lg"
            >
              ✕
            </button>
          )}
        </div>

        <button
          onClick={() => {
            setOpenModal(true);
            setEditVisa(null);
          }}
          className="flex items-center gap-2 bg-[#e82429] text-white px-4 py-2 rounded-full hover:bg-[#721011] transition shadow-md"
        >
          <FaPlus /> Add New Visa
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-gray-600">Loading visas...</div>
      ) : filteredVisas.length === 0 ? (
        <div className="text-gray-600">No matching visas found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVisas.map((v) => (
            <div
              key={v._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="h-40 w-full overflow-hidden relative">
                <img
                  src={v.gallery?.[0] || v.img || "/placeholder.jpg"}
                  alt={v.title}
                  className="w-full h-full object-cover"
                />

                {/* Category */}
                {v.visaCategory && (
                  <div className="absolute top-3 left-3 bg-[#721011]/90 text-white text-xs px-3 py-1 rounded-full shadow-md">
                    {v.visaCategory?.name}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 space-y-2">
                <h2 className="text-lg font-bold text-[#404041] truncate">
                  {v.title}
                </h2>

                <p className="text-sm text-gray-500 truncate">
                  Slug: {v.slug}
                </p>

                <p className="text-sm text-gray-700 flex items-center gap-1 font-semibold">
                  <FaMoneyBillWave className="text-[#e82429]" /> AED{" "}
                  {v.price}
                </p>

                <p className="text-gray-600 text-sm line-clamp-3">
                  {v.overview || "No description available."}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {v.visaType && (
                    <span className="bg-[#e82429]/20 text-[#e82429] px-2 py-1 rounded-full text-xs font-medium">
                      {v.visaType}
                    </span>
                  )}

                  {v.entryType && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      {v.entryType}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-3">
                  <button
                    onClick={() => {
                      setEditVisa(v);
                      setOpenModal(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 transition"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => handleDelete(v._id)}
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

      {/* Modal */}
      {openModal && (
        <AdminAddVisa
          closeModal={() => setOpenModal(false)}
          fetchVisas={fetchVisas}
          editVisa={editVisa}
        />
      )}
    </div>
  );
}
