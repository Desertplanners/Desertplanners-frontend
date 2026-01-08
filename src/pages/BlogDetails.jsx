import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
      <div className="py-20 text-center text-gray-500">Loading article…</div>
    );
  }

  if (!blog) {
    return (
      <div className="py-20 text-center text-gray-500">Blog not found</div>
    );
  }

  /* ================= SEO ================= */
  const seoTitle = blog.seo?.metaTitle || blog.title;
  const seoDescription =
    blog.seo?.metaDescription ||
    blog.content?.replace(/<[^>]+>/g, "").slice(0, 160);

  const canonicalUrl = `https://www.desertplanners.net/blog/${blog.slug}`;
  const ogImage =
    blog.featuredImage || "https://www.desertplanners.net/default-og.jpg";

  return (
    <>
      {/* ⭐⭐⭐ SEO START ⭐⭐⭐ */}
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* OG */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={ogImage} />

        {/* BlogPosting Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: seoTitle,
            description: seoDescription,
            image: ogImage,
            datePublished: blog.createdAt,
            dateModified: blog.updatedAt,
            author: {
              "@type": "Author",
              name: blog.authorName || "Desert Planners",
            },
            publisher: {
              "@type": "Organization",
              name: "Desert Planners UAE",
              logo: {
                "@type": "ImageObject",
                url: "https://www.desertplanners.net/logo.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": canonicalUrl,
            },
          })}
        </script>
      </Helmet>
      {/* ⭐⭐⭐ SEO END ⭐⭐⭐ */}

      <article className="w-full bg-[#fafafa]">
        {/* HERO IMAGE */}
        <section className="w-full">
          <div className="relative w-full aspect-[16/9] bg-black">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        </section>

        {/* BLOG META */}
        <section className="max-w-[1200px] mx-auto px-4 pt-8 pb-6">
          {blog.category?.name && (
            <Link
              to={`/blog/category/${blog.category.slug}`}
              className="inline-block mb-4 bg-[#e82429]/10 text-[#e82429] px-4 py-1 rounded-full text-xs font-semibold"
            >
              {blog.category.name}
            </Link>
          )}

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span>By {blog.authorName}</span>
            <span>•</span>
            <span>{new Date(blog.createdAt).toDateString()}</span>
            {blog.views && (
              <>
                <span>•</span>
                <span>{blog.views} views</span>
              </>
            )}
          </div>
        </section>

        {/* BODY */}
        <section className="max-w-[1200px] mx-auto px-4 pb-20 grid lg:grid-cols-[1fr_300px] gap-10">
          {/* MAIN CONTENT */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm px-4 md:px-6 py-8">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(blog.content),
                }}
              />
            </div>

            {/* AUTHOR */}
            <div className="mt-8 bg-white rounded-2xl shadow-sm px-5 py-5 flex gap-4">
              <img
                src={blog.authorImage || "/images/default-avatar.png"}
                alt={blog.authorName}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <span className="text-xs uppercase text-gray-500">
                  Written by
                </span>
                <h4 className="font-semibold text-gray-900">
                  {blog.authorName}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {blog.authorBio ||
                    "Travel expert at Desert Planners sharing insights on Dubai tours, visas, and premium travel experiences."}
                </p>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6 sticky top-24 h-fit">
            {/* LATEST BLOGS */}
            {latestBlogs.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h3 className="text-base font-bold mb-4">Latest Articles</h3>
                <div className="space-y-4">
                  {latestBlogs.map((b) => (
                    <Link
                      key={b._id}
                      to={`/blog/${b.slug}`}
                      className="flex gap-3 group"
                    >
                      <img
                        src={b.featuredImage}
                        alt={b.title}
                        className="w-16 h-14 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium group-hover:text-[#e82429] leading-snug">
                          {b.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
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
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h3 className="text-base font-bold mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/blog/category/${cat.slug}`}
                      className={`px-3 py-1 text-xs rounded-full transition ${
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
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h3 className="text-base font-bold mb-4">Related Tours</h3>
                <div className="space-y-4">
                  {blog.relatedTours.map((tour) => (
                    <Link
                      key={tour._id}
                      to={`/tours/${tour.slug}`}
                      className="flex gap-3 group"
                    >
                      <img
                        src={tour.mainImage}
                        alt={tour.title}
                        className="w-16 h-14 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold group-hover:text-[#e82429] leading-snug">
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
    </>
  );
}
