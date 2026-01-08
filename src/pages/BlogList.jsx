import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";
import { Helmet } from "react-helmet-async";

export default function BlogList() {
  const api = DataService();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seo, setSEO] = useState(null);

  // ================= FETCH BLOGS =================
  useEffect(() => {
    api.get(API.GET_BLOGS).then((res) => {
      const publishedBlogs = (res.data || []).filter(
        (b) => b.status === "published"
      );
      setBlogs(publishedBlogs);
      setLoading(false);
    });
  }, []);
  

  // ================= FETCH SEO =================
  useEffect(() => {
    const loadSEO = async () => {
      try {
        const res = await api.get(API.GET_SEO("page", "blog"));
        if (res.data?.seo) setSEO(res.data.seo);
      } catch (err) {
        console.log(err);
      }
    };
    loadSEO();
  }, []);

  const pageTitle =
    seo?.seoTitle ||
    "Dubai & UAE Travel Blog – Tips, Guides & Itineraries | Desert Planners";

  const pageDesc =
    seo?.seoDescription ||
    "Explore Dubai, Abu Dhabi & UAE travel blogs with expert tips, itineraries, visa guides and local insights by Desert Planners.";

  const canonicalURL = "https://www.desertplanners.net/blog";

  const ogImage =
    seo?.seoOgImage || "https://www.desertplanners.net/images/blog-og.jpg";

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500">Loading blogs…</div>
    );
  }

  if (!blogs.length) {
    return (
      <div className="py-12 text-center text-gray-500">No blogs found.</div>
    );
  }

  const featured = blogs[0];
  const rightBlogs = blogs.slice(1, 3);

  return (
    <>
      {/* ================= SEO ================= */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonicalURL} />

        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />

        {/* Blog Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: pageTitle,
            url: canonicalURL,
            description: pageDesc,
            image: ogImage,
          })}
        </script>

        {/* FAQ Schema */}
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

      <section className="w-full bg-gradient-to-b from-[#f7f8fa] to-white">
        {/* ================= HERO ================= */}
        <div className="bg-gradient-to-r from-[#721011] via-[#9f1a1c] to-[#e82429]">
          <div className="max-w-[1200px] mx-auto px-4 py-10 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold">
              Travel Stories & Guides
            </h1>
            <p className="mt-3 text-white/90 max-w-2xl mx-auto">
              Dubai travel tips, visa guides & expert insights by Desert Planners.
            </p>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-3 py-10">
          {/* ================= TRENDING BLOGS ================= */}
          <h2 className="text-3xl font-extrabold mb-6">Trending Blogs</h2>

          {/* 🔥 Desktop aligned | Mobile natural */}
          <div className="grid lg:grid-cols-3 gap-5 lg:h-[520px] lg:mb-34 sm:mb-40">
            {/* FEATURED */}
            {featured && (
              <Link
                to={`/blog/${featured.slug}`}
                className="lg:col-span-2 h-full"
              >
                <div className="h-full bg-white rounded-3xl overflow-hidden shadow hover:shadow-xl transition flex flex-col">
                  <div className="relative w-full aspect-[16/9] lg:flex-1">
                    <img
                      src={featured.featuredImage}
                      alt={featured.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold">
                      {featured.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      By {featured.authorName || "Desert Planners"}
                    </p>
                  </div>
                </div>
              </Link>
            )}

            {/* RIGHT BLOGS */}
            <div className="flex flex-col gap-5 h-full">
              {rightBlogs.map((blog) => (
                <Link key={blog._id} to={`/blog/${blog.slug}`} className="flex-1">
                  <div className="h-full bg-white rounded-3xl overflow-hidden shadow hover:shadow-xl transition flex flex-col">
                    <div className="relative w-full aspect-[16/9] lg:flex-1">
                      <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold line-clamp-2">
                        {blog.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        By {blog.authorName || "Desert Planners"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ================= CTA ================= */}
          <div className="relative h-[420px] rounded-[2.5rem] overflow-hidden mb-12">
            <img
              src="https://images.unsplash.com/photo-1489516408517-0c0a15662682?q=80&w=1600&auto=format&fit=crop"
              alt="UAE Tours"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

            <div className="relative z-10 h-full flex items-center">
              <div className="px-6 md:px-16 max-w-2xl text-white">
                <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
                  Explore UAE Top Tours & Experiences
                </h2>
                <p className="mb-6 text-lg text-white/90">
                  Discover Dubai with trusted local travel experts.
                </p>
                <Link
                  to="/tours"
                  className="inline-block bg-[#e82429] px-8 py-3 rounded-full font-semibold hover:bg-[#c91f23]"
                >
                  Explore Tours →
                </Link>
              </div>
            </div>
          </div>

          {/* ================= POPULAR BLOGS ================= */}
          <h2 className="text-3xl font-extrabold mb-6">Popular Blogs</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blog/${blog.slug}`}
                className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-xl transition flex flex-col"
              >
                <div className="relative w-full aspect-[16/9]">
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex-1">
                  <h3 className="text-lg font-bold line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
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
