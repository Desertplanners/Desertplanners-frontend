// src/pages/HolidayDetails.jsx
import { useParams } from "react-router-dom";
import { useState } from "react";
import holidayData from "../data/holidayData";
import {
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaInfoCircle,
  FaUserCircle,
} from "react-icons/fa";

export default function HolidayDetails() {
  const { slug } = useParams();
  const pkg = holidayData.find((p) => p.slug === slug);
  const [mainImage, setMainImage] = useState(pkg?.gallery?.[0] || pkg?.img);

  if (!pkg)
    return (
      <div className="text-center py-20 text-2xl font-semibold text-red-600">
        Package not found
      </div>
    );

  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-8 space-y-8 order-2 lg:order-1">
          {/* GALLERY */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <img
              src={mainImage}
              alt={pkg.title}
              className="w-full h-[420px] object-cover"
            />
            <div className="flex gap-3 overflow-x-auto p-4 bg-gray-100">
              {(pkg.gallery || []).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setMainImage(img)}
                  className={`w-24 h-24 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                    mainImage === img
                      ? "border-[#e82429] scale-105"
                      : "border-transparent hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* TITLE + PRICE + META */}
          <div className="bg-gradient-to-r from-[#fff4f4] to-[#ffeaea] rounded-3xl shadow-xl p-6 border border-[#e82429]/30">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Left Content: Title & Location */}
              <div>
                <h1 className="text-3xl md:text-3xl font-extrabold text-[#721011] mb-2">
                  {pkg.title}
                </h1>
                <p className="text-gray-600 flex items-center gap-2 text-lg md:text-base">
                  <FaMapMarkerAlt className="text-[#e82429]" />
                  {pkg.location || "Dubai, UAE"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="bg-[#e82429]/20 text-[#721011] font-semibold px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <FaClock className="text-[#e82429]" /> {pkg.duration}
                  </span>
                  <span className="bg-[#fff4f4]/80 text-[#721011] font-semibold px-3 py-1 rounded-full text-sm">
                    Luxury Experience
                  </span>
                </div>
              </div>

              {/* Right Content: Price & Ratings */}
              <div className="flex flex-col items-start md:items-end gap-2 mt-3 md:mt-0">
                <p className="text-2xl md:text-2xl font-bold text-[#e82429]">
                  {pkg.price}
                </p>
                <p className="text-gray-500 text-sm md:text-base font-medium">
                  per person
                </p>

                {/* Ratings */}
                <div className="flex items-center gap-2 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  ))}
                  <span className="text-gray-600 text-sm">
                    4.9 / 5 (134 reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Optional Tagline */}
            <p className="mt-4 text-gray-700 text-sm md:text-base">
              Experience the ultimate luxury and personalized service in the
              heart of Dubai. Perfect for families, couples, and solo travelers
              seeking an unforgettable adventure.
            </p>
          </div>

          {/* OVERVIEW */}
          <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
            {/* Header */}
            <h2 className="text-2xl font-semibold text-[#404041] flex items-center gap-2 mb-4">
              <FaInfoCircle className="text-[#e82429]" /> Overview
            </h2>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left: Text Content */}
              <div className="lg:w-2/3 space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Step inside the world of unparalleled luxury at{" "}
                  <strong>Burj Al Arab</strong> — an icon of Dubai’s innovation
                  and grandeur. From the royal gold interiors to the panoramic
                  views of the Arabian Gulf, this tour offers a
                  once-in-a-lifetime look into one of the most exclusive hotels
                  on Earth.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Explore the luxurious Royal Suite, guided by a professional
                  butler who shares captivating stories and hidden details. Walk
                  the same marble corridors once reserved for royalty and
                  celebrities. The tour ends at the Inside Burj Al Arab
                  Boutique, where you can take home a piece of this
                  unforgettable experience.
                </p>

                {/* Cards for Duration & Location */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-[#fff4f4] border border-[#e82429]/30 px-4 py-2 rounded-xl shadow-sm">
                    <FaClock className="text-[#e82429]" />
                    <span className="font-medium text-[#721011]">
                      Duration: {pkg.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#fff4f4] border border-[#e82429]/30 px-4 py-2 rounded-xl shadow-sm">
                    <FaMapMarkerAlt className="text-[#e82429]" />
                    <span className="font-medium text-[#721011]">
                      Location: {pkg.location || "Dubai, UAE"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Mini Gallery */}
              <div className="lg:w-1/3 flex flex-col gap-3">
                {(pkg.gallery?.slice(0, 3) || []).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Overview-${i}`}
                    className="rounded-xl h-32 w-full object-cover shadow-md hover:scale-105 transition-transform cursor-pointer"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* HIGHLIGHTS */}
          <div className="bg-gradient-to-br from-[#fff4f4] to-[#ffeaea] rounded-2xl shadow-md p-6 space-y-3 border border-[#e82429]/20">
            <h2 className="text-2xl font-semibold text-[#721011] mb-2">
              Highlights ✨
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>🌟 90-min guided tour with a dedicated butler.</li>
              <li>🌟 Access to the Royal Suite and exclusive hotel areas.</li>
              <li>🌟 Learn Burj Al Arab’s design secrets and history.</li>
              <li>🌟 Explore the Inside Burj Boutique and shop souvenirs.</li>
              <li>
                💡 Fun Fact: The marble used is the same as Michelangelo’s
                sculptures.
              </li>
            </ul>
          </div>

          {/* NEED TO KNOW */}
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-3">
            <h2 className="text-2xl font-semibold text-[#404041]">
              Need to Know
            </h2>

            <h3 className="text-lg font-semibold text-[#e82429]">
              Important Information
            </h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Max 12 people per group.</li>
              <li>Smart casual attire required.</li>
              <li>Kids Club available for ages 2+.</li>
            </ul>

            <h3 className="text-lg font-semibold text-[#e82429]">
              Restrictions
            </h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>No food & drinks allowed.</li>
              <li>No photography in the lobby.</li>
              <li>No flip-flops or beachwear.</li>
            </ul>

            <h3 className="text-lg font-semibold text-[#e82429]">Timings</h3>
            <p className="text-gray-700">Daily: 10:30 AM – 9:00 PM</p>
          </div>

          {/* CANCELLATION POLICY */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-[#404041] mb-2">
              Cancellation Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You can cancel these tickets up to{" "}
              <strong>24 hours before</strong> the experience begins for a full
              refund.
            </p>
          </div>

          {/* REALISTIC REVIEWS */}
          <div className="bg-gray-50 rounded-3xl p-6 space-y-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-[#721011] mb-4 relative inline-block">
              Ratings & Reviews
              <span className="absolute left-0 bottom-0 w-16 h-1 bg-[#e82429] rounded-full"></span>
            </h2>

            {[
              {
                name: "Aarav Sharma",
                date: "Oct 2025",
                rating: 5,
                review:
                  "Absolutely mesmerizing! The tour guide was informative and polite. The interiors of Burj Al Arab are beyond imagination.",
              },
              {
                name: "Sophia Khan",
                date: "Sept 2025",
                rating: 5,
                review:
                  "Felt like royalty for a day. The Royal Suite was stunning, and the staff made it a truly unforgettable experience!",
              },
              {
                name: "Rahul Mehta",
                date: "Aug 2025",
                rating: 4,
                review:
                  "Great experience overall. The only downside was the crowd at the entrance, but the tour itself was top-notch.",
              },
            ].map((r, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FaUserCircle className="text-4xl text-gray-400 p-1 rounded-full bg-gray-100" />
                    <div>
                      <h4 className="font-semibold text-gray-800">{r.name}</h4>
                      <p className="text-sm text-gray-500">{r.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, idx) => (
                      <span
                        key={idx}
                        className={`px-1 rounded bg-${
                          idx < r.rating ? "yellow-400" : "gray-200"
                        } text-yellow-500`}
                      >
                        <FaStar size={14} />
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-base">
                  {r.review}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT CONTENT (CHECK AVAILABILITY) */}
        <div className="lg:col-span-4 order-1 lg:order-2">
          <div className="sticky top-24 bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#404041]">
                Check Availability
              </h2>
              <span className="bg-[#e82429] text-white px-3 py-1 rounded-full text-sm">
                Popular
              </span>
            </div>

            {/* Date Selection */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 font-medium">Select Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#e82429] focus:outline-none transition-all"
              />
            </div>

            {/* Number of Guests */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 font-medium">Guests</label>
              <input
                type="number"
                placeholder="1-12 persons"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#e82429] focus:outline-none transition-all"
              />
            </div>

            {/* Check Availability Button */}
            <button className="w-full bg-gradient-to-r from-[#e82429] to-[#721011] text-white font-semibold py-3 rounded-xl shadow-lg hover:scale-105 transition-all">
              Check Availability
            </button>

            {/* Quick Help */}
            <div className="flex items-start gap-3 bg-[#fff4f4] p-4 rounded-xl border border-[#e82429]/30 text-gray-700">
              <span className="text-[#e82429] text-xl">💡</span>
              <p className="text-sm">
                Need assistance? Chat with our travel advisor for group
                bookings, special offers, and personalized support.
              </p>
            </div>

            {/* Footer Note */}
            <p className="text-gray-500 text-xs text-center border-t border-gray-200 pt-2">
              Prices are per person. Subject to availability and seasonal
              changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
