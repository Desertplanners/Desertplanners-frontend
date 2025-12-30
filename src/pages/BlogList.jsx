import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";

export default function BlogList() {
  const api = DataService();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(API.GET_BLOGS).then((res) => {
      setBlogs(res.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500">Loading blogs…</div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">No blogs found.</div>
    );
  }

  const featured = blogs[0];
  const rightBlogs = blogs.slice(1, 3);

  return (
    <section className="w-full bg-gradient-to-b from-[#f7f8fa] to-[#ffffff]">
      {/* ================= HERO HEADER ================= */}
      <div className="w-full bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] mb-8">
        <div className="max-w-[1200px] mx-auto px-4 py-10 text-center text-white">
          <span className="inline-block mb-4 text-sm tracking-widest uppercase text-white/80">
            Desert Planners Blog
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight">
            Travel Stories & Guides
          </h1>

          <p className="text-white/90 max-w-2xl mx-auto text-base md:text-lg">
            Dubai travel tips, visa guides & expert insights from trusted local
            travel experts at Desert Planners.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-3 py-10">
        {/* ================= TRENDING BLOGS ================= */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
          Trending Blogs
        </h2>

        {/* 🔥 LEFT & RIGHT SAME HEIGHT */}
        <div className="grid lg:grid-cols-3 gap-5 mb-14 h-[560px]">
          {/* FEATURED LEFT */}
          {featured && (
            <Link
              to={`/blog/${featured.slug}`}
              className="lg:col-span-2 h-full"
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition h-full flex flex-col">
                <div className="flex-1 overflow-hidden">
                  <img
                    src={featured.featuredImage}
                    alt={featured.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-700"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-2 leading-snug">
                    {featured.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    By {featured.authorName || "Desert Planners"}
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* RIGHT STACKED BLOGS */}
          <div className="flex flex-col gap-5 h-full">
            {rightBlogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blog/${blog.slug}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition flex-1 flex flex-col"
              >
                <div className="flex-1 overflow-hidden">
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                <div className="p-4">
                  <h4 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2">
                    {blog.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    By {blog.authorName || "Desert Planners"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ================= DUBAI CTA (RESTORED) ================= */}
        <div className="relative h-[460px] rounded-[2.5rem] overflow-hidden mb-16">
          <img
            src="https://images.unsplash.com/photo-1489516408517-0c0a15662682?q=80&w=1600&auto=format&fit=crop"
            alt="UAE Tours"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/10" />

          <div className="relative z-10 h-full flex items-center">
            <div className="px-6 md:px-16 max-w-2xl">
              <span className="text-sm uppercase tracking-widest text-white/80 block mb-3">
                Discover UAE
              </span>

              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                Explore UAE <br /> Top Tours & Experiences
              </h2>

              <p className="text-white/90 mb-6 text-lg">
                From iconic landmarks to desert adventures — experience Dubai
                with trusted local travel experts.
              </p>

              <Link
                to="/tours"
                className="inline-flex items-center bg-[#e82429] text-white px-9 py-3 rounded-full font-semibold hover:bg-[#c91f23] hover:translate-x-1 transition-all"
              >
                Explore Tours →
              </Link>
            </div>
          </div>
        </div>

        {/* ================= POPULAR BLOGS ================= */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">
          Popular Blogs
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              to={`/blog/${blog.slug}`}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col"
            >
              <div className="h-[220px] overflow-hidden">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-5 flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-500">
                  By {blog.authorName || "Desert Planners"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
