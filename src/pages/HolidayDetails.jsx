// src/pages/HolidayDetails.jsx
import { useParams } from "react-router-dom";
import holidayData from "../data/holidayData";
import { useState } from "react";

export default function HolidayDetails() {
  const { slug } = useParams();
  const pkg = holidayData.find((p) => p.slug === slug);
  const [mainImage, setMainImage] = useState(pkg?.gallery?.[0] || pkg?.img);

  if (!pkg)
    return (
      <h2 className="text-center py-10 text-2xl text-red-600">
        Package not found
      </h2>
    );

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Content 70% */}
      <div className="lg:col-span-8 space-y-6">
        {/* Gallery */}
        <div className="space-y-3">
          <img
            src={mainImage}
            alt={pkg.title}
            className="w-full h-80 object-cover rounded-xl shadow-lg"
          />
          <div className="flex gap-3">
            {(pkg.gallery || []).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${pkg.title}-${idx}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                  mainImage === img ? "border-[#e82429]" : "border-transparent"
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Title, Price & Duration */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-100 p-4 rounded-xl shadow-sm">
          <h1 className="text-3xl font-extrabold text-[#721011]">{pkg.title}</h1>
          <div className="flex gap-6 mt-2 md:mt-0">
            <span className="text-xl font-semibold text-[#404041]">
              AED {pkg.price} / person
            </span>
            <span className="text-xl font-semibold text-[#404041]">
              Duration: {pkg.duration}
            </span>
          </div>
        </div>

        {/* Short Summary */}
        <p className="text-gray-700 text-lg">{pkg.shortDesc}</p>

        {/* Description & Overview */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-[#404041]">Overview</h2>
          <p className="text-gray-700">{pkg.overview}</p>

          <h2 className="text-2xl font-semibold text-[#404041]">Description</h2>
          <p className="text-gray-700">{pkg.details}</p>
        </div>

        {/* Inclusions & Exclusions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-[#404041]">Inclusions</h2>
          <ul className="list-disc list-inside text-gray-700">
            {(pkg.inclusions || []).map((inc, idx) => (
              <li key={idx}>{inc}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-semibold text-[#404041]">Exclusions</h2>
          <ul className="list-disc list-inside text-gray-700">
            {(pkg.exclusions || []).map((exc, idx) => (
              <li key={idx}>{exc}</li>
            ))}
          </ul>
        </div>

        {/* Why Choose Us */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-[#404041]">Why Choose Us</h2>
          <ul className="list-disc list-inside text-gray-700">
            {(pkg.whyChoose || []).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Content 30% */}
      <div className="lg:col-span-4 space-y-6">
        <div className="sticky top-20 bg-white p-6 rounded-xl shadow-lg space-y-4">
          <h2 className="text-xl font-semibold text-[#404041]">Check Availability</h2>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e82429]"
          />
          <input
            type="number"
            placeholder="Number of Persons"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e82429]"
          />
          <button className="w-full bg-[#e82429] text-white py-3 rounded-lg font-semibold hover:bg-[#721011] transition-all">
            Check Availability
          </button>

          <div className="mt-6 space-y-2">
            <p className="text-gray-700">
              Book your package now and enjoy a memorable experience with our
              professional services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
