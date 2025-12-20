import React, { useEffect, useState } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import { Editor } from "@tinymce/tinymce-react";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";

export default function BlogManagement() {
  const api = DataService("admin");

  // UI state
  const [mode, setMode] = useState("list"); // list | form
  const [loading, setLoading] = useState(false);

  // Data
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);

  // Logged-in user (for author display)
  const [currentUser, setCurrentUser] = useState(null);

  // Form state
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("published");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  /* ======================
      FETCH DATA
  ====================== */

  const fetchBlogs = async () => {
    try {
      const res = await api.get(API.GET_BLOGS);
      setBlogs(res.data || []);
    } catch {
      toast.error("Failed to load blogs");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get(API.GET_BLOG_CATEGORIES);
      setCategories(res.data || []);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get(API.USER_PROFILE);
      setCurrentUser(res.data);
    } catch {
      // silent – author display optional
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
    fetchCurrentUser();
  }, []);

  /* ======================
      FORM HELPERS
  ====================== */

  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setContent("");
    setCategory("");
    setStatus("published");
    setSeoTitle("");
    setSeoDescription("");
  };

  const openAddForm = () => {
    resetForm();
    setMode("form");
  };

  const openEditForm = (blog) => {
    setEditId(blog._id);
    setTitle(blog.title);
    setContent(blog.content);
    setCategory(blog.category?._id);
    setStatus(blog.status);
    setSeoTitle(blog.seo?.metaTitle || "");
    setSeoDescription(blog.seo?.metaDescription || "");
    setMode("form");
  };

  /* ======================
      SUBMIT BLOG
  ====================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !category) {
      return toast.error("Title, content & category required");
    }

    const payload = {
      title,
      content,
      category,
      status,
      seo: {
        metaTitle: seoTitle,
        metaDescription: seoDescription,
      },
    };

    try {
      setLoading(true);

      if (editId) {
        await api.put(API.UPDATE_BLOG(editId), payload);
        toast.success("Blog updated");
      } else {
        await api.post(API.ADD_BLOG, payload);
        toast.success("Blog added");
      }

      setMode("list");
      resetForm();
      fetchBlogs();
    } catch {
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
      DELETE BLOG
  ====================== */

  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      await api.delete(API.DELETE_BLOG(id));
      toast.success("Blog deleted");
      fetchBlogs();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ======================
      FORM VIEW
  ====================== */

  if (mode === "form") {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow">
          <button
            onClick={() => setMode("list")}
            className="mb-4 flex items-center gap-2 text-sm text-gray-600"
          >
            <FaArrowLeft /> Back to Blogs
          </button>

          <h1 className="text-2xl font-bold text-[#721011] mb-2">
            {editId ? "✏️ Edit Blog" : "➕ Add Blog"}
          </h1>

          {/* ✅ READ-ONLY AUTHOR INFO */}
          {currentUser && (
            <p className="text-sm text-gray-600 mb-4">
              Author: <strong>{currentUser.name}</strong>
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <Editor
              apiKey="8s89n75h7ygps6blc3zk8y0mkkid5zf3f505scrck14fx9ol"
              value={content}
              onEditorChange={(v) => setContent(v)}
              init={{
                height: 500,
                menubar: "file edit view insert format tools table help",
                branding: false,

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
                  "link image media table | " +
                  "removeformat | code fullscreen preview",

                /* ⭐ HEADINGS SUPPORT */
                block_formats:
                  "Paragraph=p; " +
                  "Heading 1=h1; " +
                  "Heading 2=h2; " +
                  "Heading 3=h3; " +
                  "Heading 4=h4; " +
                  "Heading 5=h5; " +
                  "Heading 6=h6; " +
                  "Preformatted=pre",

                /* ⭐ CONTENT STYLE (frontend jaisa look) */
                content_style: `
      body {
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 16px;
        line-height: 1.7;
      }
      h1 { font-size: 2.2em; }
      h2 { font-size: 1.8em; }
      h3 { font-size: 1.5em; }
      h4 { font-size: 1.25em; }
      h5 { font-size: 1.1em; }
      h6 { font-size: 1em; }
    `,

                /* ⭐ IMAGE UPLOAD (TEMP – URL BASED) */
                image_title: true,
                automatic_uploads: true,
                file_picker_types: "image",
                file_picker_callback: (cb) => {
                  const input = document.createElement("input");
                  input.setAttribute("type", "file");
                  input.setAttribute("accept", "image/*");

                  input.onchange = function () {
                    const file = this.files[0];
                    const reader = new FileReader();
                    reader.onload = function () {
                      cb(reader.result, { title: file.name });
                    };
                    reader.readAsDataURL(file);
                  };

                  input.click();
                },
              }}
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            <input
              type="text"
              placeholder="SEO Title"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />

            <textarea
              placeholder="SEO Description"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />

            <button
              disabled={loading}
              className="bg-gradient-to-r from-[#e82429] to-[#721011] text-white px-6 py-2 rounded-lg font-semibold"
            >
              {loading ? "Saving..." : "Save Blog"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ======================
      LIST VIEW
  ====================== */

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#721011]">
          📝 Blog Management
        </h1>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-[#e82429] text-white px-4 py-2 rounded-lg"
        >
          <FaPlus /> Add Blog
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Author</th>
              <th className="p-3">Status</th>
              <th className="p-3">Views</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id} className="border-t">
                <td className="p-3 font-medium">{blog.title}</td>
                <td className="p-3">{blog.category?.name || "-"}</td>
                <td className="p-3">{blog.authorName || "-"}</td>
                <td className="p-3 capitalize">{blog.status}</td>
                <td className="p-3">{blog.views}</td>
                <td className="p-3">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => openEditForm(blog)}
                    className="text-blue-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteBlog(blog._id)}
                    className="text-red-600"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {blogs.length === 0 && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No blogs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
