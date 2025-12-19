import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaPlus, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { API } from "../../../config/API";
import DataService from "../../../config/DataService";
import toast from "react-hot-toast";

export default function BlogCategory() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  // Fetch Blog Categories
  const fetchCategories = async () => {
    try {
      const api = DataService();
      const res = await api.get(API.GET_BLOG_CATEGORIES);
      setCategories(res.data || []);
    } catch (err) {
      toast.error("Error fetching blog categories");
    }
  };

  // Add Blog Category
  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return toast.error("Category name required");

    try {
      setLoading(true);
      const api = DataService();
      await api.post(API.ADD_BLOG_CATEGORY, { name: newCategory });
      setNewCategory("");
      toast.success("Blog category added");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding category");
    } finally {
      setLoading(false);
    }
  };

  // Delete Blog Category
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this blog category?")) return;

    try {
      const api = DataService();
      await api.delete(API.DELETE_BLOG_CATEGORY(id));
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // Start Edit
  const startEdit = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name);
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  // Save Updated Category
  const saveCategory = async (id) => {
    if (!editName.trim()) return toast.error("Category name cannot be empty");

    try {
      const api = DataService();
      await api.put(API.UPDATE_BLOG_CATEGORY(id), { name: editName });
      toast.success("Category updated");
      setEditId(null);
      setEditName("");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-[#721011] mb-6 text-center">
          📝 Manage Blog Categories
        </h1>

        {/* Add Category */}
        <form
          onSubmit={addCategory}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-6"
        >
          <input
            type="text"
            placeholder="Enter blog category name..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#e82429] outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#e82429] to-[#721011] text-white font-semibold px-6 py-2 rounded-xl flex items-center gap-2 hover:scale-105 transition"
          >
            <FaPlus /> {loading ? "Adding..." : "Add"}
          </button>
        </form>

        {/* Category List */}
        <div className="border-t border-gray-200 pt-4">
          {categories.length === 0 ? (
            <p className="text-center text-gray-500">
              No blog categories added yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li
                  key={cat._id}
                  className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition rounded-xl px-4 py-3 border"
                >
                  {editId === cat._id ? (
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 border rounded-lg px-3 py-1 focus:ring-2 focus:ring-[#e82429] outline-none"
                      />
                      <button
                        onClick={() => saveCategory(cat._id)}
                        className="text-green-600"
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-gray-500"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-gray-700">
                        {cat.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => startEdit(cat)}
                          className="text-blue-500"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteCategory(cat._id)}
                          className="text-red-500"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
