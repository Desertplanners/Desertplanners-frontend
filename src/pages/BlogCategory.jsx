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

  /* ======================
      STATES
  ====================== */
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

  return (
    <section className="w-full bg-gradient-to-b from-[#fafafa] via-white to-[#f9f9f9]">
      <div className="max-w-[1200px] mx-auto px-4 py-16">

        {/* ================= HEADER ================= */}
        <header className="mb-14 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 capitalize mb-3">
            {slug.replace(/-/g, " ")}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore the latest blogs and travel guides related to{" "}
            <strong>{slug.replace(/-/g, " ")}</strong>.
          </p>
        </header>

        {/* ================= BLOG GRID ================= */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              to={`/blog/${blog.slug}`}
              className="group block"
            >
              <article
                className="h-full bg-white rounded-2xl shadow
                           hover:shadow-2xl transition overflow-hidden"
              >
                {/* IMAGE */}
                <div className="overflow-hidden">
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-56 object-cover
                               group-hover:scale-105 transition duration-500"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-6 flex flex-col h-full">
                  {blog.category?.name && (
                    <span className="inline-block mb-3 text-xs font-semibold text-[#e82429]">
                      {blog.category.name}
                    </span>
                  )}

                  <h2 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-[#e82429]">
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
