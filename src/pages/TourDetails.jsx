import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import DataService from "../config/DataService";
import { API } from "../config/API";

export default function TourDetails() {
  const { slug } = useParams(); // category slug
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Dynamic Base URL (for local + deployed backend)
  const baseURL =
    import.meta.env.VITE_API_URL || "https://desetplanner-backend.onrender.com";

  useEffect(() => {
    const fetchCategoryTours = async () => {
      try {
        const api = DataService();
        const res = await api.get(API.GET_TOURS_BY_CATEGORY(slug));
        setTours(res.data);
      } catch (err) {
        console.error(err);
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryTours();
  }, [slug]);

  if (loading)
    return (
      <h2 className="text-center py-10 text-2xl font-semibold text-gray-700">
        Loading...
      </h2>
    );

  if (tours.length === 0)
    return (
      <h2 className="text-center py-10 text-2xl font-semibold text-red-600">
        No tours found for this category
      </h2>
    );

  return (
    <div className="w-full">
      {/* Category Banner */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden">
        <img
          src={
            tours[0].mainImage?.startsWith("http")
              ? tours[0].mainImage
              : `${baseURL}/${tours[0].mainImage}`
          }
          alt={tours[0].category?.name || "Category"}
          className="w-full h-full object-cover brightness-70"
        />
        <div className="absolute inset-0 flex justify-center items-center">
          <h1 className="text-[#721011] text-3xl md:text-5xl font-extrabold text-center max-w-[1200px] px-4 tracking-wide drop-shadow-[2px_2px_8px_rgba(0,0,0,0.7)] bg-white/20 backdrop-blur-sm rounded-lg py-2">
            {tours[0].category?.name || "Category"}
          </h1>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-0 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tours.map((tour) => (
          <Link
            key={tour._id}
            to={`/tours/${slug}/${tour.slug}`}
            className="block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 hover:scale-[1.04] relative group"
          >
            {/* Image */}
            <div className="relative h-64 md:h-72 w-full overflow-hidden rounded-t-3xl">
              <img
                src={
                  tour.mainImage?.startsWith("http")
                    ? tour.mainImage
                    : `${baseURL}/${tour.mainImage}`
                }
                alt={tour.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            {/* Card Content */}
            <div className="p-6 flex flex-col justify-between h-56">
              <h2 className="text-xl font-bold text-[#e82429] mb-3 transition-transform duration-300 group-hover:translate-y-[-2px]">
                {tour.title}
              </h2>
              <p className="text-gray-700 font-semibold mb-4 text-lg transition-colors duration-300 group-hover:text-[#5f19ff]">
                from AED {tour.price} / person
              </p>
              <div className="mt-auto text-center bg-[#404041] text-white font-semibold py-3 rounded-2xl shadow-md hover:shadow-lg hover:bg-gray-700 transition-all cursor-pointer">
                View Trip
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
