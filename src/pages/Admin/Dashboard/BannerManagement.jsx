import React, { useState, useEffect } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import toast from "react-hot-toast";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function BannerManagement() {
  const api = DataService("admin");
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editBanner, setEditBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    price: "",
    cta: "",
    link: "",
    order: 0,
    desktopImage: null,
    mobileImage: null,
  });

  // 🧠 Fetch all banners
  const fetchBanners = async () => {
    try {
      const res = await api.get(API.GET_BANNERS);
      setBanners(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch banners");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // 📸 File handler
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  // ✏️ Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 💾 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "")
        data.append(key, formData[key]);
    });

    try {
      if (editBanner) {
        await api.put(API.UPDATE_BANNER(editBanner._id), data, {
          headers: { "Content-Type": "multipart/form-data" }, // ✅ critical
        });
        toast.success("✅ Banner updated successfully");
      } else {
        await api.post(API.ADD_BANNER, data, {
          headers: { "Content-Type": "multipart/form-data" }, // ✅ critical
        });
        toast.success("✅ Banner added successfully");
      }

      fetchBanners();
      setEditBanner(null);
      setFormData({
        title: "",
        subtitle: "",
        price: "",
        cta: "",
        link: "",
        order: 0,
        desktopImage: null,
        mobileImage: null,
      });
    } catch (err) {
      console.error("❌ Banner save failed:", err);
      toast.error("Failed to save banner");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await api.delete(API.DELETE_BANNER(id));
      toast.success("🗑️ Banner deleted");
      fetchBanners();
    } catch {
      toast.error("Error deleting banner");
    }
  };

  // ✏️ Edit
  const handleEdit = (banner) => {
    setEditBanner(banner);
    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      price: banner.price || "",
      cta: banner.cta || "",
      link: banner.link || "",
      order: banner.order || 0,
      desktopImage: null,
      mobileImage: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-10">
      {/* Form Section */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-[#721011] mb-6">
          {editBanner ? "✏️ Edit Banner" : "➕ Add New Banner"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {["title", "subtitle", "price", "cta", "link", "order"].map((f) => (
            <div key={f}>
              <label className="block text-gray-700 capitalize mb-1">{f}</label>
              <input
                type={f === "order" ? "number" : "text"}
                name={f}
                value={formData[f]}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e82429]"
                required={f === "title"}
              />
            </div>
          ))}

          {/* Image upload */}
          <div>
            <label className="block text-gray-700 mb-1">Desktop Image</label>
            <p className="text-xs text-gray-500 mt-1">
            Recommended size:{" "}
            <span className="font-semibold">1200 × 768 px</span>
          </p>
            <input
              type="file"
              name="desktopImage"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border rounded-lg px-3 py-2"
              required={!editBanner}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Mobile Image</label>
            <p className="text-xs text-gray-500 mt-1">
            Recommended size:{" "}
            <span className="font-semibold">768 × 1200 px</span>
          </p>
            <input
              type="file"
              name="mobileImage"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border rounded-lg px-3 py-2"
              required={!editBanner}
            />
          </div>

          <div className="col-span-full flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#e82429] to-[#721011] text-white font-semibold hover:scale-105 transition-transform"
            >
              {loading
                ? "Saving..."
                : editBanner
                ? "Update Banner"
                : "Add Banner"}
            </button>
          </div>
        </form>
      </div>

      {/* Banner List */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-[#721011] mb-4">📜 All Banners</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {banners.length === 0 && (
            <p className="text-gray-500 text-center col-span-full">
              No banners found.
            </p>
          )}

          {banners.map((b) => (
            <div
              key={b._id}
              className="relative rounded-xl overflow-hidden shadow-md group"
            >
              <img
                src={b.desktopImage}
                alt={b.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end text-white p-4">
                <h3 className="font-bold text-lg">{b.title}</h3>
                <p className="text-sm opacity-80">{b.subtitle}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => handleEdit(b)}
                  className="bg-white/90 text-[#721011] p-2 rounded-full hover:bg-white"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(b._id)}
                  className="bg-white/90 text-red-600 p-2 rounded-full hover:bg-white"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
