import React from "react";
import {
  FaStar,
  FaClock,
  FaCalendarCheck,
  FaCheckCircle,
} from "react-icons/fa";

export default function TourCard({
  image,
  category,
  rating,
  reviews,
  title,
  details,
  price,
  duration,
  cancellation,
  bookNowText,
  showInfoText,
}) {
  return (
    <div className="max-w-[1200px] mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-shadow duration-300">
      
      {/* Image Section */}
      <div className="md:w-1/3 w-full rounded-xl overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-72 md:h-80 lg:h-96 object-cover rounded-xl"
        />
      </div>

      {/* Middle Content */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        <div>
          <p className="text-sm uppercase font-semibold text-[#e82429] tracking-wide mb-1">
            {category} •{" "}
            <span className="text-gray-700 inline-flex items-center gap-1">
              <FaStar className="text-[#e82429]" /> {rating}
              <span className="text-gray-500 text-sm">({reviews})</span>
            </span>
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-[#1c1c1c] mb-3">{title}</h2>

          <ul className="text-gray-700 text-sm md:text-base space-y-1 list-disc pl-5">
            {details?.map((item, index) => <li key={index}>{item}</li>) || null}
          </ul>

          {showInfoText && (
            <a
              href="#"
              className="text-[#e82429] font-semibold mt-2 inline-block hover:underline text-sm md:text-base"
            >
              {showInfoText}
            </a>
          )}
        </div>
      </div>

      {/* Right Side (Price + CTA) */}
      <div className="md:w-1/4 w-full border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center space-y-2">
        <div>
          <p className="text-sm md:text-base text-gray-500 mb-1">from</p>
          <h3 className="text-2xl md:text-3xl font-bold text-[#1c1c1c] mb-3">{price}</h3>
          <button className="bg-[#5f19ff] text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-[#4a14cc] transition-colors duration-300 w-full text-sm md:text-base">
            Check availability
          </button>

          <div className="mt-3 space-y-1 text-sm md:text-base text-gray-600">
            <p className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" /> {cancellation}
            </p>
            <p className="flex items-center gap-2">
              <FaCalendarCheck className="text-[#5f19ff]" /> {bookNowText}
            </p>
            <p className="flex items-center gap-2">
              <FaClock className="text-gray-500" /> {duration}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
