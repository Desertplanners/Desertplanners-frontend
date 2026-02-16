import React, { useEffect, useState } from "react";
import {
  FaTrashAlt,
  FaPlus,
  FaFileAlt,
  FaTimes,
  FaEdit,
  FaSave,
} from "react-icons/fa";
import { Editor } from "@tinymce/tinymce-react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import toast from "react-hot-toast";
import COUNTRIES from "../../../utils/countries";

export default function AdminVisaSubCategory({ category }) {
  const [subs, setSubs] = useState([]);
  const [newSub, setNewSub] = useState("");

  // edit states
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  // seo modal states
  const [showModal, setShowModal] = useState(false);
  const [activeSub, setActiveSub] = useState(null);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const api = DataService();
 
  // ================= FETCH SUB CATEGORIES =================
  const fetchSubs = async () => {
    try {
      const res = await api.get(
        API.GET_VISA_SUBCATEGORIES_BY_CATEGORY(category._id)
      );
      setSubs(res.data);
    } catch {
      toast.error("Failed to load sub categories");
    }
  };

  useEffect(() => {
    fetchSubs();
  }, [category]);

  // ================= ADD SUB CATEGORY =================
  const addSubCategory = async () => {
    if (!newSub.trim() || !countryCode) {
      toast.error("Sub category name & country required");
      return;
    }

    try {
      await api.post(API.ADD_VISA_SUBCATEGORY, {
        name: newSub,
        visaCategory: category._id,
        countryCode, // ⭐ NEW
      });
      setCountryCode("");
      setNewSub("");
      fetchSubs();
      toast.success("Sub category added");
    } catch (err) {
      if (err.response?.data?.error?.includes("duplicate")) {
        toast.error("This sub category already exists in this visa category");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // ================= DELETE =================
  const deleteSub = async (id) => {
    if (!window.confirm("Delete this sub category?")) return;
    try {
      await api.delete(API.DELETE_VISA_SUBCATEGORY(id));
      fetchSubs();
      toast.success("Sub category deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // ================= EDIT NAME =================
  const startEdit = (sub) => {
    setEditId(sub._id);
    setEditName(sub.name);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) return;
    try {
      await api.put(API.UPDATE_VISA_SUBCATEGORY(id), {
        name: editName,
      });
      toast.success("Sub category updated");
      setEditId(null);
      setEditName("");
      fetchSubs();
    } catch {
      toast.error("Update failed");
    }
  };

  // ================= SEO MODAL =================
  const openContentModal = (sub) => {
    setActiveSub(sub);
    setDescription(sub.description || "");
    setShowModal(true);
  };

  const saveContent = async () => {
    try {
      setSaving(true);
      await api.put(API.UPDATE_VISA_SUBCATEGORY_DESCRIPTION(activeSub._id), {
        description,
      });
      toast.success("SEO content updated");
      setShowModal(false);
      fetchSubs();
    } catch {
      toast.error("Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 ml-6 bg-gray-50 border-l-4 border-[#721011] pl-4 rounded-xl">
      <h3 className="text-md font-semibold mb-3 text-gray-700 flex items-center gap-2">
        <span className="px-2 py-1 bg-gray-200 rounded-full text-xs">
          Sub Categories
        </span>
        <span className="text-sm text-gray-500">under {category.name}</span>
      </h3>

      {/* ADD */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Enter sub category name..."
          value={newSub}
          onChange={(e) => setNewSub(e.target.value)}
          className="flex-1 border rounded-xl px-4 py-2"
        />

        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="border rounded-xl px-3 py-2"
        >
          <option value="">🌍 Select Country</option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          onClick={addSubCategory}
          className="bg-gradient-to-r from-[#e82429] to-[#721011] text-white px-4 rounded-xl"
        >
          <FaPlus />
        </button>
      </div>

      {/* LIST */}
      <ul className="space-y-2">
        {subs.map((sub) => (
          <li
            key={sub._id}
            className="flex justify-between items-center bg-white p-3 rounded-xl border shadow-sm"
          >
            {editId === sub._id ? (
              <div className="flex gap-2 flex-1">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 border rounded px-3 py-1"
                />
                <button onClick={() => saveEdit(sub._id)}>
                  <FaSave className="text-green-600" />
                </button>
                <button onClick={cancelEdit}>
                  <FaTimes />
                </button>
              </div>
            ) : (
              <>
                <span className="font-medium text-gray-800 flex items-center gap-2">
                  {sub.countryCode && (
                    <img
                      src={`https://flagcdn.com/w40/${sub.countryCode.toLowerCase()}.png`}
                      alt={sub.countryCode}
                      className="w-6 h-4 rounded border"
                    />
                  )}
                  {sub.name}
                </span>

                <div className="flex gap-3">
                  <button
                    onClick={() => openContentModal(sub)}
                    className="text-purple-600"
                    title="SEO Content"
                  >
                    <FaFileAlt />
                  </button>

                  <button
                    onClick={() => startEdit(sub)}
                    className="text-blue-600"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => deleteSub(sub._id)}
                    className="text-red-600"
                    title="Delete"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* SEO MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white w-[95%] max-w-4xl rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#721011]">
                SEO Content – {activeSub?.name}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <Editor
              apiKey="YOUR_TINYMCE_KEY"
              value={description}
              onEditorChange={setDescription}
              init={{
                height: 400,
                menubar: true,
                toolbar:
                  "undo redo | blocks | bold italic underline | bullist numlist | link image | preview code",
                block_formats:
                  "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3",
              }}
            />

            <div className="text-right mt-4">
              <button
                onClick={saveContent}
                disabled={saving}
                className="bg-gradient-to-r from-[#e82429] to-[#721011] text-white px-6 py-2 rounded-xl"
              >
                {saving ? "Saving..." : "Save Content"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
