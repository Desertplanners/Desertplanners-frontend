import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataService from "../../config/DataService";
import { API } from "../../config/API";

export default function PopularExperiences() {
  const [experiences, setExperiences] = useState([]);
  const navigate = useNavigate();

  // ⭐ MongoDB Section ID
  const sectionId = "69181ace00b088fe8e4fce40";

  // ⭐ Fetch experiences dynamically
  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = DataService();
        const res = await api.get(API.GET_SECTION_ITEMS(sectionId));
        setExperiences(res.data || []);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      }
    };
    fetchData();
  }, []);

  const goToDetails = (path) => {
    navigate(`/${path}`);
  };

  // ⭐ No data? Return nothing
  if (!experiences.length) return null;

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#404041]">
          Top Adventure Experiences in the UAE
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 cursor-pointer flex flex-col"
              onClick={() => goToDetails(exp.link)}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={exp.img}
                  alt={exp.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute top-3 right-3 bg-[#e82429] text-white px-3 py-1 rounded-full font-semibold text-sm shadow-md">
                  AED {exp.price}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3
                    className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 hover:text-[#e82429] transition"
                    onClick={() => goToDetails(exp.link)}
                  >
                    {exp.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{exp.desc}</p>
                </div>

                <button
                  className="mt-4 py-3 rounded-lg font-semibold bg-[#e82429] text-white hover:bg-[#d01f23] transition duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToDetails(exp.link);
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
