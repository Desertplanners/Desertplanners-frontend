import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DataService from "../config/DataService";
import { API } from "../config/API";

export default function HolidayCategoryPage() {
  const { categorySlug } = useParams();
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const api = DataService();

    api.get(API.GET_PACKAGES_BY_CATEGORY(categorySlug)).then((res) => {
      // ✅ FIXED — backend returns { success, tours: [...] }
      setPackages(res.data?.tours || []);
    });
  }, [categorySlug]);

  const categoryName = categorySlug.replaceAll("-", " ").toUpperCase();

  return (
    <div className="w-full">

      {/* =====================
          TOP STATIC BANNER
      ====================== */}
      <div className="relative w-full h-44 sm:h-52 md:h-60 lg:h-64 mb-10 rounded-xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
          alt="Holiday Banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50"></div>

        <h1 className="absolute inset-0 flex items-center justify-center text-white text-3xl sm:text-4xl font-extrabold tracking-wider text-center drop-shadow-xl">
          {categoryName}
        </h1>
      </div>

      {/* =====================
          CARDS GRID
      ====================== */}
      <div className="max-w-[1200px] mx-auto px-4 pb-16">
        {packages.length === 0 ? (
          <p className="text-gray-600 text-lg text-center">No holiday tours found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {packages.map((pkg) => (
              <Link
                key={pkg._id}
                to={`/holidays/${categorySlug}/${pkg.slug}`}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden"
              >
                {/* IMAGE */}
                <div className="h-48 w-full overflow-hidden bg-gray-200">
                  <img
                    src={pkg.sliderImages?.[0] || "/no-image.png"}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-5 space-y-4">

                  {/* TITLE + PRICE */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#404041] group-hover:text-[#e82429] transition max-w-[70%] line-clamp-1">
                      {pkg.title}
                    </h3>

                    <p className="text-[#e82429] font-bold text-[17px] whitespace-nowrap">
                      $ {pkg.priceAdult}
                    </p>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-gray-600 text-sm line-clamp-2">
                    Enjoy an unforgettable holiday experience in {pkg.title}.
                  </p>

                  {/* BUTTON */}
                  <div>
                    <span className="inline-block px-4 py-2 bg-[#e82429] text-white rounded-xl text-sm font-medium shadow hover:bg-[#c71f24] transition">
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}
