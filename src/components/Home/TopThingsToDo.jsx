import React from "react";
import { MapPin, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const thingsToDo = [
  {
    name: "Burj Khalifa Observation Deck",
    location: "Downtown Dubai",
    rating: 4.9,
    duration: "2 Hours",
    img: "https://images.unsplash.com/photo-1637751325549-5b6ccb614819?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=687",
    path: "tours/burj-khalifa/burj-khalifa-at-the-top-148-+-124th-+-125th-floor-non-prime-hours",
  },
  {
    name: "Desert Safari Adventure",
    location: "Dubai Desert",
    rating: 4.8,
    duration: "6 Hours",
    img: "https://images.unsplash.com/photo-1759731688224-c433f7bec5ab?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=687",
    path: "tours/desert-safari-with-dinner/desert-safari-with-bbq-dinner-by-4x4-vehicle",
  },
  {
    name: "Dinner Cruise at Marina",
    location: "Dubai Marina",
    rating: 4.7,
    duration: "3 Hours",
    img: "https://images.unsplash.com/photo-1733155695385-782a3ca77ae7?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1171",
    path: "tours/dhow-cruise/marina-dhow-cruise-dinner-with-transfers",
  },
  {
    name: "Dubai Miracle Garden",
    location: "Al Barsha South",
    rating: 4.6,
    duration: "6 Hours",
    img: "https://plus.unsplash.com/premium_photo-1661954483883-edd65eac3577?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170",
    path: "tours/combo-packages/miracle-garden-+-global-village-combo-ticket",
  },
  {
    name: "Helicopter Tour Dubai",
    location: "Palm Jumeirah",
    rating: 4.9,
    duration: "20 Minutes",
    img: "https://plus.unsplash.com/premium_photo-1661755648502-5d01555e7664?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1171",
    path: "",
  },
  {
    name: "Dubai Frame Visit",
    location: "Zabeel Park",
    rating: 4.8,
    duration: "1.5 Hours",
    img: "https://images.unsplash.com/photo-1628859017536-c2f1d69f3c84?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=937",
    path: "",
  },
];

export default function TopThingsToDoDubai() {
  const navigate = useNavigate();

  const goToDetails = (path) => {
    navigate(`/${path}`);
  };

  return (
    <section className="py-8 bg-[#f8fafc]">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl sm:text-4xl text-left font-bold text-[#404041] mb-3">
            Top Things to Do in Dubai
          </h2>
          <p className="text-gray-600 text-left max-w-2xl ">
            Discover Dubai’s must-do experiences — from iconic landmarks to thrilling adventures.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {thingsToDo.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-500 flex flex-col cursor-pointer"
            >
              {/* Image */}
              <div
                className="relative overflow-hidden h-56"
                onClick={() => goToDetails(item.path)}
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute top-3 left-3 bg-[#e82429] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                  Featured
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div onClick={() => goToDetails(item.path)}>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 hover:text-[#e82429] transition">
                    {item.name}
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <MapPin size={14} className="mr-1" /> {item.location}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <Clock size={14} className="mr-1" /> Duration: {item.duration}
                  </div>
                  <div className="flex items-center text-yellow-500 text-sm">
                    <Star size={14} className="mr-1" /> {item.rating} / 5.0
                  </div>
                </div>

                <button
                  className="mt-4 w-full bg-[#e82429] text-white py-2 rounded-lg font-semibold text-sm hover:bg-[#721011] transition"
                  onClick={() => goToDetails(item.path)} // ✅ Book Now also goes to details
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
