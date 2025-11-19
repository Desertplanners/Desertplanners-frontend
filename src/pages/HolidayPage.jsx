import { useEffect, useState } from "react";
import DataService from "../config/DataService";
import { API } from "../config/API";
import { Link } from "react-router-dom";

export default function HolidayPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const api = DataService();
    api.get(API.GET_HOLIDAY_CATEGORIES).then((res) => {
      setCategories(res.data || []);
    });
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Holiday Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/holidays/${cat.slug}`}
            className="p-5 rounded-xl shadow hover:shadow-lg bg-white"
          >
            <h3 className="text-xl font-semibold">{cat.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
