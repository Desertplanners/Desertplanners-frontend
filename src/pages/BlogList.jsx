import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";

export default function BlogList() {
  const api = DataService();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const res = await api.get(API.GET_BLOGS);
        setBlogs(res.data || []);
      } catch {
        setError("Unable to load blogs at the moment.");
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  /* ======================
      STATES
  ====================== */
  if (loading) {
    return (
      <div className="p-16 text-center text-gray-500">
        Loading blogs…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-16 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="p-16 text-center text-gray-500">
        No blogs published yet.
      </div>
    );
  }

  const latestBlog = blogs[0];
  const otherBlogs = blogs.slice(1);

  return (
    <section className="w-full bg-gradient-to-b from-[#fafafa] via-[#ffffff] to-[#f9f9f9]">
      <div className="max-w-[1200px] mx-auto px-4 py-16">

        {/* ================= HEADER ================= */}
        <header className="mb-14 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Travel Stories & Guides
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Expert insights, Dubai travel tips, visa guides and unforgettable
            experiences curated by Desert Planners.
          </p>
        </header>

        {/* ================= FEATURED BLOG ================= */}
        {latestBlog && (
          <Link
            to={`/blog/${latestBlog.slug}`}
            className="group block mb-20"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={latestBlog.featuredImage}
                alt={latestBlog.title}
                className="w-full h-[420px] object-cover group-hover:scale-105 transition duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                {latestBlog.category?.name && (
                  <span className="inline-block mb-4 bg-white/20 px-4 py-1 rounded-full text-sm">
                    {latestBlog.category.name}
                  </span>
                )}

                <h2 className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight">
                  {latestBlog.title}
                </h2>

                <p className="text-sm text-gray-200">
                  By {latestBlog.authorName} •{" "}
                  {new Date(latestBlog.createdAt).toDateString()}
                </p>
              </div>
            </div>
          </Link>
        )}

        {/* ================= BLOG GRID ================= */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherBlogs.map((blog) => (
            <article
              key={blog._id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden group"
            >
              <div className="overflow-hidden">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-6">
                {blog.category?.name && (
                  <span className="inline-block mb-3 text-xs font-semibold text-[#e82429]">
                    {blog.category.name}
                  </span>
                )}

                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="hover:text-[#e82429]"
                  >
                    {blog.title}
                  </Link>
                </h3>

                <p className="text-sm text-gray-500 mb-4">
                  By {blog.authorName} •{" "}
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>

                <Link
                  to={`/blog/${blog.slug}`}
                  className="inline-flex items-center text-[#e82429] font-semibold text-sm group-hover:gap-2 transition-all"
                >
                  Read article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
