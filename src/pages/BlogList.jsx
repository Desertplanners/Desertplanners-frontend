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

  if (loading) {
    return <div className="py-14 text-center text-gray-500">Loading blogs…</div>;
  }

  if (error) {
    return <div className="py-14 text-center text-red-500">{error}</div>;
  }

  if (blogs.length === 0) {
    return (
      <div className="py-14 text-center text-gray-500">
        No blogs published yet.
      </div>
    );
  }

  const latestBlog = blogs[0];
  const otherBlogs = blogs.slice(1);

  return (
    <section className="w-full bg-gradient-to-b from-[#fafafa] via-[#ffffff] to-[#f7f7f7]">
      <div className="max-w-[1200px] mx-auto px-4 py-12">

        {/* ================= HEADER ================= */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Travel Stories & Guides
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-base">
            Dubai travel tips, visa guides & expert insights by Desert Planners.
          </p>
        </header>

        {/* ================= FEATURED BLOG ================= */}
        {latestBlog && (
          <Link to={`/blog/${latestBlog.slug}`} className="block mb-14 group">
            <article className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition">

              {/* IMAGE */}
              <div className="overflow-hidden">
                <img
                  src={latestBlog.featuredImage}
                  alt={latestBlog.title}
                  className="w-full h-[360px] object-cover group-hover:scale-105 transition duration-700"
                />
              </div>

              {/* CONTENT */}
              <div className="p-6 md:p-8">
                {latestBlog.category?.name && (
                  <span className="inline-block mb-3 bg-[#e82429]/10 text-[#e82429] px-3 py-1 rounded-full text-xs font-semibold">
                    {latestBlog.category.name}
                  </span>
                )}

                <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-2 leading-snug">
                  {latestBlog.title}
                </h2>

                <p className="text-gray-500 text-sm mb-3">
                  By {latestBlog.authorName} •{" "}
                  {new Date(latestBlog.createdAt).toDateString()}
                </p>

                <span className="inline-flex items-center text-[#e82429] font-semibold text-sm group-hover:gap-2 transition-all">
                  Read full article →
                </span>
              </div>
            </article>
          </Link>
        )}

        {/* ================= BLOG GRID ================= */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherBlogs.map((blog) => (
            <article
              key={blog._id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden group"
            >
              <div className="overflow-hidden">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-44 object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-5">
                {blog.category?.name && (
                  <span className="inline-block mb-2 text-xs font-semibold text-[#e82429]">
                    {blog.category.name}
                  </span>
                )}

                <h3 className="text-base font-bold text-gray-900 mb-1 leading-snug">
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="hover:text-[#e82429]"
                  >
                    {blog.title}
                  </Link>
                </h3>

                <p className="text-xs text-gray-500 mb-3">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>

                <Link
                  to={`/blog/${blog.slug}`}
                  className="inline-flex items-center text-[#e82429] font-semibold text-sm group-hover:gap-2 transition-all"
                >
                  Read →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
