import React from "react";
import { useNavigate } from "react-router-dom";

const experiences = [
  {
    title: "Desert Safari",
    desc: "Thrilling dune bashing, camel rides & stunning sunsets.",
    price: "AED 50",
    img: "https://images.unsplash.com/photo-1588310558566-b983c7d257e4?auto=format&fit=crop&w=800&q=80",
    path: "tours/desert-safari-with-dinner/desert-safari-with-bbq-dinner-by-4x4-vehicle",
  },
  {
    title: "Burj Khalifa At The Top",
    desc: "Marvel at Dubai from the tallest observation deck.",
    price: "AED 179",
    img: "https://plus.unsplash.com/premium_photo-1694475631307-0f0a85924605?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1145",
    path: "tours/burj-khalifa/burj-khalifa-at-the-top-124-+-125-floor-non-prime-hours",
  },
  {
    title: "Dubai Marina Yacht Tour",
    desc: "Luxury sailing in Dubai Marina with amazing views.",
    price: "AED 150",
    img: "https://images.unsplash.com/photo-1600665787589-c970451fc6b1?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2070",
    path: "tours/dhow-cruise/marina-dhow-cruise-dinner-with-transfers",
  },
  {
    title: "Dubai City Tour",
    desc: "Explore the iconic landmarks and hidden gems of Dubai.",
    price: "AED 375",
    img: "/TourImg/Dubai-City-Tour.png",
    path: "tours/dubai-city-tour/dubai-city-tour",
  },
];

export default function PopularExperiences() {
  const navigate = useNavigate();

  const goToDetails = (path) => {
    navigate(`/${path}`);
  };

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#404041]">
          Most Popular Experiences in Dubai
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 cursor-pointer flex flex-col"
              onClick={() => goToDetails(exp.path)}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={exp.img}
                  alt={exp.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute top-3 right-3 bg-[#e82429] text-white px-3 py-1 rounded-full font-semibold text-sm shadow-md">
                  {exp.price}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3
                    className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 hover:text-[#e82429] transition"
                    onClick={() => goToDetails(exp.path)}
                  >
                    {exp.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{exp.desc}</p>
                </div>

                <button
                  className="mt-4 py-3 rounded-lg font-semibold bg-[#e82429] text-white hover:bg-[#d01f23] transition duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToDetails(exp.path);
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
