import React from "react";
import { Clock, Tag, Headphones } from "lucide-react"; // icon imports

export default function TourBanner() {
  return (
    <section className="bg-gradient-to-br from-[#f9fafc] via-[#f5f6f9] to-[#f8f8fb] py-16">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-10">
        {/* LEFT CONTENT */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1c1c1c] leading-snug">
            Book Dubai Tours | Guided Tours, Bus Tours, City Tours in Dubai
          </h1>

          <ul className="space-y-4 text-gray-700 text-lg">
            <li className="flex items-center gap-3">
              <Clock className="text-[#e82429]" size={22} />
              Last minute availability.
            </li>
            <li className="flex items-center gap-3">
              <Tag className="text-[#e82429]" size={22} />
              Best deals & discounts.
            </li>
            <li className="flex items-center gap-3">
              <Headphones className="text-[#e82429]" size={22} />
              24/7 support across the globe.
            </li>
          </ul>

        
        </div>

        {/* RIGHT IMAGE */}
        <div className="md:w-1/2 flex justify-center relative">
          <div className="absolute inset-0 bg-[#e82429]/10 blur-3xl rounded-full -z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
            alt="Dubai Tours"
            className="rounded-2xl shadow-xl w-full h-[350px] object-cover"
          />
        </div>
      </div>
    </section>
  );
}
