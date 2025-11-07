import React from "react";

export default function TravelInspiration() {
  return (
    <section className="py-8 bg-gradient-to-r from-gray-50 via-white to-gray-100">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center justify-between px-6 gap-10">
        
        {/* ===== Left Content ===== */}
        <div className="flex-1 text-center lg:text-left">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "#404041" }}
          >
            Dubai travel inspiration straight to your inbox
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">
            Explore new cities with curated experiences, instant cashback,
            exclusive deals, and essential travel tips!
          </p>

          <form className="flex flex-col sm:flex-row items-center gap-3 sm:gap-0 sm:space-x-3 justify-center lg:justify-start">
          <input
  type="email"
  placeholder="Enter your email"
  className="w-full sm:w-[350px] lg:w-[400px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e82429] transition-all duration-300"
/>
            <button
              type="submit"
              className="bg-[#e82429] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#b91c23] transition-all duration-300"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* ===== Right Side Image ===== */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <img
            src="https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=1000&q=80"
            alt="Dubai Travel Inspiration"
            className="rounded-2xl shadow-xl w-full max-w-md object-cover"
          />
        </div>
      </div>
    </section>
  );
}
