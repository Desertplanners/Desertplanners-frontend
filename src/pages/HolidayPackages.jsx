import { Link } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import holidayData from "../data/holidayData";

export default function HolidayPackages() {
  return (
    <div className="w-full">
      {/* ====== Banner Section ====== */}
      <div className="relative w-full h-64 md:h-[450px] overflow-hidden">
        <img
          src="https://i.pinimg.com/736x/e4/69/c0/e469c047d9f5a771c24363a2615e6894.jpg"
          alt="Holiday Packages"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
          <h1 className="text-white text-3xl md:text-5xl font-extrabold text-center max-w-[1200px] px-4 tracking-wide drop-shadow-[3px_3px_10px_rgba(0,0,0,0.9)]">
            Discover Your Perfect <span className="text-[#e82429]">Holiday</span> Getaway
          </h1>
        </div>
      </div>

      {/* ====== Package Cards ====== */}
      <div className="max-w-[1200px] mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {holidayData.map((pkg) => (
          <Link
            key={pkg.id}
            to={`/holidays/${pkg.slug}`}
            className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.03]"
          >
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={pkg.img}
                alt={pkg.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

              {/* Top overlay info */}
              <div className="absolute top-4 left-4 bg-white/90 text-gray-800 px-3 py-1 text-sm rounded-full font-semibold shadow-md">
                <FaMapMarkerAlt className="inline-block text-[#e82429] mr-1" />
                {pkg.location}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5">
              <h2 className="text-2xl font-bold text-[#e82429] mb-2 group-hover:text-[#721011] transition-all">
                {pkg.title}
              </h2>

              {/* Star Ratings */}
              <div className="flex items-center gap-1 mb-3 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={14} />
                ))}
                <span className="text-gray-500 text-sm ml-2">
                  ({pkg.reviews}+ reviews)
                </span>
              </div>

              <p className="text-gray-700 text-[15px] mb-4 leading-relaxed line-clamp-3">
                {pkg.shortDesc}
              </p>

              {/* Info row */}
              <div className="flex justify-between items-center text-gray-600 text-sm mb-4">
                <div className="flex items-center gap-1">
                  <FaClock className="text-[#e82429]" />
                  <span>{pkg.duration}</span>
                </div>
                <p className="font-semibold text-[#721011]">{pkg.price}</p>
              </div>

              <div className="w-full text-center bg-[#e82429] text-white font-semibold py-2 rounded-xl hover:bg-[#721011] transition-all duration-300">
                View Details
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
