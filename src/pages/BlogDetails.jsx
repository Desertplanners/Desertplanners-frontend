import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";
import DOMPurify from "dompurify";

export default function BlogDetails() {
  const { slug } = useParams();
  const api = DataService();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ======================
      LOAD DATA
  ====================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        const blogRes = await api.get(API.GET_BLOG_BY_SLUG(slug));
        const blogData = blogRes.data;
        setBlog(blogData);

        const allBlogsRes = await api.get(API.GET_BLOGS);
        const allBlogs = allBlogsRes.data || [];

        // 🔹 Related blogs (same category)
        const related = allBlogs.filter(
          (b) =>
            b._id !== blogData._id && b.category?._id === blogData.category?._id
        );
        setRelatedBlogs(related.slice(0, 3));

        // 🔹 Latest blogs (exclude current)
        const latest = allBlogs
          .filter((b) => b._id !== blogData._id)
          .slice(0, 3);
        setLatestBlogs(latest);

        const catRes = await api.get(API.GET_BLOG_CATEGORIES);
        setCategories(catRes.data || []);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="p-20 text-center text-gray-500">Loading article…</div>
    );
  }

  if (!blog) {
    return <div className="p-20 text-center text-gray-500">Blog not found</div>;
  }

  return (
    <article className="w-full bg-gradient-to-b from-[#fafafa] to-white">
      {/* ================= HERO ================= */}
      <section className="relative h-[460px]">
        <img
          src={blog.featuredImage || "/images/dubai-common-banner.jpg"}
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="relative max-w-[1200px] mx-auto px-4 h-full flex items-end pb-14">
          <div className="text-white max-w-3xl">
            {blog.category?.name && (
              <span className="inline-block mb-4 bg-white/20 px-4 py-1 rounded-full text-sm backdrop-blur">
                {blog.category.name}
              </span>
            )}

            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-200">
              <span>By {blog.authorName}</span>
              <span>•</span>
              <span>{new Date(blog.createdAt).toDateString()}</span>
              <span>•</span>
              <span>{blog.views} views</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BODY ================= */}
      <section className="max-w-[1200px] mx-auto px-4 py-20 grid lg:grid-cols-[1fr_360px] gap-16">
        {/* ================= CONTENT ================= */}
        <div>
          <div className="bg-white rounded-3xl shadow-xl border px-6 md:px-12 py-14">
            <div
              className="
                prose max-w-full
                prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:font-extrabold
                prose-h3:text-xl prose-h3:font-semibold
                prose-p:text-[17px] prose-p:leading-relaxed
                prose-blockquote:bg-[#fff4f4]
                prose-blockquote:px-6 prose-blockquote:py-5
                prose-blockquote:rounded-xl
                prose-a:text-[#e82429] prose-a:font-semibold
                prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-10
              "
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(blog.content),
              }}
            />
          </div>

          {/* AUTHOR */}
          <div className="mt-14 bg-white rounded-2xl shadow border p-8 flex gap-6 items-start">
            {/* AVATAR */}
            <div className="shrink-0 w-20 h-20 rounded-full bg-gray-100 border flex items-center justify-center shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
                />
              </svg>
            </div>

            {/* AUTHOR INFO */}
            <div>
              <h4 className="font-extrabold text-gray-900 text-xl">
                {blog.authorName}
              </h4>

              <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-xl">
                {blog.authorBio ||
                  "Travel expert at Desert Planners sharing insights on Dubai tours, visas and premium travel experiences."}
              </p>
            </div>
          </div>
        </div>

        {/* ================= SIDEBAR ================= */}
        <aside className="space-y-10 sticky top-24 h-fit">
          {/* LATEST BLOGS */}
          {latestBlogs.length > 0 && (
            <div className="bg-white rounded-2xl shadow border p-6">
              <h3 className="text-lg font-bold mb-6">Latest Articles</h3>

              <div className="space-y-4">
                {latestBlogs.map((b) => (
                  <Link
                    key={b._id}
                    to={`/blog/${b.slug}`}
                    className="flex gap-4 group"
                  >
                    <img
                      src={b.featuredImage || "/images/dubai-common-banner.jpg"}
                      alt={b.title}
                      className="w-20 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700 group-hover:text-[#e82429]">
                        {b.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CATEGORIES */}
          {categories.length > 0 && (
            <div className="bg-white rounded-2xl shadow border p-6">
              <h3 className="text-lg font-bold mb-4">Categories</h3>

              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/blog/category/${cat.slug}`}
                    className={`px-4 py-1.5 text-sm rounded-full border
                      ${
                        blog.category?._id === cat._id
                          ? "bg-[#e82429] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* RELATED TOURS */}
          {blog.relatedTours?.length > 0 && (
            <div className="bg-white rounded-2xl shadow border p-6">
              <h3 className="text-lg font-bold mb-6">Related Tours</h3>

              <div className="space-y-4">
                {blog.relatedTours.map((tour) => (
                  <Link
                    key={tour._id}
                    to={`/tours/${tour.slug}`}
                    className="flex gap-4 group"
                  >
                    <img
                      src={
                        tour.featuredImage ||
                        tour.mainImage ||
                        "/images/dubai-common-banner.jpg"
                      }
                      alt={tour.title}
                      className="w-24 h-20 rounded-xl object-cover shadow"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-[#e82429]">
                        {tour.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        From AED {tour.discountPriceAdult || tour.priceAdult}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>
    </article>
  );
}
