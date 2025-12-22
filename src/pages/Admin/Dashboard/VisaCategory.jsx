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

export default function VisaCategory() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  // 🔥 CONTENT MODAL STATES
  const [showContentModal, setShowContentModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [savingContent, setSavingContent] = useState(false);

  // ================= FETCH VISA CATEGORIES =================
  const fetchCategories = async () => {
    try {
      const api = DataService();
      const res = await api.get(API.GET_VISA_CATEGORIES);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= ADD VISA CATEGORY =================
  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return alert("Please enter a visa category name");

    try {
      setLoading(true);
      const api = DataService();
      await api.post(API.ADD_VISA_CATEGORY, { name: newCategory });
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding visa category");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE VISA CATEGORY =================
  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const api = DataService();
      await api.delete(API.DELETE_VISA_CATEGORY(id));
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= EDIT VISA CATEGORY NAME =================
  const startEdit = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  const saveCategory = async (id) => {
    if (!editName.trim()) return alert("Category name cannot be empty");
    try {
      const api = DataService();
      await api.put(API.UPDATE_VISA_CATEGORY(id), { name: editName });
      setEditId(null);
      setEditName("");
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Error updating visa category");
    }
  };

  // ================= OPEN CONTENT MODAL =================
  const openContentModal = async (cat) => {
    try {
      const api = DataService();
      const res = await api.get(API.GET_VISA_CATEGORY_BY_ID(cat._id));
      setActiveCategory(cat);
      setDescription(res.data?.description || "");
      setShowContentModal(true);
    } catch {
      toast.error("Failed to load visa category content");
    }
  };

  // ================= SAVE CONTENT =================
  const saveContent = async () => {
    try {
      setSavingContent(true);
      const api = DataService();
      await api.put(
        API.UPDATE_VISA_CATEGORY_DESCRIPTION(activeCategory._id),
        { description }
      );
      toast.success("Visa category content updated");
      setShowContentModal(false);
    } catch {
      toast.error("Failed to save content");
    } finally {
      setSavingContent(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-[#721011] mb-6 text-center">
          🛂 Manage Visa Categories
        </h1>

        {/* ADD CATEGORY */}
        <form
          onSubmit={addCategory}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <input
            type="text"
            placeholder="Enter new visa category name..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 border rounded-xl px-4 py-2"
          />
          <button className="bg-gradient-to-r from-[#e82429] to-[#721011] text-white px-6 py-2 rounded-xl">
            <FaPlus /> Add
          </button>
        </form>

        {/* CATEGORY LIST */}
        <ul className="space-y-3">
          {categories.map((cat) => (
            <li
              key={cat._id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border"
            >
              {editId === cat._id ? (
                <div className="flex gap-3 flex-1">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 border rounded px-3 py-1"
                  />
                  <button onClick={() => saveCategory(cat._id)}>
                    <FaSave className="text-green-600" />
                  </button>
                  <button onClick={cancelEdit}>
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <>
                  <span className="font-medium">{cat.name}</span>
                  <div className="flex gap-3">
                    {/* ⭐ CONTENT BUTTON */}
                    <button
                      type="button"
                      onClick={() => openContentModal(cat)}
                      className="text-purple-600"
                      title="Manage Content"
                    >
                      <FaFileAlt />
                    </button>

                    <button
                      onClick={() => startEdit(cat)}
                      className="text-blue-600"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => deleteCategory(cat._id)}
                      className="text-red-600"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* ================= CONTENT MODAL ================= */}
      {showContentModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white w-[95%] max-w-4xl rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#721011]">
                SEO Content – {activeCategory?.name}
              </h2>
              <button onClick={() => setShowContentModal(false)}>
                <FaTimes />
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
                  "undo redo | blocks | " +
                  "bold italic underline strikethrough | forecolor backcolor | " +
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist outdent indent | " +
                  "removeformat | link image media table | fullscreen preview code",
                block_formats:
                  "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
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
