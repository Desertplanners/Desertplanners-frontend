import React, { useState, useEffect } from "react";
import countryData from "./countryData.json";

export default function PhoneInput({ value, onChange }) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [localPhone, setLocalPhone] = useState("");

  // Auto-select country using IP
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        const autoCountry = countryData.find(
          (c) => c.code2 === data.country_code
        );
        if (autoCountry) {
          setSelectedCountry(autoCountry);
        } else {
          setSelectedCountry(countryData[0]);
        }
      })
      .catch(() => setSelectedCountry(countryData[0]));
  }, []);

  // If parent sends a default full phone (value prop)
  useEffect(() => {
    if (!value || !selectedCountry) return;

    const dial = selectedCountry.dial_code;

    if (value.startsWith(dial)) {
      setLocalPhone(value.replace(dial, ""));
    }
  }, [value, selectedCountry]);

  const handlePhoneChange = (e) => {
    const phone = e.target.value.replace(/\D/g, "");
    setLocalPhone(phone);

    if (selectedCountry) {
      onChange(
        selectedCountry.dial_code + phone,
        {
          countryCallingCode: selectedCountry.dial_code.replace("+", ""),
          countryCode: selectedCountry.code2,
        }
      );
    }
  };

  const filteredCountries = countryData.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-full">

      {/* Main input */}
      <div className="flex items-center gap-2 border rounded-xl bg-white p-3">

        {/* Country select */}
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

          <span className="font-semibold">{selectedCountry?.dial_code}</span>
          <span className="ml-1 text-gray-500">▼</span>
        </div>

        {/* Phone Number input */}
        <input
          type="text"
          placeholder="Phone Number"
          className="ml-3 w-full outline-none"
          value={localPhone}
          onChange={handlePhoneChange}
        />
      </div>

      {/* Dropdown */}
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

                // Reset full phone with new dial code
                onChange(country.dial_code + localPhone, {
                  countryCallingCode: country.dial_code.replace("+", ""),
                  countryCode: country.code2,
                });
              }}
            >
              <img
                src={country.flag}
                alt={country.name}
                className="w-6 h-4 object-cover rounded-sm"
              />

              <span>{country.name}</span>

              <span className="ml-auto font-semibold">{country.dial_code}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
