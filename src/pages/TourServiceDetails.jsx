// src/pages/TourServiceDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import toursData from "../data/toursData";
import {
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaInfoCircle,
  FaUserCircle,
} from "react-icons/fa";

export default function TourServiceDetails() {
  const { slug, serviceSlug } = useParams();
  const navigate = useNavigate();
  const tour = toursData.find((t) => t.slug === slug);

  if (!tour)
    return (
      <div className="text-center py-20 text-2xl font-semibold text-red-600">
        Tour not found
      </div>
    );

  const service = tour.services.find(
    (s) => s.title.toLowerCase().replace(/\s+/g, "-") === serviceSlug
  );

  if (!service)
    return (
      <div className="text-center py-20 text-2xl font-semibold text-red-600">
        Service not found
      </div>
    );

  const [mainImage, setMainImage] = useState(service.img);

  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">
        {/* MOBILE-FIRST: IMAGE + TITLE */}
        <div className="lg:col-span-8 order-1 lg:order-1 space-y-8">
          {/* GALLERY */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <img
              src={mainImage}
              alt={service.title}
              className="w-full h-[420px] object-cover"
            />
          </div>

          {/* TITLE + PRICE */}
          <div className="bg-gradient-to-r from-[#fff4f4] to-[#ffeaea] rounded-3xl shadow-xl p-6 border border-[#e82429]/30">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-3xl font-extrabold text-[#721011] mb-2">
                  {service.title}
                </h1>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="bg-[#e82429]/20 text-[#721011] font-semibold px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <FaClock className="text-[#e82429]" /> {tour.duration}
                  </span>
                  <span className="bg-[#fff4f4]/80 text-[#721011] font-semibold px-3 py-1 rounded-full text-sm">
                    Luxury Experience
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-2 mt-3 md:mt-0">
                <p className="text-2xl md:text-2xl font-bold text-[#e82429]">
                  AED {service.price}
                </p>
                <p className="text-gray-500 text-sm md:text-base font-medium">
                  per person
                </p>

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

            <p className="mt-4 text-gray-700 text-sm md:text-base">
              Experience the ultimate luxury and personalized service in the
              heart of {tour.location || "Dubai"}. Perfect for families,
              couples, and solo travelers seeking an unforgettable adventure.
            </p>
          </div>
        </div>

        {/* CHECK AVAILABILITY */}
        <div className="lg:col-span-4 order-2 lg:order-2">
          <div className="sticky top-24 bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#404041]">
                Check Availability
              </h2>
              <span className="bg-[#e82429] text-white px-3 py-1 rounded-full text-sm">
                Popular
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-600 font-medium">Select Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#e82429] focus:outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-600 font-medium">Guests</label>
              <input
                type="number"
                placeholder="1-12 persons"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#e82429] focus:outline-none transition-all"
              />
            </div>

            <button className="w-full bg-gradient-to-r from-[#e82429] to-[#721011] text-white font-semibold py-3 rounded-xl shadow-lg hover:scale-105 transition-all">
              Check Availability
            </button>

            <div className="flex items-start gap-3 bg-[#fff4f4] p-4 rounded-xl border border-[#e82429]/30 text-gray-700">
              <span className="text-[#e82429] text-xl">💡</span>
              <p className="text-sm">
                Need assistance? Chat with our travel advisor for group
                bookings, special offers, and personalized support.
              </p>
            </div>

            <p className="text-gray-500 text-xs text-center border-t border-gray-200 pt-2">
              Prices are per person. Subject to availability and seasonal
              changes.
            </p>
          </div>
        </div>

        {/* REST OF CONTENT */}
        <div className="lg:col-span-8 order-3 lg:order-3 space-y-8">
          {/* OVERVIEW */}
          <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-[#404041] flex items-center gap-2 mb-4">
              <FaInfoCircle className="text-[#e82429]" /> Overview
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Step inside the world of unparalleled luxury — an iconic
              experience with stunning views and exclusive access.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Enjoy guided tours, unique amenities, and unforgettable moments
              designed for travelers seeking the ultimate adventure.
            </p>
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
              <li>💡 Fun Fact: The marble used is the same as Michelangelo’s sculptures.</li>
            </ul>
          </div>

          {/* NEED TO KNOW */}
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-3">
            <h2 className="text-2xl font-semibold text-[#404041]">Need to Know</h2>
            <h3 className="text-lg font-semibold text-[#e82429]">Important Information</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Max 12 people per group.</li>
              <li>Smart casual attire required.</li>
              <li>Kids Club available for ages 2+.</li>
            </ul>

            <h3 className="text-lg font-semibold text-[#e82429]">Restrictions</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>No food & drinks allowed.</li>
              <li>No photography in the lobby.</li>
              <li>No flip-flops or beachwear.</li>
            </ul>

            <h3 className="text-lg font-semibold text-[#e82429]">Timings</h3>
            <p className="text-gray-700">Daily: 10:30 AM – 9:00 PM</p>
          </div>

          {/* CANCELLATION */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-[#404041] mb-2">Cancellation Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              You can cancel up to <strong>24 hours before</strong> the
              experience for a full refund.
            </p>
          </div>

          {/* REVIEWS */}
          <div className="bg-gray-50 rounded-3xl p-2 space-y-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-[#721011] mb-4 relative inline-block">
              Ratings & Reviews
              <span className="absolute left-0 bottom-0 w-16 h-1 bg-[#e82429] rounded-full"></span>
            </h2>

            {[{
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
            }].map((r, i) => (
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
                      <span key={idx} className={`px-1 rounded ${idx < r.rating ? "bg-yellow-400" : "bg-gray-200"} text-yellow-500`}>
                        <FaStar size={14} />
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-base">{r.review}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
