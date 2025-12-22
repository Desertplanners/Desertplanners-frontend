import React, { useEffect, useState } from "react";
import { API } from "../../../config/API";
import DataService from "../../../config/DataService";
import axios from "axios";
import {
  Pencil,
  Trash2,
  Plus,
  FileText,
  X,
} from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";
import toast from "react-hot-toast";

export default function HolidayCategory() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 CONTENT MODAL STATES
  const [showContentModal, setShowContentModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [savingContent, setSavingContent] = useState(false);

  const api = DataService();

  // ================= FETCH ALL HOLIDAY CATEGORIES =================
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(
        `${API.BASE_URL}${API.GET_HOLIDAY_CATEGORIES}`
      );
      setCategories(data);
    } catch (err) {
      console.log("Error fetching holiday categories:", err);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  // ================= ADD / UPDATE CATEGORY =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Category name is required");

    setLoading(true);

    try {
      if (editId) {
        await axios.put(
          `${API.BASE_URL}${API.UPDATE_HOLIDAY_CATEGORY(editId)}`,
          { name }
        );
      } else {
        await axios.post(`${API.BASE_URL}${API.ADD_HOLIDAY_CATEGORY}`, {
          name,
        });
      }

      setName("");
      setEditId(null);
      getAllCategories();
    } catch (err) {
      console.log("Error:", err);
      alert(err?.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  // ================= DELETE CATEGORY =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await axios.delete(
        `${API.BASE_URL}${API.DELETE_HOLIDAY_CATEGORY(id)}`
      );
      getAllCategories();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  // ================= EDIT CATEGORY =================
  const handleEdit = (cat) => {
    setEditId(cat._id);
    setName(cat.name);
  };

  // ================= OPEN CONTENT MODAL =================
  const openContentModal = async (cat) => {
    try {
      const res = await api.get(
        API.GET_HOLIDAY_CATEGORY_BY_ID(cat._id)
      );
      setActiveCategory(cat);
      setDescription(res.data?.description || "");
      setShowContentModal(true);
    } catch {
      toast.error("Failed to load category content");
    }
  };

  // ================= SAVE CONTENT =================
  const saveContent = async () => {
    try {
      setSavingContent(true);
      await api.put(
        API.UPDATE_HOLIDAY_CATEGORY_DESCRIPTION(activeCategory._id),
        { description }
      );
      toast.success("Holiday category content updated");
      setShowContentModal(false);
    } catch {
      toast.error("Failed to save content");
    } finally {
      setSavingContent(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-[#721011]">
        🏖️ Holiday Categories
      </h2>

      {/* ADD / EDIT FORM */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 mb-8 bg-[#f9f3f3] p-4 rounded-xl"
      >
        <input
          type="text"
          placeholder="Enter holiday category name"
          className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#e82429]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          type="submit"
          className="flex items-center gap-2 bg-gradient-to-r from-[#e82429] to-[#721011] text-white px-4 py-3 rounded-xl shadow hover:opacity-90 transition-all"
        >
          <Plus size={18} />
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {/* CATEGORY LIST */}
      <div className="overflow-x-auto">
        <table className="w-full border rounded-xl overflow-hidden">
          <thead className="bg-[#721011] text-white">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Category Name</th>
              <th className="p-3 text-left">Slug</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.length > 0 ? (
              categories.map((cat, index) => (
                <tr
                  key={cat._id}
                  className="border-b hover:bg-[#f8f0f0] transition"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-medium">{cat.name}</td>
                  <td className="p-3 text-gray-600">{cat.slug}</td>

                  <td className="p-3 flex items-center justify-center gap-4">
                    {/* CONTENT */}
                    <button
                      type="button"
                      onClick={() => openContentModal(cat)}
                      className="text-purple-600 hover:text-purple-800"
                      title="Manage Content"
                    >
                      <FileText size={20} />
                    </button>

                    {/* EDIT */}
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={20} />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-6 text-gray-500 italic"
                >
                  No holiday categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="mt-4 text-center text-[#721011] font-medium">
          Saving category...
        </div>
      )}

      {/* ================= CONTENT MODAL ================= */}
      {showContentModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white w-[95%] max-w-4xl rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#721011]">
                SEO Content – {activeCategory?.name}
              </h2>
              <button onClick={() => setShowContentModal(false)}>
                <X />
              </button>
            </div>

            <Editor
              apiKey="8s89n75h7ygps6blc3zk8y0mkkid5zf3f505scrck14fx9ol"
              value={description}
              onEditorChange={setDescription}
              init={{
                height: 400,
                menubar: "file edit view insert format tools table help",
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | bold italic underline | forecolor backcolor | " +
                  "alignleft aligncenter alignright alignjustify | bullist numlist | " +
                  "removeformat | link image media table | fullscreen preview code",
                block_formats:
                  "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4",
              }}
            />

            <div className="text-right mt-4">
              <button
                onClick={saveContent}
                disabled={savingContent}
                className="bg-gradient-to-r from-[#e82429] to-[#721011] text-white px-6 py-2 rounded-xl"
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
