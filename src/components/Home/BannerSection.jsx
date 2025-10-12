import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const slides = [
  {
    id: 1,
    title: "Discover Dubai Like Never Before",
    subtitle: "Experience luxury tours and make unforgettable memories.",
    img: "https://images.unsplash.com/flagged/photo-1559717865-a99cac1c95d8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171",
    cta: "Explore Tours",
    link: "/tours",
  },
  {
    id: 2,
    title: "Relax with Our Holiday Packages",
    subtitle: "Tailored trips for families, couples, and solo travelers.",
    img: "https://plus.unsplash.com/premium_photo-1697729914552-368899dc4757?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1112",
    cta: "See Holidays",
    link: "/holiday-packages",
  },
  {
    id: 3,
    title: "Visa Services Simplified",
    subtitle: "Get your visas quickly and travel stress-free.",
    img: "https://images.unsplash.com/photo-1546412414-8035e1776c9a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    cta: "Apply Now",
    link: "/visa-services",
  },
];

export default function Banner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);
  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] md:h-[550px] lg:h-[650px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-20" : "opacity-0 z-10"
          }`}
        >
          <img
            src={slide.img}
            alt={slide.title}
            className="w-full h-full object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/60 flex justify-center items-center">
            {/* Text Container max-width 1200px, centered horizontally */}
            <div className="max-w-[1200px] w-full px-2 sm:px-2 md:px-2 lg:px-4 text-left text-white mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
                {slide.title}
              </h2>
              <p className="text-sm sm:text-md md:text-xl mb-4 sm:mb-6 drop-shadow-md max-w-lg">
                {slide.subtitle}
              </p>
              <a
                href={slide.link}
                className="px-5 py-2 sm:px-6 sm:py-3 bg-[#e82429] hover:bg-[#721011] rounded-lg font-semibold text-white shadow-lg transition duration-300 transform hover:scale-105"
              >
                {slide.cta}
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white bg-opacity-60 hover:bg-opacity-90 p-2 rounded-full shadow-md"
      >
        <FiChevronLeft size={28} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white bg-opacity-60 hover:bg-opacity-90 p-2 rounded-full shadow-md"
      >
        <FiChevronRight size={28} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
              current === i ? "bg-[#e82429] scale-125" : "bg-white bg-opacity-50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
