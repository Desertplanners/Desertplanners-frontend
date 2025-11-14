import React, { useState, useEffect } from "react";
import DataService from "../../config/DataService";
import { API } from "../../config/API";
import "./Banner.css";

export default function Banner() {
  const api = DataService();
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch banners from backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get(API.GET_BANNERS);
        // filter only visible banners & sort by order
        const filtered = (res.data || [])
          .filter((b) => b.visible)
          .sort((a, b) => a.order - b.order);
        setSlides(filtered);
      } catch (err) {
        console.error("❌ Error fetching banners:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // 🔁 Auto slide rotation
  useEffect(() => {
    if (!slides.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (loading) {
    return (
      <section className="relative w-full h-[400px] sm:h-[500px] md:h-[550px] lg:h-[650px] bg-gray-200 animate-pulse flex items-center justify-center text-gray-500">
        Loading banner...
      </section>
    );
  }

  if (!slides.length) {
    return (
      <section className="relative w-full h-[400px] sm:h-[500px] md:h-[550px] lg:h-[650px] bg-gray-100 flex items-center justify-center text-gray-500">
        No banners available
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[550px] lg:h-[650px]">
        {slides.map((slide, index) => (
          <div
            key={slide._id || index}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* ✅ Responsive Image from DB */}
            <picture>
              <source srcSet={slide.mobileImage} media="(max-width: 768px)" />
              <source srcSet={slide.desktopImage} media="(min-width: 769px)" />
              <img
                src={slide.desktopImage}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>

            {/* ✅ Text Content (unchanged design) */}
            {index === current && (
              <div className="absolute bottom-14 sm:bottom-20 left-0 w-full flex justify-start px-4 sm:px-8">
                <div className="max-w-[1200px] w-full mx-auto flex flex-col items-start text-white animate-fadeInUp">
                  {/* Modern Accent Tag */}
                  <p className="text-[10px] sm:text-xs md:text-sm tracking-[5px] uppercase text-white/80 mb-4">
                    <span className="relative">
                      {slide.subtitle}
                      <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-[#ff4040] to-[#ffb199] rounded-full"></span>
                    </span>
                  </p>

                  {/* Split Title With Highlight Line */}
                  <h2 className="text-left font-extrabold text-4xl sm:text-6xl md:text-7xl leading-[1.15] mb-6 tracking-tight drop-shadow-xl">
                    <span className="block">
                      {slide.title.split(" ").slice(0, 2).join(" ")}
                    </span>
                    <span className="block relative">
                      {slide.title.split(" ").slice(2).join(" ")}
                      <span className="absolute left-0 -bottom-2 w-24 h-[3px] bg-[#ff3d3d] rounded-full shadow-[0_0_12px_#ff3d3d]"></span>
                    </span>
                  </h2>

                  {/* Modern Price Badge */}
                <div className="flex items-center gap-4 mb-6">

  {/* Fancy Label With Icon */}
  <div className="flex items-center gap-2">
    <span className="w-2 h-2 bg-[#ff5252] rounded-full shadow-[0_0_10px_#ff5252]"></span>

    <span className="text-white/85 text-xs sm:text-sm md:text-base tracking-[3px] uppercase font-medium">
      Starting From
    </span>
  </div>

  {/* Premium Price With Soft Glow */}
  <div className="relative">
    <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#ff5050] to-[#ff9090] text-transparent bg-clip-text drop-shadow-[0_0_12px_#ff505055] tracking-tight">
      AED {slide.price}
    </p>

    {/* Soft halo glow behind the price */}
    <span className="absolute inset-0 -z-10 blur-xl bg-[#ff5a5a]/30"></span>
  </div>

</div>


                  {/* CTA Button - Minimal Modern */}
                  {slide.cta && (
                    <a
                      href={slide.link || "#"}
                      className="group relative overflow-hidden text-xs sm:text-sm md:text-base px-6 sm:px-8 py-3 rounded-full bg-white text-black font-semibold transition-all duration-300 hover:shadow-[0_0_18px_#ffffffaa]"
                    >
                      <span className="relative z-10">{slide.cta}</span>

                      {/* Hover Fill Animation */}
                      <span className="absolute inset-0 bg-gradient-to-r from-[#ff3d3d] to-[#ff7a7a] translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
