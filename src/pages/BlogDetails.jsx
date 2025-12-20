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
    return <div className="p-12 text-center text-gray-500">Loading blog...</div>;

  if (!blog)
    return <div className="p-12 text-center text-gray-500">Blog not found</div>;

  return (
    <article className="w-full bg-gradient-to-b from-[#fffdf9] via-[#faf7f2] to-[#ffffff]">
      <div className="max-w-[900px] mx-auto px-4 py-16">

        {/* ================= HEADER ================= */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-5">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span>
              By <strong className="text-gray-700">{blog.authorName}</strong>
            </span>
            <span>•</span>
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{blog.views} views</span>
          </div>

          {/* CATEGORY BADGE */}
          {blog.category && (
            <div className="mt-5">
              <Link
                to={`/blogs/category/${blog.category.slug}`}
                className="inline-flex items-center gap-2 bg-white border border-[#f3dada] text-[#e82429] font-semibold px-5 py-2 rounded-full text-sm shadow-sm hover:bg-[#fdecec] transition"
              >
                #{blog.category.name}
              </Link>
            </div>
          )}
        </header>

        {/* ================= CONTENT CARD ================= */}
        <section className="bg-white rounded-3xl shadow-xl border border-gray-100 px-6 md:px-10 py-10">

          <div
            className="
              prose prose-base
              max-w-full

              prose-h1:text-3xl
              prose-h2:text-2xl
              md:prose-h2:text-3xl
              prose-h2:font-extrabold
              prose-h2:text-gray-900
              prose-h2:mt-12
              prose-h2:mb-6

              prose-h3:text-xl
              prose-h3:font-semibold
              prose-h3:text-gray-800
              prose-h3:mt-8
              prose-h3:mb-4

              prose-h4:text-lg
              prose-h4:font-semibold
              prose-h4:text-gray-700
              prose-h4:mt-6
              prose-h4:mb-3

              prose-p:text-gray-700
              prose-p:text-[17px]
              prose-p:leading-relaxed
              prose-p:mb-6

              prose-a:text-[#e82429]
              prose-a:font-semibold
              prose-a:no-underline
              hover:prose-a:text-[#721011]

              prose-strong:text-gray-900

              prose-blockquote:bg-[#fff6f6]
              prose-blockquote:border-l-4
              prose-blockquote:border-[#e82429]
              prose-blockquote:rounded-lg
              prose-blockquote:px-5
              prose-blockquote:py-4
              prose-blockquote:text-gray-700
              prose-blockquote:not-italic

              prose-ul:list-disc
              prose-ul:pl-6
              prose-ol:list-decimal
              prose-ol:pl-6
              prose-li:marker:text-[#e82429]
              prose-li:mb-2

              prose-img:rounded-2xl
              prose-img:shadow-xl
              prose-img:mx-auto
              prose-img:my-10

              prose-code:bg-gray-100
              prose-code:px-2
              prose-code:py-1
              prose-code:rounded-md
            "
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog.content),
            }}
          />
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="mt-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-[#e82429] font-semibold hover:underline"
          >
            ← Back to Blogs
          </Link>

          {blog.category && (
            <Link
              to={`/blogs/category/${blog.category.slug}`}
              className="text-sm text-gray-600 hover:text-[#721011]"
            >
              More articles in <strong>{blog.category.name}</strong>
            </Link>
          )}
        </footer>
      </div>
    </article>
  );
}
