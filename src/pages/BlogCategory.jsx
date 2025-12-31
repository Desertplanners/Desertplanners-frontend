import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";
import { Helmet } from "react-helmet-async";

export default function BlogCategory() {
  const { slug } = useParams();
  const api = DataService();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ⭐ CATEGORY + SEO STATE
  const [category, setCategory] = useState(null); // full category object
  const [seo, setSEO] = useState(null);

  // ===============================
  // 1️⃣ FETCH CATEGORY BY SLUG (GET _id + name)
  // ===============================
  useEffect(() => {
    const loadCategory = async () => {
      try {
        const res = await api.get(API.GET_BLOG_CATEGORY_BY_SLUG(slug));
        setCategory(res.data || null);
      } catch (err) {
        console.log("❌ Blog category fetch error:", err);
        setCategory(null);
      }
    };

    loadCategory();
  }, [slug]);

  // ===============================
  // 2️⃣ FETCH BLOGS BY CATEGORY SLUG
  // ===============================
  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const res = await api.get(API.GET_BLOGS_BY_CATEGORY_SLUG(slug));
        setBlogs(res.data || []);
      } catch {
        setError("Unable to load blogs for this category.");
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, [slug]);

  // ===============================
  // 3️⃣ FETCH CATEGORY SEO (ADMIN) — BY ObjectId
  // ===============================
  useEffect(() => {
    if (!category?._id) return;

    const loadSEO = async () => {
      try {
        const res = await api.get(
          API.GET_SEO("blogCategory", category._id)
        );
        if (res.data?.seo) setSEO(res.data.seo);
      } catch (err) {
        console.log("❌ Blog Category SEO fetch error:", err);
      }
    };

    loadSEO();
  }, [category]);

  const categoryName =
    category?.name || slug.replace(/-/g, " ");

  // ===============================
  // SEO FALLBACKS
  // ===============================
  const pageTitle =
    seo?.seoTitle ||
    `${categoryName} Travel Blog & Guides | Desert Planners`;

  const pageDesc =
    seo?.seoDescription ||
    `Read the latest ${categoryName} travel blogs with expert tips, attractions, itineraries and travel advice by Desert Planners.`;

  const pageKeywords =
    seo?.seoKeywords ||
    `${categoryName} travel blog, ${categoryName} travel guide, Desert Planners`;

  const canonicalURL = `https://www.desertplanners.net/blog/category/${slug}`;

  const ogImage =
    seo?.seoOgImage ||
    "https://www.desertplanners.net/images/blog-category-og.jpg";

  // ===============================
  // LOADING / ERROR STATES
  // ===============================
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

  if (!blogs.length) {
    return (
      <div className="p-16 text-center text-gray-500">
        No blogs found in this category.
      </div>
    );
  }

  return (
    <>
      {/* ⭐⭐⭐ BLOG CATEGORY SEO ⭐⭐⭐ */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="keywords" content={pageKeywords} />
        <link rel="canonical" href={canonicalURL} />

        {/* OG */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonicalURL} />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={ogImage} />

        {/* ⭐ Collection Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: pageTitle,
            description: pageDesc,
            url: canonicalURL,
          })}
        </script>

        {/* ⭐ FAQ Schema (ADMIN) */}
        {seo?.faqs?.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: seo.faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: f.answer,
                },
              })),
            })}
          </script>
        )}
      </Helmet>
      {/* ⭐⭐⭐ END SEO ⭐⭐⭐ */}

      <section className="w-full bg-[#f9fafb]">
        {/* ================= HEADER ================= */}
        <header className="relative w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]" />
          <div className="absolute top-0 right-0 w-60 h-60 bg-[#e82429]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

          <div className="relative z-10 max-w-[1200px] mx-auto px-4 py-12 text-center text-white">
            <span className="inline-block mb-2 text-[11px] tracking-widest uppercase text-white/80">
              Blog Category
            </span>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold capitalize mb-3">
              {categoryName}
            </h1>

            <p className="text-white/85 max-w-xl mx-auto text-sm md:text-base">
              Expert travel blogs & guides related to{" "}
              <strong className="font-semibold">
                {categoryName}
              </strong>.
            </p>
          </div>
        </header>

        {/* ================= BLOG GRID ================= */}
        <div className="max-w-[1200px] mx-auto px-4 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blog/${blog.slug}`}
                className="group"
              >
                <article className="h-full bg-white rounded-2xl shadow-sm hover:shadow-2xl transition overflow-hidden">
                  <div className="overflow-hidden">
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="p-6 flex flex-col h-full">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#e82429] transition">
                      {blog.title}
                    </h2>

                    <p className="text-sm text-gray-500 mb-4">
                      By {blog.authorName || "Desert Planners"} •{" "}
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
    </>
  );
}
