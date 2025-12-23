import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";
import DOMPurify from "dompurify";

export default function BlogDetails() {
  const { slug } = useParams();
  const api = DataService();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(API.GET_BLOG_BY_SLUG(slug))
      .then((res) => setBlog(res.data))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading)
    return <div className="p-16 text-center text-gray-500">Loading article…</div>;

  if (!blog)
    return <div className="p-16 text-center text-gray-500">Blog not found</div>;

  /* ======================
      STATIC CONTENT
  ====================== */

  const relatedBlogs = [
    {
      title: "Top 10 Places to Visit in Dubai",
      image:
        "https://images.unsplash.com/photo-1546412414-8035e1776c9a",
      slug: "#",
    },
    {
      title: "Complete UAE Visa Guide for Tourists",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
      slug: "#",
    },
    {
      title: "Desert Safari Experience – What to Expect",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      slug: "#",
    },
  ];

  const categories = [
    "Dubai Travel",
    "Visa Guide",
    "Desert Safari",
    "Luxury Tours",
    "Family Trips",
  ];

  return (
    <article className="w-full bg-[#fafafa]">

      {/* ================= HERO ================= */}
      <section className="relative h-[420px]">
        <img
          src="https://images.unsplash.com/photo-1504274066651-8d31a536b11a"
          alt="Dubai"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        <div className="relative max-w-[1100px] mx-auto px-4 h-full flex items-end pb-14">
          <div className="text-white max-w-3xl">
            <span className="inline-block mb-4 bg-white/20 px-4 py-1 rounded-full text-sm">
              {blog.category?.name}
            </span>

            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-200">
              <span>By {blog.authorName}</span>
              <span>•</span>
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{blog.views} views</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BODY ================= */}
      <section className="max-w-[1100px] mx-auto px-4 py-16 grid lg:grid-cols-[1fr_340px] gap-14">

        {/* ================= CONTENT ================= */}
        <div>
          <div className="bg-white rounded-3xl shadow-xl border px-6 md:px-10 py-12">

            <div
              className="
                prose max-w-full
                prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:font-extrabold
                prose-h3:text-xl prose-h3:font-semibold
                prose-p:text-[17px] prose-p:leading-relaxed
                prose-blockquote:bg-[#fff4f4] prose-blockquote:px-6 prose-blockquote:py-5 prose-blockquote:rounded-xl
                prose-a:text-[#e82429] prose-a:font-semibold
                prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-10
              "
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(blog.content),
              }}
            />
          </div>

          {/* AUTHOR CARD */}
          <div className="mt-14 bg-white rounded-2xl shadow border p-6 flex gap-5">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="author"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h4 className="font-bold text-gray-900">
                {blog.authorName}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Travel expert at Desert Planners with 5+ years of experience
                in Dubai tours, visas and luxury travel planning.
              </p>
            </div>
          </div>
        </div>

        {/* ================= SIDEBAR ================= */}
        <aside className="space-y-10 sticky top-24 h-fit">

          {/* RELATED BLOGS */}
          <div className="bg-white rounded-2xl shadow border p-6">
            <h3 className="text-lg font-bold mb-5">Related Articles</h3>
            <div className="space-y-4">
              {relatedBlogs.map((b, i) => (
                <Link
                  key={i}
                  to={b.slug}
                  className="flex gap-3 group"
                >
                  <img
                    src={b.image}
                    alt=""
                    className="w-20 h-16 rounded-lg object-cover"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-[#e82429]">
                    {b.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* CATEGORIES */}
          <div className="bg-white rounded-2xl shadow border p-6">
            <h3 className="text-lg font-bold mb-4">Popular Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, i) => (
                <span
                  key={i}
                  className="px-4 py-1.5 text-sm rounded-full bg-[#f3f3f3] text-gray-700"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* NEWSLETTER */}
          <div className="bg-gradient-to-r from-[#e82429] to-[#721011] rounded-2xl p-6 text-white">
            <h3 className="text-lg font-bold mb-2">
              Get Travel Updates
            </h3>
            <p className="text-sm text-white/90 mb-4">
              Latest Dubai offers, visa updates & travel tips.
            </p>
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 rounded-lg text-gray-900 mb-3"
            />
            <button className="w-full bg-white text-[#721011] font-semibold py-2 rounded-lg">
              Subscribe
            </button>
          </div>

        </aside>
      </section>
    </article>
  );
}
