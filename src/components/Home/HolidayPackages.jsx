import React from "react";
import { FiCalendar } from "react-icons/fi";

const packages = [
  {
    duration: "4 Days / 3 Nights",
    title: "3 Nights - 4 Days Dubai Package",
    price: "From AED 1010 / person",
    label: "Senior Special",
    img: "https://plus.unsplash.com/premium_photo-1661916762370-4768aa1fc4c4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
  },
  {
    duration: "6 Days / 5 Nights",
    title: "5 Nights - 6 Days Dubai Packagee",
    price: "From AED 1499 / person",
    label: "Family Special",
    img: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074",
  },
  {
    duration: "5 Days / 4 Nights",
    title: "4 Nights - 5 Days Dubai Package",
    price: "From AED 1299 / person",
    label: "Family Special",
    img: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
  },
];

export default function HolidayPackages() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-left text-[#404041]">
          Holiday Packages
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => (
            <div
              key={idx}
              className="flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-shadow duration-500"
            >
              {/* Image with overlay */}
              <div className="relative overflow-hidden h-64">
                <img
                  src={pkg.img}
                  alt={pkg.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {/* Label */}
                <span className="absolute top-3 left-3 bg-[#e82429] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  {pkg.label}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col justify-between flex-1">
                {/* Duration with icon */}
                <div className="flex items-center text-gray-500 text-sm font-medium mb-1">
                  <FiCalendar className="mr-2" /> {pkg.duration}
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">{pkg.title}</h3>
                <p className="text-[#e82429] font-bold mb-5">{pkg.price}</p>

                {/* Buttons */}
                <div className="flex gap-4 mt-auto">
                  <button className="flex-1 py-3 rounded-lg font-semibold bg-gradient-to-r from-[#e82429] to-[#ff5a4d] text-white hover:opacity-90 transition duration-300">
                    Enquiry Now
                  </button>
                  <button className="flex-1 py-3 rounded-lg font-semibold border-2 border-[#e82429] text-[#e82429] hover:bg-[#e82429] hover:text-white transition duration-300">
                    View Trip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
