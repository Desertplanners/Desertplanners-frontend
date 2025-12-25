import React, { useEffect, useState } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import { Editor } from "@tinymce/tinymce-react";
import toast from "react-hot-toast";

export default function BlogFormModal({ onClose, onSuccess, editBlog }) {
  const api = DataService("admin");

  /* ======================
      BASIC STATE
  ====================== */
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  /* ======================
      CATEGORY
  ====================== */
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  /* ======================
      AUTHOR (MANUAL)
  ====================== */
  const [authorName, setAuthorName] = useState("");
  const [authorBio, setAuthorBio] = useState("");

  /* ======================
      FEATURED IMAGE
  ====================== */
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState("");

  /* ======================
      RELATED TOURS
  ====================== */
  const [relatedTours, setRelatedTours] = useState([]);
  const [tours, setTours] = useState([]);

  /* ======================
      STATUS
  ====================== */
  const [status, setStatus] = useState("draft");

  /* ======================
      SEO
  ====================== */
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  /* ======================
      LOAD INITIAL DATA
  ====================== */
  useEffect(() => {
    api.get(API.GET_BLOG_CATEGORIES).then((res) =>
      setCategories(res.data || [])
    );

    api.get(API.GET_TOURS).then((res) =>
      setTours(res.data || [])
    );

    if (editBlog) {
      setTitle(editBlog.title || "");
      setContent(editBlog.content || "");
      setCategory(editBlog.category?._id || "");

      setAuthorName(editBlog.authorName || "");
      setAuthorBio(editBlog.authorBio || "");

      // ✅ MOST IMPORTANT FIX
      setRelatedTours(
        editBlog.relatedTours?.map((t) =>
          typeof t === "string" ? t : t?._id
        ) || []
      );

      setStatus(editBlog.status || "draft");
      setSeoTitle(editBlog.seo?.metaTitle || "");
      setSeoDescription(editBlog.seo?.metaDescription || "");
      setFeaturedImagePreview(editBlog.featuredImage || "");
    }
  }, [editBlog]);

  /* ======================
      CLEANUP PREVIEW
  ====================== */
  useEffect(() => {
    return () => {
      if (featuredImagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(featuredImagePreview);
      }
    };
  }, [featuredImagePreview]);

  /* ======================
      SUBMIT HANDLER
  ====================== */
  const submit = async () => {
    if (!title || !content || !category || !authorName) {
      return toast.error(
        "Title, Author Name, Content & Category are required"
      );
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("status", status);

    formData.append("authorName", authorName);
    formData.append("authorBio", authorBio);

    formData.append("seo[metaTitle]", seoTitle);
    formData.append("seo[metaDescription]", seoDescription);

    // ✅ SAFE RELATED TOURS
    relatedTours
      .filter((id) => id && id !== "undefined")
      .forEach((id) => {
        formData.append("relatedTours[]", id);
      });

    if (featuredImageFile) {
      formData.append("featuredImage", featuredImageFile);
    }

    try {
      if (editBlog) {
        await api.put(API.UPDATE_BLOG(editBlog._id), formData);
        toast.success("Blog updated successfully");
      } else {
        await api.post(API.ADD_BLOG, formData);
        toast.success(
          status === "draft"
            ? "Draft saved successfully"
            : "Blog published successfully"
        );
      }

      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Save failed");
    }
  };

  /* ======================
      UI
  ====================== */
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-[#f9fafb] w-[1200px] h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* ===== HEADER ===== */}
        <div className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Blog title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 text-2xl font-bold outline-none"
          />

          <div className="flex gap-3 ml-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={submit}
              className="px-6 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-[#e82429] to-[#721011]"
            >
              {status === "draft"
                ? editBlog
                  ? "Update Draft"
                  : "Save Draft"
                : editBlog
                ? "Update & Publish"
                : "Publish"}
            </button>
          </div>
        </div>

        {/* ===== BODY ===== */}
        <div className="flex flex-1 overflow-hidden">

          {/* ===== EDITOR ===== */}
          <div className="flex-1 p-8 overflow-y-auto">
            <Editor
              apiKey="8s89n75h7ygps6blc3zk8y0mkkid5zf3f505scrck14fx9ol"
              value={content}
              onEditorChange={setContent}
              init={{
                height: 600,
                menubar: "file edit view insert format tools table help",
                plugins: [
                  "advlist",
                  "lists",
                  "link",
                  "image",
                  "media",
                  "code",
                  "fullscreen",
                  "preview",
                ],
                toolbar:
                  "undo redo | blocks | bold italic underline | " +
                  "alignleft aligncenter alignright | " +
                  "bullist numlist | link image media | fullscreen preview code",
                block_formats:
                  "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4",
                content_style:
                  "body{font-family:Inter,system-ui;font-size:16px;line-height:1.75}",
              }}
            />
          </div>

          {/* ===== SIDEBAR ===== */}
          <aside className="w-[360px] bg-white border-l p-6 overflow-y-auto space-y-6">

            {/* CATEGORY */}
            <div>
              <label className="font-bold text-sm">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* AUTHOR */}
            <div>
              <label className="font-bold text-sm">Author</label>
              <input
                type="text"
                placeholder="Author name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
              <textarea
                placeholder="Author bio (optional)"
                value={authorBio}
                onChange={(e) => setAuthorBio(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-2"
                rows={3}
              />
            </div>

            {/* FEATURED IMAGE */}
            <div>
              <label className="font-bold text-sm">Featured Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setFeaturedImageFile(file);
                  setFeaturedImagePreview(URL.createObjectURL(file));
                }}
                className="mt-1"
              />
              {featuredImagePreview && (
                <img
                  src={featuredImagePreview}
                  alt="Featured"
                  className="mt-3 rounded-lg shadow"
                />
              )}
            </div>

            {/* RELATED TOURS */}
            <div>
              <label className="font-bold text-sm">Related Tours</label>
              <select
                multiple
                value={relatedTours}
                onChange={(e) =>
                  setRelatedTours(
                    Array.from(e.target.selectedOptions, (o) => o.value)
                  )
                }
                className="w-full border rounded-lg px-3 py-2 mt-1 h-32"
              >
                {tours.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            {/* SEO */}
            <div>
              <label className="font-bold text-sm">SEO</label>
              <input
                placeholder="Meta title"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
              <textarea
                placeholder="Meta description"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-2"
                rows={3}
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="font-bold text-sm">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
