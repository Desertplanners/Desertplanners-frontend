import React, { useEffect, useState } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import toast from "react-hot-toast";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaRegFileAlt,
} from "react-icons/fa";
import BlogFormModal from "./BlogFormModal";

export default function BlogManagement() {
  const api = DataService("admin");

  const [blogs, setBlogs] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ======================
      FETCH BLOGS
  ====================== */
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get(API.GET_BLOGS);
      setBlogs(res.data || []);
    } catch {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openAdd = () => {
    setEditBlog(null);
    setOpenForm(true);
  };

  const openEdit = (blog) => {
    setEditBlog(blog);
    setOpenForm(true);
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this blog permanently?")) return;
    try {
      await api.delete(API.DELETE_BLOG(id));
      toast.success("Blog deleted");
      fetchBlogs();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ======================
      UI
  ====================== */
  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">

      {/* ===== HEADER CARD ===== */}
      <div className="bg-white rounded-2xl shadow border p-6 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <FaRegFileAlt className="text-[#e82429]" />
            Blog Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage, edit and publish blogs from one place
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold
                     bg-gradient-to-r from-[#e82429] to-[#721011]
                     shadow hover:opacity-90 transition"
        >
          <FaPlus /> New Blog
        </button>
      </div>

      {/* ===== TABLE CARD ===== */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 text-left">Blog</th>
              <th className="p-4">Category</th>
              <th className="p-4">Author</th>
              <th className="p-4">Status</th>
              <th className="p-4">Views</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* LOADING */}
            {loading && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  Loading blogs…
                </td>
              </tr>
            )}

            {/* EMPTY */}
            {!loading && blogs.length === 0 && (
              <tr>
                <td colSpan="6" className="p-10 text-center text-gray-500">
                  No blogs found. Click <strong>New Blog</strong> to create one.
                </td>
              </tr>
            )}

            {/* ROWS */}
            {blogs.map((b) => (
              <tr
                key={b._id}
                className="border-t hover:bg-gray-50 transition"
              >
                {/* BLOG INFO */}
                <td className="p-4 flex gap-4 items-center">
                  {b.featuredImage ? (
                    <img
                      src={b.featuredImage}
                      alt=""
                      className="w-16 h-12 rounded-lg object-cover border"
                    />
                  ) : (
                    <div className="w-16 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                      <FaRegFileAlt />
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-gray-900 line-clamp-1">
                      {b.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </td>

                {/* CATEGORY */}
                <td className="p-4 text-gray-700">
                  {b.category?.name || "-"}
                </td>

                {/* AUTHOR */}
                <td className="p-4 text-gray-700">
                  {b.authorName || "-"}
                </td>

                {/* STATUS */}
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        b.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {b.status}
                  </span>
                </td>

                {/* VIEWS */}
                <td className="p-4 text-gray-700 flex items-center gap-1 justify-center">
                  <FaEye className="text-gray-400" /> {b.views}
                </td>

                {/* ACTIONS */}
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => openEdit(b)}
                      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => deleteBlog(b._id)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== POPUP ===== */}
      {openForm && (
        <BlogFormModal
          onClose={() => setOpenForm(false)}
          onSuccess={fetchBlogs}
          editBlog={editBlog}
        />
      )}
    </div>
  );
}
