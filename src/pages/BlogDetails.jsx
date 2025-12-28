import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";
import DOMPurify from "dompurify";

export default function BlogDetails() {
  const { slug } = useParams();
  const api = DataService();

  const [blog, setBlog] = useState(null);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const blogRes = await api.get(API.GET_BLOG_BY_SLUG(slug));
        const blogData = blogRes.data;
        setBlog(blogData);

        const allBlogsRes = await api.get(API.GET_BLOGS);
        const allBlogs = allBlogsRes.data || [];

        setLatestBlogs(
          allBlogs.filter((b) => b._id !== blogData._id).slice(0, 3)
        );

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
      <div className="py-16 text-center text-gray-500">Loading article…</div>
    );
  }

  if (!blog) {
    return (
      <div className="py-16 text-center text-gray-500">Blog not found</div>
    );
  }

  return (
    <article className="w-full bg-gradient-to-b from-[#fafafa] to-white">

      {/* HERO IMAGE */}
      <section className="w-full h-[380px] md:h-[420px]">
        <img
          src={blog.featuredImage || "/images/dubai-common-banner.jpg"}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
      </section>

      {/* BLOG META */}
      <section className="max-w-[1280px] mx-auto px-4 pt-6 pb-4">
        {blog.category?.name && (
          <span className="inline-block mb-3 bg-[#e82429]/10 text-[#e82429] px-4 py-1 rounded-full text-xs font-semibold">
            {blog.category.name}
          </span>
        )}

        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <span>By {blog.authorName}</span>
          <span>•</span>
          <span>{new Date(blog.createdAt).toDateString()}</span>
          <span>•</span>
          <span>{blog.views} views</span>
        </div>
      </section>

      {/* BODY */}
      <section className="max-w-[1280px] mx-auto px-4 py-10 grid lg:grid-cols-[1fr_340px] gap-12">

        {/* CONTENT */}
        <div>
          <div className="bg-white rounded-3xl shadow border px-6 md:px-8 py-8">
            <div
              className="
                prose max-w-full
                prose-h2:text-xl md:prose-h2:text-2xl prose-h2:font-extrabold
                prose-h3:text-lg prose-h3:font-semibold
                prose-p:text-[16px] prose-p:leading-relaxed
                prose-blockquote:bg-[#fff4f4]
                prose-blockquote:px-5 prose-blockquote:py-4
                prose-blockquote:rounded-xl
                prose-a:text-[#e82429] prose-a:font-semibold
                prose-img:rounded-2xl prose-img:shadow prose-img:my-8
              "
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(blog.content),
              }}
            />
          </div>

          {/* AUTHOR (UPDATED) */}
          <div className="mt-8 bg-white rounded-2xl shadow border p-6 flex gap-5 items-center">
            <img
              src={blog.authorImage || "/images/default-avatar.png"}
              alt={blog.authorName}
              className="w-16 h-16 rounded-full object-cover border"
            />

            <div>
              <h4 className="font-bold text-gray-900 text-lg">
                {blog.authorName}
              </h4>
              <p className="text-sm text-gray-600 mt-1 max-w-xl">
                {blog.authorBio ||
                  "Travel expert at Desert Planners sharing insights on Dubai tours, visas and premium travel experiences."}
              </p>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6 sticky top-24 h-fit">

          {/* LATEST BLOGS */}
          {latestBlogs.length > 0 && (
            <div className="bg-white rounded-2xl shadow border p-5">
              <h3 className="text-base font-bold mb-4">Latest Articles</h3>
              <div className="space-y-4">
                {latestBlogs.map((b) => (
                  <Link
                    key={b._id}
                    to={`/blog/${b.slug}`}
                    className="flex gap-3 group"
                  >
                    <img
                      src={b.featuredImage || "/images/dubai-common-banner.jpg"}
                      alt={b.title}
                      className="w-18 h-14 rounded-lg object-cover"
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
            <div className="bg-white rounded-2xl shadow border p-5">
              <h3 className="text-base font-bold mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/blog/category/${cat.slug}`}
                    className={`px-3 py-1 text-xs rounded-full border ${
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
            <div className="bg-white rounded-2xl shadow border p-5">
              <h3 className="text-base font-bold mb-4">Related Tours</h3>
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
                      className="w-20 h-16 rounded-xl object-cover"
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
