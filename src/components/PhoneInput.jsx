import React, { useState, useEffect } from "react";

// ---- FULL COUNTRY LIST WITH FLAGS + CODES ----
import countryData from "./countryData.json";

export default function PhoneInput({ value, onChange }) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Auto-detect user country based on IP
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        const autoCountry = countryData.find(
          (c) => c.code2 === data.country_code
        );
        if (autoCountry) setSelectedCountry(autoCountry);
      })
      .catch(() => setSelectedCountry(countryData[0]));
  }, []);

  // Format: +971 50000000
  const handlePhoneChange = (e) => {
    const phone = e.target.value.replace(/\D/g, "");
    onChange(selectedCountry.dial_code + phone);
  };

  const filteredCountries = countryData.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 border rounded-xl bg-white p-3">
        {/* ONLY THIS PART opens dropdown */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setShowDropdown(true)}
        >
          <span className="text-xl">{selectedCountry?.flag}</span>
          <span className="font-semibold">{selectedCountry?.dial_code}</span>
          <span className="ml-1 text-gray-500">▼</span>
        </div>

        {/* PHONE INPUT — typing DOES NOT open dropdown */}
        <input
          type="text"
          placeholder="Phone Number"
          className="ml-3 w-full outline-none"
          onChange={handlePhoneChange}
        />
      </div>

      {/* COUNTRY DROPDOWN */}
      {showDropdown && (
        <div className="absolute z-50 top-16 left-0 w-full bg-white border shadow-xl rounded-xl max-h-72 overflow-y-auto">
          {/* Search box */}
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search country..."
              className="w-full p-2 rounded-lg border"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* List */}
          {filteredCountries.map((country) => (
            <div
              key={country.code2}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelectedCountry(country);
                setShowDropdown(false);
              }}
            >
              <span className="text-xl">{country.flag}</span>
              <span>{country.name}</span>
              <span className="ml-auto font-semibold">{country.dial_code}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
