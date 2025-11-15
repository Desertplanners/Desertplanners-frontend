import React, { useState, useEffect } from "react";
import countryData from "./countryData.json";

export default function PhoneInput({ value, onChange }) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Auto-select user country based on IP
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

  // When user types phone number
  const handlePhoneChange = (e) => {
    const phone = e.target.value.replace(/\D/g, "");
    if (selectedCountry) {
      onChange(selectedCountry.dial_code + phone);
    }
  };

  const filteredCountries = countryData.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-full">
      {/* Main input box */}
      <div className="flex items-center gap-2 border rounded-xl bg-white p-3">
        
        {/* COUNTRY FLAG + CODE section (click to open dropdown) */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => setShowDropdown(true)}
        >
          {selectedCountry && (
            <img
              src={selectedCountry.flag}
              alt="flag"
              className="w-6 h-4 object-cover rounded-sm"
            />
          )}
          <span className="font-semibold">
            {selectedCountry?.dial_code}
          </span>
          <span className="ml-1 text-gray-500">▼</span>
        </div>

        {/* PHONE Number INPUT */}
        <input
          type="text"
          placeholder="Phone Number"
          className="ml-3 w-full outline-none"
          onChange={handlePhoneChange}
        />
      </div>

      {/* DROPDOWN */}
      {showDropdown && (
        <div className="absolute z-50 top-16 left-0 w-full bg-white border shadow-xl rounded-xl max-h-72 overflow-y-auto">
          
          {/* Search */}
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search country..."
              className="w-full p-2 rounded-lg border outline-none"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Country List */}
          {filteredCountries.map((country) => (
            <div
              key={country.code2}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelectedCountry(country);
                setShowDropdown(false);
              }}
            >
              <img
                src={country.flag}
                alt={country.name}
                className="w-6 h-4 object-cover rounded-sm"
              />
              
              <span>{country.name}</span>

              <span className="ml-auto font-semibold">
                {country.dial_code}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
