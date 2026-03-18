import React from "react";
import { FiMail } from "react-icons/fi";

export default function TravelInspiration() {
  return (
    <section className="relative py-10 sm:py-16 bg-bg-gray-50 overflow-hidden">
      
      {/* BACKGROUND GLOW */}
      {/* <div className="absolute top-0 left-0 w-72 h-72 bg-[#e82429]/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-300/20 blur-[120px] rounded-full"></div> */}

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="
          flex flex-col lg:flex-row items-center 
          gap-8 lg:gap-12 
          bg-white/70 backdrop-blur-xl 
          border border-white/40 
          shadow-[0_20px_60px_rgba(0,0,0,0.08)]
          rounded-3xl 
          p-6 sm:p-10
        ">
          
          {/* ===== LEFT CONTENT ===== */}
          <div className="flex-1 text-center lg:text-left">
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-[#2d2d2d] leading-tight">
              Dubai travel inspiration straight to your inbox ✈️
            </h2>

            <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto lg:mx-0">
              Discover curated experiences, exclusive deals, cashback offers, and essential travel tips for your next Dubai adventure.
            </p>

            {/* INPUT + BUTTON */}
            <form className="flex flex-col sm:flex-row items-center gap-3">
              
              <div className="relative w-full sm:w-[320px] lg:w-[380px]">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="
                    w-full 
                    pl-10 pr-4 py-3 
                    rounded-xl 
                    border border-gray-200 
                    focus:outline-none 
                    focus:ring-2 focus:ring-[#e82429]
                    shadow-sm
                    text-sm
                  "
                />
              </div>

              <button
                type="submit"
                className="
                  w-full sm:w-auto
                  px-6 py-3 
                  rounded-xl 
                  bg-gradient-to-r from-[#e82429] to-[#ff4d4f]
                  text-white font-semibold
                  shadow-md
                  hover:shadow-lg hover:scale-[1.02]
                  transition-all duration-300
                "
              >
                Subscribe
              </button>
            </form>

            {/* TRUST TEXT */}
            <p className="text-xs text-gray-400 mt-3">
              No spam. Only valuable travel deals & updates.
            </p>
          </div>

          {/* ===== RIGHT IMAGE ===== */}
          <div className="flex-1 w-full flex justify-center lg:justify-end">
            
            <div className="relative w-full max-w-sm sm:max-w-md">
              
              {/* IMAGE */}
              <img
                src="https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=1000&q=80"
                alt="Dubai Travel"
                className="
                  rounded-2xl 
                  shadow-[0_20px_50px_rgba(0,0,0,0.15)]
                  object-cover 
                  w-full
                "
              />

              {/* OVERLAY BADGE */}
              <div className="
                absolute bottom-4 left-4 
                bg-white/90 backdrop-blur-md 
                px-4 py-2 
                rounded-lg 
                text-xs font-medium 
                shadow
              ">
                ✨ Trending Dubai Tours
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}