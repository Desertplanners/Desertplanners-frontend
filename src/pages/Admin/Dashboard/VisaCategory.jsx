import React, { useEffect, useState } from "react";
import {
  FaTrashAlt,
  FaPlus,
  FaEdit,
  FaSave,
  FaTimes,
  FaFileAlt,
} from "react-icons/fa";
import { Editor } from "@tinymce/tinymce-react";
import { API } from "../../../config/API";
import DataService from "../../../config/DataService";
import toast from "react-hot-toast";
import AdminVisaSubCategory from "./AdminVisaSubCategory";

export default function VisaCategory() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  // SEO modal
  const [showContentModal, setShowContentModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [savingContent, setSavingContent] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [editImage, setEditImage] = useState(null);

  const api = DataService();

  // ================= FETCH =================
  const fetchCategories = async () => {
    try {
      const res = await api.get(API.GET_VISA_CATEGORIES);
      setCategories(res.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= ADD =================
  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const formData = new FormData();
      formData.append("name", newCategory);
      if (newImage) formData.append("image", newImage);

      await api.post(API.ADD_VISA_CATEGORY, formData);

      setNewImage(null);
      setNewCategory("");
      fetchCategories();
    } catch {
      toast.error("Failed to add category");
    }
  };

  // ================= EDIT =================
  const startEdit = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  const saveCategory = async (id) => {
    if (!editName.trim()) return;
    try {
      const formData = new FormData();
      formData.append("name", editName);
      if (editImage) formData.append("image", editImage);

      await api.put(API.UPDATE_VISA_CATEGORY(id), formData);

      setEditImage(null);
      setEditId(null);
      setEditName("");
      fetchCategories();
    } catch {
      toast.error("Update failed");
    }
  };

  // ================= DELETE =================
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(API.DELETE_VISA_CATEGORY(id));
      fetchCategories();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ================= SEO =================
  const openContentModal = async (cat) => {
    try {
      const res = await api.get(API.GET_VISA_CATEGORY_BY_ID(cat._id));
      setActiveCategory(cat);
      setDescription(res.data?.description || "");
      setShowContentModal(true);
    } catch {
      toast.error("Failed to load content");
    }
  };

  const saveContent = async () => {
    try {
      setSavingContent(true);
      await api.put(API.UPDATE_VISA_CATEGORY_DESCRIPTION(activeCategory._id), {
        description,
      });
      toast.success("Content updated");
      setShowContentModal(false);
    } catch {
      toast.error("Save failed");
    } finally {
      setSavingContent(false);
    }
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#fdf2f2] p-10">
  <div className="max-w-7xl mx-auto">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-12">
      <div>
        <h1 className="text-4xl font-extrabold text-[#721011] tracking-tight">
          🛂 Visa Categories
        </h1>
        <p className="text-gray-500 mt-2">
          Manage categories, images, content & subcategories
        </p>
      </div>

      <div className="bg-[#721011]/10 text-[#721011] px-5 py-2 rounded-full text-sm font-medium">
        {categories.length} Categories
      </div>
    </div>

    {/* ADD SECTION */}
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-14">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Add New Category
      </h2>

      <form onSubmit={addCategory} className="grid md:grid-cols-3 gap-6">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Category name..."
          className="border border-gray-200 focus:ring-2 focus:ring-[#e82429] rounded-xl px-4 py-3 outline-none"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewImage(e.target.files[0])}
          className="border border-gray-200 rounded-xl px-4 py-3 bg-white"
        />

        <button
          type="submit"
          className="bg-gradient-to-r from-[#e82429] to-[#721011] text-white rounded-xl py-3 font-semibold hover:scale-105 transition-all duration-300 shadow-md"
        >
          <FaPlus className="inline mr-2" />
          Add Category
        </button>
      </form>
    </div>

    {/* CATEGORY LIST */}
    <div className="space-y-12">
      {categories.map((cat) => (
        <div
          key={cat._id}
          className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition duration-300"
        >

          {/* TOP SECTION */}
          <div className="grid md:grid-cols-4">

            {/* IMAGE */}
            <div className="h-56 bg-gray-100">
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className="md:col-span-3 p-8 flex flex-col justify-between">

              {editId === cat._id ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border rounded-xl px-4 py-3 mb-4"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditImage(e.target.files[0])}
                    className="border rounded-xl px-4 py-3 mb-4"
                  />

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => saveCategory(cat._id)}
                      className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition"
                    >
                      <FaSave />
                    </button>

                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-gray-300 px-5 py-2 rounded-xl hover:bg-gray-400 transition"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-3xl font-bold text-[#721011] mb-3">
                      {cat.name}
                    </h3>

                    {/* DESCRIPTION PREVIEW */}
                    {cat.description ? (
                      <div
                        className="text-gray-600 text-sm line-clamp-3 prose max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: cat.description,
                        }}
                      />
                    ) : (
                      <p className="text-gray-400 text-sm italic">
                        No description added yet.
                      </p>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-6 mt-6">
                    <button
                      type="button"
                      onClick={() => openContentModal(cat)}
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition"
                    >
                      <FaFileAlt /> SEO / Content
                    </button>

                    <button
                      type="button"
                      onClick={() => startEdit(cat)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
                    >
                      <FaEdit /> Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteCategory(cat._id)}
                      className="flex items-center gap-2 text-red-600 hover:text-red-800 transition"
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* SUB CATEGORY SECTION */}
          {editId !== cat._id && (
            <div className="bg-gradient-to-r from-gray-50 to-white border-t border-gray-100 p-8">
              <h4 className="text-lg font-semibold text-gray-700 mb-6">
                Sub Categories
              </h4>

              <div className="bg-white rounded-2xl shadow-inner p-6 border border-gray-100">
                <AdminVisaSubCategory category={cat} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>

  {/* SEO MODAL */}
  {showContentModal && (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center">
      <div className="bg-white w-[95%] max-w-5xl rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#721011]">
            SEO Content – {activeCategory?.name}
          </h2>

          <button
            type="button"
            onClick={() => setShowContentModal(false)}
            className="text-gray-500 hover:text-black"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <Editor
          apiKey="YOUR_TINYMCE_KEY"
          value={description}
          onEditorChange={setDescription}
          init={{
            height: 400,
            toolbar:
              "undo redo | blocks | bold italic underline | bullist numlist | link image | preview code",
          }}
        />

        <div className="text-right mt-6">
          <button
            type="button"
            onClick={saveContent}
            disabled={savingContent}
            className="bg-gradient-to-r from-[#e82429] to-[#721011] text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            {savingContent ? "Saving..." : "Save Content"}
          </button>
        </div>
      </div>
    </div>
  )}
</div>

  );
}
