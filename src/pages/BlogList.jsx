import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";

export default function BlogList() {
  const api = DataService();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(API.GET_BLOGS)
      .then((res) => setBlogs(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center">Loading blogs...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-8">📝 Our Blog</h1>

      {blogs.length === 0 && <p>No blogs found.</p>}

      <div className="grid md:grid-cols-2 gap-8">
        {blogs.map((blog) => (
          <div key={blog._id} className="border rounded-xl p-6 bg-white">
            <h2 className="text-xl font-bold mb-2">
              <Link
                to={`/blog/${blog.slug}`}
                className="text-[#721011] hover:underline"
              >
                {blog.title}
              </Link>
            </h2>

            <p className="text-sm text-gray-500 mb-3">
              By {blog.authorName} •{" "}
              {new Date(blog.createdAt).toLocaleDateString()}
            </p>

            <p className="text-sm mb-3">
              Category:{" "}
              <Link
                to={`/blogs/category/${blog.category?.slug}`}
                className="text-[#e82429] font-medium"
              >
                {blog.category?.name}
              </Link>
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
