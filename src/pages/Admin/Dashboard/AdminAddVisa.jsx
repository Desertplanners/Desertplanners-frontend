import React, { useState, useEffect } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import { FaPlus, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AdminAddVisa({ closeModal, fetchVisas, editVisa }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    price: "",
    overview: "",
    details: "",
    visaType: "",
    processingTime: "",
    entryType: "",
    validity: "",
    stayDuration: "",
    gallery: [],
    inclusions: [],
    exclusions: [],
    documents: [],
    relatedVisas: [],
    visaCategory: "", // ✅ visaCategory field
  });

  const [allVisas, setAllVisas] = useState([]);
  const [visaCategories, setVisaCategories] = useState([]); // ✅ all categories list
  const [loading, setLoading] = useState(false);
  const api = DataService();

  // ✅ Prefill form if editing (auto select category fix)
  useEffect(() => {
    if (editVisa) {
      setFormData({
        ...editVisa,
        visaCategory:
          editVisa.visaCategory && editVisa.visaCategory._id
            ? editVisa.visaCategory._id
            : editVisa.visaCategory || "",
      });
    }
  }, [editVisa]);

  // ✅ Auto-generate slug from title
  useEffect(() => {
    const slug = formData.title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  }, [formData.title]);

  // ✅ Fetch all visas for related list
  useEffect(() => {
    const fetchAllVisas = async () => {
      try {
        const res = await api.get(API.GET_VISAS);
        const visasArray = Array.isArray(res.data)
          ? res.data
          : res.data.visas || [];
        setAllVisas(visasArray);
      } catch {
        toast.error("Error fetching visas");
      }
    };
    fetchAllVisas();
  }, []);

  // ✅ Fetch all Visa Categories
  useEffect(() => {
    const fetchVisaCategories = async () => {
      try {
        const res = await api.get(API.GET_VISA_CATEGORIES);
        setVisaCategories(res.data || []);
      } catch {
        toast.error("Error fetching visa categories");
      }
    };
    fetchVisaCategories();
  }, []);

  // ✅ Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ For array fields
  const handleArrayChange = (e, key, index) => {
    const arr = [...formData[key]];
    arr[index] = e.target.value;
    setFormData((prev) => ({ ...prev, [key]: arr }));
  };

  const handleAddField = (key) => {
    setFormData((prev) => ({ ...prev, [key]: [...prev[key], ""] }));
  };

  const handleRemoveField = (key, index) => {
    const arr = [...formData[key]];
    arr.splice(index, 1);
    setFormData((prev) => ({ ...prev, [key]: arr }));
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editVisa) {
        await api.put(API.UPDATE_VISA(editVisa._id), formData);
      } else {
        await api.post(API.ADD_VISA, formData);
      }
      fetchVisas();
      closeModal();
      toast.success("Visa saved successfully!");
    } catch (err) {
      toast.error("Error saving visa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-10 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-3xl font-bold mb-6 text-[#721011]">
          {editVisa ? "Edit Visa" : "Add New Visa"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "title",
              "slug",
              "price",
              "overview",
              "details",
              "visaType",
              "processingTime",
              "entryType",
              "validity",
              "stayDuration",
            ].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1 capitalize">
                  {field}
                </label>
                <input
                  type={field === "price" ? "number" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e82429]"
                  required={["title", "price", "overview"].includes(field)}
                  disabled={field === "slug"}
                />
              </div>
            ))}

            {/* ✅ Visa Category Dropdown */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Visa Category
              </label>
              <select
                name="visaCategory"
                value={formData.visaCategory}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e82429]"
                required
              >
                <option value="">Select Visa Category</option>
                {visaCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Array Fields */}
          {["gallery", "inclusions", "exclusions", "documents"].map((key) => (
            <div key={key} className="border rounded-xl p-4 bg-gray-50">
              <h3 className="font-semibold text-[#e82429] mb-2 capitalize">
                {key}
              </h3>
              {formData[key].map((val, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => handleArrayChange(e, key, idx)}
                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e82429]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveField(key, idx)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 rounded-lg flex items-center justify-center"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddField(key)}
                className="flex items-center gap-2 bg-[#e82429] hover:bg-[#721011] text-white px-4 py-2 rounded-lg mt-2"
              >
                <FaPlus /> Add {key.slice(0, -1)}
              </button>
            </div>
          ))}

          {/* Related Visas */}
          <div className="border rounded-xl p-4 bg-gray-50">
            <h3 className="font-semibold text-[#e82429] mb-2">Related Visas</h3>
            {formData.relatedVisas.map((val, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <select
                  value={val}
                  onChange={(e) => handleArrayChange(e, "relatedVisas", idx)}
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e82429]"
                >
                  <option value="">Select Visa</option>
                  {allVisas
                    .filter((v) => (editVisa ? v._id !== editVisa._id : true))
                    .map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.title}
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveField("relatedVisas", idx)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 rounded-lg flex items-center justify-center"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddField("relatedVisas")}
              className="flex items-center gap-2 bg-[#e82429] hover:bg-[#721011] text-white px-4 py-2 rounded-lg mt-2"
            >
              <FaPlus /> Add Related Visa
            </button>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-2 rounded-lg border hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#e82429] to-[#721011] text-white hover:scale-105 transition-transform"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
