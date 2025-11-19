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
      setPackages(res.data?.tours || []);
    });
  }, [categorySlug]);

  const categoryName = categorySlug.replaceAll("-", " ").toUpperCase();

  return (
    <div className="w-full">

      {/* TOP BANNER */}
      <div className="relative w-full h-44 sm:h-52 md:h-60 lg:h-64 mb-10 rounded-xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
          alt="Holiday Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <h1 className="absolute inset-0 flex items-center justify-center text-white text-3xl sm:text-4xl font-extrabold tracking-wider">
          {categoryName}
        </h1>
      </div>

      {/* CARDS */}
      <div className="max-w-[1200px] mx-auto px-4 pb-16">
        {packages.length === 0 ? (
          <p className="text-gray-600 text-lg text-center">No holiday tours found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <ImageCard key={pkg._id} pkg={pkg} categorySlug={categorySlug} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------
   CARD WITH AUTO SLIDER + DURATION BADGE
------------------------------------------- */
function ImageCard({ pkg, categorySlug }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!pkg.sliderImages || pkg.sliderImages.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) =>
        prev + 1 < pkg.sliderImages.length ? prev + 1 : 0
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [pkg.sliderImages]);

  return (
    <Link
      to={`/holidays/${categorySlug}/${pkg.slug}`}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden"
    >
      {/* IMAGE */}
      <div className="h-60 w-full overflow-hidden relative bg-gray-200">
        <img
          src={pkg.sliderImages?.[index] || "/no-image.png"}
          alt={pkg.title}
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
        />

        {/* ⭐ DURATION BADGE (right-bottom) */}
        {pkg.duration && (
          <div className="
            absolute bottom-3 right-3 
            bg-black/55 backdrop-blur-md 
            text-white text-xs font-semibold 
            px-3 py-1.5 rounded-full 
            shadow-lg border border-white/20
          ">
            {pkg.duration}
          </div>
        )}

        {/* Dots */}
        {pkg.sliderImages?.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {pkg.sliderImages.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  index === i ? "bg-white" : "bg-white/50"
                }`}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-4">

        {/* TITLE + PRICE */}
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-[#404041] group-hover:text-[#e82429] transition w-[70%] leading-snug">
            {pkg.title}
          </h3>

          <p className="text-[#e82429] font-bold text-lg whitespace-nowrap">
            $ {pkg.priceAdult}
          </p>
        </div>

        <p className="text-gray-600 text-sm h-10 overflow-hidden">
          Enjoy an unforgettable holiday experience in {pkg.title}.
        </p>

        <div className="pt-1">
          <span className="inline-block px-4 py-2 bg-[#e82429] text-white rounded-xl text-sm font-medium shadow hover:bg-[#c71f24] transition">
            View Details →
          </span>
        </div>

      </div>
    </Link>
  );
}
