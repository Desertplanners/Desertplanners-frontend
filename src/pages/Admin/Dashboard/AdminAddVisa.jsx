import React, { useState, useEffect } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import { FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AdminAddVisa({ closeModal, fetchVisas, editVisa }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    price: "",
    visaType: "",
    processingTime: "",
    entryType: "",
    validity: "",
    stayDuration: "",
    img: "",
    imgFile: null, // 👈 for main image upload
    gallery: [],
    galleryFiles: [], // 👈 for gallery upload
    overview: [""],
    inclusions: [],
    exclusions: [],
    documents: [],
    howToApply: [],
    termsAndConditions: [],
    relatedVisas: [],
    visaCategory: "",
    visaSubCategory: "",
    status: "draft",
  });

  const [allVisas, setAllVisas] = useState([]);
  const [visaCategories, setVisaCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visaSubCategories, setVisaSubCategories] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  const api = DataService();

  // ✅ Prefill if editing
  useEffect(() => {
    if (editVisa) {
      setFormData((prev) => ({
        ...prev,
        title: editVisa.title || "",
        slug: editVisa.slug || "",
        price: editVisa.price || "",
        visaType: editVisa.visaType || "",
        processingTime: editVisa.processingTime || "",
        entryType: editVisa.entryType || "",
        validity: editVisa.validity || "",
        stayDuration: editVisa.stayDuration || "",
        img: editVisa.img || "",
        overview: editVisa.overview?.length ? editVisa.overview : [""],
        gallery: editVisa.gallery || [],
        inclusions: editVisa.inclusions || [],
        exclusions: editVisa.exclusions || [],
        documents: editVisa.documents || [],
        howToApply: editVisa.howToApply || [],
        termsAndConditions: editVisa.termsAndConditions || [],
        relatedVisas: editVisa.relatedVisas || [],
        visaCategory: editVisa.visaCategory?._id || editVisa.visaCategory || "",
        visaSubCategory: editVisa.visaSubCategory?._id || "",
        status: editVisa.status || "draft",
      }));
    }
  }, [editVisa]);

  // ✅ Auto Slug
  useEffect(() => {
    const slug = formData.title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  }, [formData.title]);

  // ✅ Fetch all visas
  useEffect(() => {
    const fetchAllVisas = async () => {
      try {
        const res = await api.get(API.GET_VISAS);
        setAllVisas(Array.isArray(res.data) ? res.data : res.data.visas || []);
      } catch {
        toast.error("Error fetching visas");
      }
    };
    fetchAllVisas();
  }, []);

  // ✅ Fetch visa categories
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

  useEffect(() => {
    if (!formData.visaCategory) {
      setVisaSubCategories([]);
      setFormData((prev) => ({ ...prev, visaSubCategory: "" }));
      return;
    }

    const fetchSubCategories = async () => {
      try {
        setLoadingSubs(true);
        const res = await api.get(
          API.GET_VISA_SUBCATEGORIES_BY_CATEGORY(formData.visaCategory)
        );
        setVisaSubCategories(res.data || []);
      } catch {
        toast.error("Failed to load visa sub categories");
      } finally {
        setLoadingSubs(false);
      }
    };

    fetchSubCategories();
  }, [formData.visaCategory]);

  // ✅ Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Array field handling
  const handleArrayChange = (e, key, index) => {
    const arr = [...formData[key]];
    arr[index] = e.target.value;
    setFormData((prev) => ({ ...prev, [key]: arr }));
  };

  const handleAddField = (key) =>
    setFormData((prev) => ({ ...prev, [key]: [...prev[key], ""] }));

  const handleRemoveField = (key, index) => {
    const arr = [...formData[key]];
    arr.splice(index, 1);
    setFormData((prev) => ({ ...prev, [key]: arr }));
  };

  // ✅ Main Image Upload
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imgFile: file,
        img: URL.createObjectURL(file),
      }));
    }
  };

  // ✅ Gallery Upload
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      const previews = files.map((f) => URL.createObjectURL(f));
      setFormData((prev) => ({
        ...prev,
        galleryFiles: [...prev.galleryFiles, ...files],
        gallery: [...prev.gallery, ...previews],
      }));
    }
  };

  // ✅ Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append normal fields
      Object.entries(formData).forEach(([key, value]) => {
        if (["imgFile", "galleryFiles"].includes(key)) return; // skip files here
        if (Array.isArray(value)) {
          value.forEach((v) => formDataToSend.append(key, v));
        } else {
          formDataToSend.append(key, value);
        }
      });

      // Append main image
      if (formData.imgFile) {
        formDataToSend.append("img", formData.imgFile);
      }

      // Append gallery images
      formData.galleryFiles.forEach((file) =>
        formDataToSend.append("gallery", file)
      );

      if (editVisa) {
        await api.put(API.UPDATE_VISA(editVisa._id), formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post(API.ADD_VISA, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchVisas();
      closeModal();
      toast.success("Visa saved successfully!");
    } catch (err) {
      console.error(err);
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
          {/* BASIC FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "title",
              "slug",
              "price",
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
                  required={["title", "price"].includes(field)}
                  disabled={field === "slug"}
                />
              </div>
            ))}

            {/* Visa Category Dropdown */}
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
              {/* Visa Sub Category */}
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1">
                  Visa Sub Category
                </label>

                <select
                  name="visaSubCategory"
                  value={formData.visaSubCategory}
                  onChange={handleChange}
                  disabled={!formData.visaCategory || loadingSubs}
                  required
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e82429]"
                >
                  <option value="">
                    {loadingSubs
                      ? "Loading sub categories..."
                      : "Select Visa Sub Category"}
                  </option>

                  {visaSubCategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>

                {!loadingSubs &&
                  formData.visaCategory &&
                  visaSubCategories.length === 0 && (
                    <span className="text-xs text-red-500 mt-1">
                      No sub categories found for this category
                    </span>
                  )}
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e82429]"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* MAIN IMAGE UPLOAD */}
          <div className="border rounded-xl p-4 bg-gray-50">
            <h3 className="font-semibold text-[#e82429] mb-2">Main Image</h3>
            {formData.img && (
              <img
                src={formData.img}
                alt="Visa Preview"
                className="w-32 h-32 object-cover rounded-lg border mb-3"
              />
            )}
            <label className="cursor-pointer flex items-center gap-2 bg-[#e82429] text-white px-4 py-2 rounded-lg w-fit hover:bg-[#721011] transition">
              <FaUpload /> Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleMainImageChange}
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Recommended size:{" "}
              <span className="font-semibold">350 × 250 px</span>
            </p>
          </div>

          {/* GALLERY UPLOAD */}
          {/* <div className="border rounded-xl p-4 bg-gray-50">
            <h3 className="font-semibold text-[#e82429] mb-3">
              Gallery Images
            </h3>

            <div className="flex flex-wrap gap-3 mb-3">
              {formData.gallery.map((url, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={url}
                    alt={`gallery-${idx}`}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveField("gallery", idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <label className="cursor-pointer flex items-center gap-2 bg-[#e82429] text-white px-4 py-2 rounded-lg w-fit hover:bg-[#721011] transition">
              <FaUpload /> Upload Gallery
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleGalleryChange}
              />
            </label>
          </div> */}

          {/* ARRAY FIELDS */}
          {[
            { key: "overview", label: "Overview Points" },
            { key: "inclusions", label: "Inclusions" },
            { key: "exclusions", label: "Exclusions" },
            { key: "documents", label: "Required Documents" },
            { key: "howToApply", label: "How to Apply" },
            { key: "termsAndConditions", label: "Terms & Conditions" },
          ].map(({ key, label }) => (
            <div key={key} className="border rounded-xl p-4 bg-gray-50">
              <h3 className="font-semibold text-[#e82429] mb-2">{label}</h3>
              {(formData[key] || []).map((val, idx) => (
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
                    className="bg-red-500 text-white px-3 rounded-lg"
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
                <FaPlus /> Add {label}
              </button>
            </div>
          ))}

          {/* RELATED VISAS */}
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
                  className="bg-red-500 text-white px-3 rounded-lg"
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

          {/* BUTTONS */}
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
