import React, { useState, useEffect } from "react";
import {
  FaClock,
  FaStar,
  FaCalendarAlt,
  FaBed,
  FaUtensils,
  FaUser,
} from "react-icons/fa";

export default function HolidayPage() {
  const [activeTab, setActiveTab] = useState("highlights");

  // 🟢 TOP QUALITY UNSPLASH DIRECT IMAGES (guaranteed load)
  const tour = {
    title: "Winter Escape: Dubai Highlights",
    duration: "3N - 4D",
    category: { name: "Winter Package" },
    priceAdult: 1399,
    priceChild: 999,
    description:
      "Experience the best of Dubai with our luxury travel packages and unforgettable adventures. Comfortable stays, curated sightseeing and thrilling desert experiences.",

    timings: "Flexible",

    inclusions: [
      "Accommodation as per hotel category",
      "Daily breakfast",
      "Airport transfers (arrival & departure)",
      "Desert safari with BBQ dinner",
    ],

    exclusions: [
      "Personal expenses",
      "Tips & gratuities",
      "Any optional tours",
    ],

    itinerary: [
      {
        title: "DUBAI AIRPORT ARRIVAL TRANSFERS",
        image:
          "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title:
          "DUBAI HALF DAY CITY TOUR + DUBAI FRAME + MARINA DHOW CRUISE WITH DINNER",
        image:
          "https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "DESERT SAFARI WITH BBQ DINNER (4x4 Jeep Experience)",
        image:
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "DUBAI AIRPORT DEPARTURE",
        image:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      },
    ],

    knowBefore: [
      "Pick-up and drop-off included in most tours",
      "Comfortable clothing recommended",
      "Duration may vary depending on traffic",
      "Free cancellation up to 24 hours in advance",
      "Guided tours with professional staff",
    ],

    terms: `• Quote valid only for above mentioned pax count.
• Any change in pax count affects pricing.
• Hotels may require mandatory refundable deposits.
• Check-In 2:00 PM, Check-Out 12:00 PM.
• Rooms & rates subject to availability during booking.
• Burj Khalifa tickets from March 2025 are non-refundable.`,
  };

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    selectedTour: "Dubai Highlights",
    location: "",
    message: "",
  });

  const sampleTours = [
    "Dubai Highlights",
    "Desert Adventure",
    "Luxury Dubai Stay",
    "Family Fun Package",
  ];

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Enquiry submitted successfully!");
  };

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 4);
    }, 4000); // auto slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* LEFT SIDE */}
      <div className="md:col-span-2 space-y-10">
        {/* MAIN IMAGE */}
        {/* 🔥 AUTO SLIDER HERO IMAGE */}
        <div className="rounded-3xl overflow-hidden shadow-xl relative h-[420px] md:h-[480px]">
          {[
            "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80",
          ].map((src, index) => (
            <img
              key={index}
              src={src}
              className={`
      absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-in-out
      ${activeSlide === index ? "opacity-100" : "opacity-0"}
    `}
            />
          ))}

          {/* DOTS INDICATORS */}
          <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`
        w-3 h-3 rounded-full transition-all
        ${activeSlide === i ? "bg-[#e82429] scale-125" : "bg-white/60"}
      `}
              />
            ))}
          </div>
        </div>

        {/* HERO CARD */}
        <div className="bg-white rounded-3xl shadow-lg p-7 border border-[#e82429]/10">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-[#721011]">
                {tour.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-3">
                <span className="bg-[#ffe4e4] px-4 py-1.5 rounded-full flex items-center gap-2 font-semibold">
                  <FaClock className="text-[#e82429]" /> {tour.duration}
                </span>

                <span className="bg-[#fff4f4] px-4 py-1.5 rounded-full font-semibold">
                  {tour.category.name}
                </span>
              </div>
            </div>

            {/* PRICE */}
            <div className="flex flex-col items-start md:items-end">
              <p className="text-4xl font-black text-[#e82429]">
                AED {tour.priceAdult}
              </p>

              <p className="text-gray-500 text-sm">(Per Person)</p>

              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-500" />
                ))}
                <span className="text-gray-600 text-sm">4.9 • 134 reviews</span>
              </div>
            </div>
          </div>

          <p className="mt-5 text-gray-700">{tour.description}</p>
        </div>

        {/* ⭐ MODERN TAB SYSTEM */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-[#e82429]/20">
          {/* TABS */}
          {/* TABS */}
          <div
            className="
    flex gap-3 border-b pb-3 
    overflow-x-auto no-scrollbar
    whitespace-nowrap
  "
          >
            {[
              ["highlights", "Highlights"],
              ["itinerary", "Itinerary"],
              ["know", "Need to Know"],
              ["cancel", "Cancellation & Refund"],
              ["terms", "Terms &"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`
        px-3 md:px-4 py-2 rounded-lg text-sm md:text-[0.95rem] font-semibold
        transition-all shrink-0
        ${
          activeTab === key
            ? "bg-[#e82429] text-white shadow"
            : "bg-[#fff4f4] text-[#721011]"
        }
      `}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ----------------------------- TAB CONTENT AREA ----------------------------- */}

          <div className="mt-6">
            {/* ⭐ HIGHLIGHTS */}
            {activeTab === "highlights" && (
              <div className="space-y-5">
                <h3 className="text-xl font-bold text-[#721011]">
                  Package Highlights
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex gap-3">
                    <FaCalendarAlt className="text-[#e82429] text-xl" />
                    <div>
                      <p className="font-semibold">NO OF NIGHT</p>
                      <p>{tour.duration}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <FaUser className="text-[#e82429] text-xl" />
                    <div>
                      <p className="font-semibold">NO OF PERSON</p>
                      <p>02 Adults</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <FaBed className="text-[#e82429] text-xl" />
                    <div>
                      <p className="font-semibold">NO OF ROOM</p>
                      <p>01 Standard Double Room</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <FaUtensils className="text-[#e82429] text-xl" />
                    <div>
                      <p className="font-semibold">MEAL PLAN</p>
                      <p>Bed & Breakfast</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ⭐ ITINERARY — THE NEW MODERN SECTION */}
            {activeTab === "itinerary" && (
              <div className="space-y-16">
                {tour.itinerary.map((d, i) => (
                  <div
                    key={i}
                    className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#e82429]/20 group"
                  >
                    {/* IMAGE */}
                    <div className="relative">
                      <img
                        src={d.image}
                        className="w-full h-[380px] md:h-[450px] object-cover transform group-hover:scale-105 transition-all duration-700"
                      />

                      {/* BLACK GRADIENT OVERLAY */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                      {/* FLOATING DAY TAG */}
                      <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full shadow-xl border border-white">
                        <p className="text-[#721011] font-bold text-lg">
                          DAY {i + 1}
                        </p>
                      </div>

                      {/* FLOATING TITLE BOX */}
                      <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-[#e82429]/20">
                        <h3 className="text-2xl font-bold text-[#721011] mb-2">
                          {d.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ⭐ NEED TO KNOW */}
            {activeTab === "know" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#721011]">
                  Need to Know
                </h3>

                <ul className="space-y-3">
                  {tour.knowBefore.map((x, i) => (
                    <li
                      key={i}
                      className="bg-[#fff4f4] p-3 rounded-xl border flex gap-3"
                    >
                      <span className="text-xl">ℹ️</span> {x}
                    </li>
                  ))}
                </ul>

                <h3 className="text-xl font-bold text-[#e82429] mt-5">
                  Inclusions
                </h3>
                <ul className="space-y-2">
                  {tour.inclusions.map((x, i) => (
                    <li key={i} className="bg-[#fff4f4] p-2 rounded-lg border">
                      ✅ {x}
                    </li>
                  ))}
                </ul>

                <h3 className="text-xl font-bold text-[#e82429] mt-5">
                  Exclusions
                </h3>
                <ul className="space-y-2">
                  {tour.exclusions.map((x, i) => (
                    <li key={i} className="bg-[#fff4f4] p-2 rounded-lg border">
                      ❌ {x}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ⭐ CANCELLATION */}
            {activeTab === "cancel" && (
              <div className="bg-[#fff4f4] p-6 rounded-2xl border space-y-3">
                <p>• Free cancellation up to 24 hours before the tour date.</p>
                <p>• 50% refund if cancelled 24–48 hours before service.</p>
                <p>• No refund within 24 hours of travel.</p>
                <p>• Theme park & Burj Khalifa tickets non-refundable.</p>
              </div>
            )}

            {/* ⭐ TERMS */}
            {activeTab === "terms" && (
              <div className="space-y-4">
                {tour.terms
                  .split("•")
                  .filter((x) => x.trim())
                  .map((line, index) => (
                    <div
                      key={index}
                      className="bg-[#fff7f7] p-4 rounded-xl border flex gap-4"
                    >
                      <div className="w-8 h-8 bg-[#e82429] text-white flex items-center justify-center rounded-full">
                        {index + 1}
                      </div>
                      <p>{line.trim()}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* RIGHT SIDE */}
      <aside className="md:col-span-1 space-y-8">
        {/* ⭐ WHY BOOK WITH US */}
        <div className="bg-white rounded-3xl shadow-xl p-5 border border-[#e82429]/20">
          <h3 className="text-lg font-bold text-[#721011] mb-4">
            ⭐ Why Book With Us?
          </h3>

          <div className="grid grid-cols-2 gap-3 text-center">
            {[
              ["⚡", "Instant", "Confirmation"],
              ["🎓", "Trained", "Team"],
              ["💰", "Best", "Price"],
              ["🕒", "24/7", "Support"],
              ["🏆", "Quality", "Service"],
              ["😊", "Happy", "Clients"],
            ].map(([icon, title, sub], idx) => (
              <div
                key={idx}
                className="p-4 bg-[#fff4f4] rounded-xl border border-[#e82429]/20"
              >
                <div className="text-2xl mb-1">{icon}</div>
                <p className="font-semibold">{title}</p>
                <p className="text-xs text-gray-600">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ⭐ STATIC ENQUIRY FORM */}
        <div className="bg-white rounded-3xl shadow-xl p-7 border border-[#e82429]/20">
          <h3 className="text-2xl font-extrabold text-[#721011] mb-6">
            Enquire Now
          </h3>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="First Name"
                className="p-3 border rounded-xl w-full"
              />
              <input
                placeholder="Last Name"
                className="p-3 border rounded-xl w-full"
              />
            </div>

            <input
              placeholder="Email"
              className="p-3 border rounded-xl w-full"
            />
            <input
              placeholder="Contact Number"
              className="p-3 border rounded-xl w-full"
            />

            <select className="p-3 border rounded-xl w-full">
              <option>Dubai Highlights</option>
              <option>Desert Adventure</option>
              <option>Luxury Dubai Stay</option>
              <option>Family Fun Package</option>
            </select>

            <input
              placeholder="Your Location"
              className="p-3 border rounded-xl w-full"
            />

            <textarea
              placeholder="Message / Enquiry"
              className="p-3 border rounded-xl w-full h-28"
            ></textarea>

            <button
              type="button"
              className="w-full py-3 bg-gradient-to-r from-[#e82429] to-[#721011] text-white font-bold rounded-xl"
            >
              Submit Enquiry
            </button>
          </form>
        </div>

        {/* ⭐ STATIC NEED HELP SECTION */}
        <div className="bg-white rounded-3xl shadow-xl p-5 border border-[#e82429]/20">
          <h3 className="text-lg font-bold text-[#721011] mb-3">
            🆘 Need Help?
          </h3>

          <div className="p-3 bg-[#fff4f4] rounded-xl mb-3 border">
            📞 <b>+971 50 000 0000</b>
          </div>

          <div className="p-3 bg-[#fff4f4] rounded-xl border">
            📧 support@desertplanners.com
          </div>
        </div>
      </aside>
      
    </div>
  );
}
