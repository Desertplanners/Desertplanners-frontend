import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";

export default function BlogCategory() {
  const { slug } = useParams();
  const api = DataService();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const res = await api.get(API.GET_BLOGS_BY_CATEGORY(slug));
        setBlogs(res.data || []);
      } catch {
        setError("Unable to load blogs for this category.");
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, [slug]);

  if (loading) {
    return <div className="p-16 text-center text-gray-500">Loading blogs…</div>;
  }

  if (error) {
    return <div className="p-16 text-center text-red-500">{error}</div>;
  }

  if (blogs.length === 0) {
    return (
      <div className="p-16 text-center text-gray-500">
        No blogs found in this category.
      </div>
    );
  }

  const categoryName = slug.replace(/-/g, " ");

  return (
    <section className="w-full bg-[#f9fafb]">

      {/* ================= FULL WIDTH MODERN HEADER ================= */}
      <header className="relative w-full overflow-hidden">
  {/* Background */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]" />

  {/* Soft accents */}
  <div className="absolute top-0 right-0 w-60 h-60 bg-[#e82429]/20 rounded-full blur-3xl" />
  <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

  <div className="relative z-10 max-w-[1200px] mx-auto px-4 py-12 text-center text-white">
    <span className="inline-block mb-2 text-[11px] tracking-widest uppercase text-white/80">
      Blog Category
    </span>

    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold capitalize mb-3 leading-tight">
      {categoryName}
    </h1>

    <p className="text-white/85 max-w-xl mx-auto text-sm md:text-base">
      Expert travel blogs & guides related to{" "}
      <strong className="font-semibold">{categoryName}</strong>.
    </p>
  </div>
</header>


      {/* ================= BLOG GRID ================= */}
      <div className="max-w-[1200px] mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link key={blog._id} to={`/blog/${blog.slug}`} className="group">
              <article className="h-full bg-white rounded-2xl shadow-sm hover:shadow-2xl transition overflow-hidden">

                {/* IMAGE */}
                <div className="overflow-hidden">
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-6 flex flex-col h-full">
                  {blog.category?.name && (
                    <span className="inline-block mb-3 text-xs font-semibold text-[#e82429] uppercase tracking-wide">
                      {blog.category.name}
                    </span>
                  )}

                  <h2 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-[#e82429] transition">
                    {blog.title}
                  </h2>

                  <p className="text-sm text-gray-500 mb-4">
                    By {blog.authorName} •{" "}
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>

                  <span className="mt-auto inline-flex items-center text-[#e82429] font-semibold text-sm">
                    Read article →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
}
