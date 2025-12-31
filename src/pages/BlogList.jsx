import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";
import { Helmet } from "react-helmet-async";

export default function BlogList() {
  const api = DataService();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ SEO STATE
  const [seo, setSEO] = useState(null);

  // ===============================
  // FETCH BLOGS
  // ===============================
  useEffect(() => {
    api.get(API.GET_BLOGS).then((res) => {
      setBlogs(res.data || []);
      setLoading(false);
    });
  }, []);

  // ===============================
  // FETCH BLOG PAGE SEO
  // ===============================
  useEffect(() => {
    const loadSEO = async () => {
      try {
        const res = await api.get(API.GET_SEO("page", "blog"));
        if (res.data?.seo) setSEO(res.data.seo);
      } catch (err) {
        console.log("Blog SEO fetch error:", err);
      }
    };
    loadSEO();
  }, []);

  // ===============================
  // SEO FALLBACKS
  // ===============================
  const pageTitle =
    seo?.seoTitle ||
    "Dubai & UAE Travel Blog – Tips, Guides & Itineraries | Desert Planners";

  const pageDesc =
    seo?.seoDescription ||
    "Explore Dubai, Abu Dhabi & UAE travel blogs with expert tips, itineraries, visa guides and local insights by Desert Planners.";

  const pageKeywords =
    seo?.seoKeywords ||
    "Dubai travel blog, UAE travel tips, Abu Dhabi travel guide, Desert Planners blog";

  const canonicalURL = "https://www.desertplanners.net/blog";

  const ogImage =
    seo?.seoOgImage || "https://www.desertplanners.net/images/blog-og.jpg";

  // ===============================
  // LOADING / EMPTY STATES
  // ===============================
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
    <>
      {/* ⭐⭐⭐ BLOG MAIN PAGE SEO ⭐⭐⭐ */}
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

        {/* ⭐ Blog Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: pageTitle,
            url: canonicalURL,
            description: pageDesc,
            image: ogImage,
            publisher: {
              "@type": "Organization",
              name: "Desert Planners UAE",
              logo: ogImage,
            },
          })}
        </script>

        {/* ⭐ FAQ Schema (Admin se add ho to) */}
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

      <section className="w-full bg-gradient-to-b from-[#f7f8fa] to-[#ffffff]">
        {/* ================= HERO HEADER ================= */}
        <div className="w-full bg-gradient-to-r from-[#721011] via-[#9f1a1c] to-[#e82429] mb-8">
          <div className="max-w-[1200px] mx-auto px-4 py-10 text-center text-white">
            <span className="inline-block mb-4 text-sm tracking-widest uppercase text-white/80">
              Desert Planners Blog
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight">
              Travel Stories & Guides
            </h1>

            <p className="text-white/90 max-w-2xl mx-auto text-base md:text-lg">
              Dubai travel tips, visa guides & expert insights from trusted
              local travel experts at Desert Planners.
            </p>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-3 py-10">
          {/* ================= TRENDING BLOGS ================= */}
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
            Trending Blogs
          </h2>

          <div className="grid lg:grid-cols-3 gap-5 mb-14 h-[560px]">
            {/* FEATURED */}
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
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                      {featured.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      By {featured.authorName || "Desert Planners"}
                    </p>
                  </div>
                </div>
              </Link>
            )}

            {/* RIGHT BLOGS */}
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
                    <h4 className="text-lg font-bold text-gray-900 line-clamp-2">
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

          {/* ================= DUBAI / UAE CTA (RESTORED) ================= */}
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
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
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
    </>
  );
}
