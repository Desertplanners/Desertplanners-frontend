import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";

export default function BlogCategory() {
  const { slug } = useParams();
  const api = DataService();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(API.GET_BLOGS_BY_CATEGORY(slug))
      .then((res) => setBlogs(res.data || []))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-8">
        Blogs in “{slug}”
      </h1>

      {blogs.length === 0 && <p>No blogs in this category.</p>}

      <div className="grid md:grid-cols-2 gap-8">
        {blogs.map((blog) => (
          <div key={blog._id} className="border rounded-xl p-6 bg-white">
            <h2 className="text-xl font-bold mb-2">
              <Link
                to={`/blog/${blog.slug}`}
                className="text-[#721011]"
              >
                {blog.title}
              </Link>
            </h2>

            <p className="text-sm text-gray-500 mb-2">
              By {blog.authorName}
            </p>

            <Link
              to={`/blog/${blog.slug}`}
              className="text-[#e82429] font-semibold"
            >
              Read More →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
