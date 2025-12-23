import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";

export default function BlogList() {
  const api = DataService();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(API.GET_BLOGS)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setBlogs(res.data);
        } else {
          setBlogs(dummyBlogs);
        }
      })
      .catch(() => setBlogs(dummyBlogs))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="p-16 text-center text-gray-500">Loading blogs…</div>;

  const latestBlog = blogs[0];
  const otherBlogs = blogs.slice(1);

  return (
    <section className="w-full bg-gradient-to-b from-[#fafafa] via-[#ffffff] to-[#f9f9f9]">
      <div className="max-w-[1200px] mx-auto px-4 py-16">

        {/* ================= HEADER ================= */}
        <header className="mb-14 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Travel Stories & Guides
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover Dubai travel tips, visa guides, luxury experiences and expert insights
            curated by Desert Planners.
          </p>
        </header>

        {/* ================= LATEST BLOG (BIG) ================= */}
        {latestBlog && (
          <Link
            to={`/blog/${latestBlog.slug}`}
            className="group block mb-16"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={latestBlog.image || latestBlog.featuredImage || dummyHero}
                alt={latestBlog.title}
                className="w-full h-[420px] object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <span className="inline-block mb-3 bg-white/20 px-4 py-1 rounded-full text-sm">
                  {latestBlog.category?.name || "Travel"}
                </span>

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

        {/* ================= OTHER BLOGS ================= */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherBlogs.map((blog, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
            >
              <img
                src={blog.image || blog.featuredImage || dummyImages[i % 3]}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-6">
                <span className="inline-block mb-3 text-xs font-semibold text-[#e82429]">
                  {blog.category?.name || "Travel"}
                </span>

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
                  className="text-[#e82429] font-semibold text-sm"
                >
                  Read more →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======================
    STATIC DUMMY DATA
====================== */

const dummyHero =
  "https://images.unsplash.com/photo-1504274066651-8d31a536b11a";

const dummyImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
  "https://images.unsplash.com/photo-1546412414-8035e1776c9a",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
];

const dummyBlogs = [
  {
    slug: "best-time-to-visit-dubai",
    title: "Best Time to Visit Dubai – Weather, Festivals & Tips",
    authorName: "Desert Planners Team",
    createdAt: new Date(),
    category: { name: "Dubai Travel" },
    image: dummyHero,
  },
  {
    slug: "dubai-visa-guide",
    title: "Dubai Visa Guide – Types, Fees & Processing Time",
    authorName: "Visa Expert",
    createdAt: new Date(),
    category: { name: "Visa Guide" },
    image: dummyImages[0],
  },
  {
    slug: "desert-safari-experience",
    title: "Desert Safari Experience – What You Should Expect",
    authorName: "Travel Consultant",
    createdAt: new Date(),
    category: { name: "Desert Safari" },
    image: dummyImages[1],
  },
  {
    slug: "luxury-dubai-tours",
    title: "Luxury Dubai Tours – Premium Experiences Explained",
    authorName: "Luxury Travel Team",
    createdAt: new Date(),
    category: { name: "Luxury Tours" },
    image: dummyImages[2],
  },
];
