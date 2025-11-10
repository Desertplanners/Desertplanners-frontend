import React, { useState, useEffect } from "react";

export default function Banner() {
  const slides = [
    {
      image: "/Banner1.webp",
      subtitle: "Escape to the oasis of luxury and adventure.",
      title: "DUBAI TOUR",
      price: "AED 75",
      cta: "Explore Tours",
      link: "/tours/dubai-city-tour/dubai-city-tour",
    },
    {
      image: "/abu-dhabi.png",
      subtitle: "Experience the grandeur of the UAE’s capital.",
      title: "ABU DHABI TOUR",
      price: "AED 455",
      cta: "Explore Tours",
      link: "tours/abu-dhabi-city-tour/abu-dhabi-city-tour-with-ferrari-world",
    },
    {
      image: "/abu-dhabi2.png",
      subtitle: "Experience the grandeur of the UAE’s capital.",
      title: "ABU DHABI TOUR",
      price: "AED 455",
      cta: "Explore Tours",
      link: "tours/abu-dhabi-city-tour/abu-dhabi-city-tour-with-ferrari-world",
    },
    {
      image: "/Banner3.webp",
      subtitle: "Discover the cultural charm of Sharjah.",
      title: "DESERT SAFARI",
      price: "AED 150",
      cta: "View All Packages",
      link: "tours/desert-safari-with-dinner/desert-safari-with-bbq-dinner-by-4x4-vehicle",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full h-[350px] sm:h-[480px] md:h-[550px] lg:h-[650px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover scale-110 animate-zoom-slow"
          />

          {/* Overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/50 to-transparent"></div> */}

          {/* Text Content */}
          {index === current && (
            <div className="absolute bottom-10 sm:bottom-14 left-0 w-full">
              <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-left text-white animate-fadeInUp">
                {/* Subtitle with gradient background */}
                <p className="inline-block bg-gradient-to-r from-[#e82429]/80 to-[#ff5f5f]/80 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm md:text-base lg:text-lg font-medium tracking-wide mb-3 sm:mb-4 shadow-md border border-white/10">
                  {slide.subtitle}
                </p>

                {/* Title */}
                <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-5 leading-tight drop-shadow-2xl tracking-wide">
                  {slide.title}
                </h2>

                {/* Simple Price */}

                <p className="text-sm sm:text-lg md:text-xl font-medium mb-4 sm:mb-6">
                  <span className="text-[#e82429] font-semibold">
                    Starting from{" "}
                  </span>
                  <span className="text-[#ffffff] font-extrabold">
                    {slide.price}
                  </span>
                </p>

                {/* Button */}
                <a
                  href={slide.link}
                  className="inline-block text-xs sm:text-sm md:text-base lg:text-lg px-5 sm:px-7 md:px-8 py-2 sm:py-3 bg-gradient-to-r from-[#e82429] to-[#ff5151] hover:shadow-[0_0_20px_#e82429aa] text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  {slide.cta}
                </a>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ✨ Custom Animations */
<style>
  {`
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes zoomSlow {
  from { transform: scale(1.1); }
  to { transform: scale(1.05); }
}
.animate-fadeInUp { animation: fadeInUp 1.2s ease forwards; }
.animate-zoom-slow { animation: zoomSlow 8s ease-in-out infinite alternate; }
`}
</style>;
