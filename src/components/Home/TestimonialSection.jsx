import React, { useState, useEffect, useRef } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const testimonials = [
  {
    name: "John Doe",
    designation: "Travel Enthusiast",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    message:
      "Dubai was amazing! The tour was perfectly organized and every experience exceeded my expectations.",
    rating: 5,
  },
  {
    name: "Sarah Smith",
    designation: "Digital Nomad",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    message:
      "I loved exploring Dubai with this travel service. Everything was smooth and well planned!",
    rating: 4,
  },
  {
    name: "Michael Lee",
    designation: "Adventure Seeker",
    photo: "https://randomuser.me/api/portraits/men/75.jpg",
    message:
      "Fantastic service! Every attraction felt exclusive and the guidance was excellent.",
    rating: 5,
  },
  {
    name: "Emma Watson",
    designation: "Blogger",
    photo: "https://randomuser.me/api/portraits/women/65.jpg",
    message:
      "This Dubai trip was seamless! Amazing experiences and friendly support throughout.",
    rating: 4,
  },
  {
    name: "David Brown",
    designation: "Explorer",
    photo: "https://randomuser.me/api/portraits/men/81.jpg",
    message: "Loved every moment! Great itinerary and wonderful support.",
    rating: 5,
  },
];

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const carouselRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setCardsPerView(3); // Desktop
      else if (window.innerWidth >= 640) setCardsPerView(2); // Tablet
      else setCardsPerView(1); // Mobile
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? <FaStar key={i} className="text-yellow-400" /> : <FaRegStar key={i} className="text-gray-300" />);
    }
    return stars;
  };

  // Touch Handlers
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchMove = (e) => { touchEndX.current = e.touches[0].clientX; };
  const handleTouchEnd = () => {
    const delta = touchStartX.current - touchEndX.current;
    if (delta > 50) nextSlide(); 
    if (delta < -50) prevSlide(); 
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < cardsPerView; i++) {
      visible.push(testimonials[(current + i) % testimonials.length]);
    }
    return visible;
  };

  const visibleTestimonials = getVisibleTestimonials();

  const totalPages = Math.ceil(testimonials.length / cardsPerView);

  return (
    <section className="py-8 bg-gray-100">
      <div className="max-w-[1200px] mx-auto px-4 relative">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-left text-gray-800">
          What Our Travelers Say
        </h2>

        <div
          className="relative flex items-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left Button - Desktop */}
          <button
            onClick={prevSlide}
            className="hidden lg:flex absolute left-0 z-10 bg-white bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full shadow-md transition"
          >
            <FiChevronLeft size={22} />
          </button>

          {/* Cards */}
          <div className="flex gap-6 overflow-hidden w-full">
            {visibleTestimonials.map((item, idx) => (
              <div
                key={idx}
                className={`flex-shrink-0 rounded-xl shadow-lg bg-white p-6 flex flex-col items-center text-center transition-transform duration-500`}
                style={{
                  width:
                    cardsPerView === 3
                      ? "32%"
                      : cardsPerView === 2
                      ? "48%"
                      : "100%",
                }}
              >
                <img
                  src={item.photo}
                  alt={item.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#e82429]"
                />
                <div className="flex gap-1 mt-2">{renderStars(item.rating)}</div>
                <p className="text-gray-700 mt-3">{item.message}</p>
                <h3 className="font-semibold text-gray-800 mt-3">{item.name}</h3>
                <span className="text-sm text-gray-500">{item.designation}</span>
              </div>
            ))}
          </div>

          {/* Right Button - Desktop */}
          <button
            onClick={nextSlide}
            className="hidden lg:flex absolute right-0 z-10 bg-white bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full shadow-md transition"
          >
            <FiChevronRight size={22} />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-6 gap-2 lg:hidden">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx * cardsPerView)}
              className={`w-3 h-3 rounded-full transition ${
                idx === Math.floor(current / cardsPerView)
                  ? "bg-[#e82429]"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
