import { useState } from "react";
import { FiMenu, FiX, FiChevronDown, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    {
      title: "Tours",
      path: "/tours",
      subLinks: [
        { name: "Dubai City Tour", path: "/dubai" },
        { name: "Desert Safari", path: "/desert-safari" },
        { name: "Abu Dhabi Tour", path: "/abu-dhabi" },
        { name: "Evening Dhow Cruise", path: "/dhow-cruise" },
        { name: "Adventure Tours", path: "/adventure" },
      ],
    },
    {
      title: "Holiday Packages",
      path: "/holiday-packages",
      subLinks: [
        { name: "Dubai Getaway", path: "/dubai-package" },
        { name: "Bali Holidays", path: "/bali" },
        { name: "Maldives Escape", path: "/maldives" },
        { name: "Singapore Delight", path: "/singapore" },
        { name: "Europe Packages", path: "/europe" },
      ],
    },
    {
      title: "Visa Services",
      path: "/visa-services",
      subLinks: [
        { name: "Dubai Visa", path: "/dubai-visa" },
        { name: "Singapore Visa", path: "/singapore-visa" },
        { name: "Schengen Visa", path: "/schengen-visa" },
        { name: "UK Visa", path: "/uk-visa" },
        { name: "US Visa", path: "/us-visa" },
      ],
    },
    { title: "Contact Us", path: "/contact" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchQuery}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link to="/">
          <img src="/desertplanners_logo.png" alt="Logo" className="h-10 w-auto" />
        </Link>

        {/* Desktop Nav ≥992px */}
        <div className="hidden lg:flex items-center space-x-6">
          {navLinks.map((link, i) =>
            link.subLinks ? (
              <div key={i} className="relative group">
                <Link
                  to={link.path}
                  className="flex items-center gap-1 font-medium text-[#404041] hover:text-[#e82429] transition-colors duration-300"
                >
                  {link.title} <FiChevronDown size={16} />
                </Link>

                {/* Dropdown */}
                <div className="absolute left-0 top-full mt-2 w-60 bg-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-50">
                  <ul className="py-3">
                    {link.subLinks.map((sublink, j) => (
                      <li key={j}>
                        <Link
                          to={sublink.path}
                          className="block px-5 py-2 text-sm font-medium rounded transition-colors duration-300"
                          style={{ color: "#404041" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#e82429";
                            e.currentTarget.style.color = "#FFFFFF";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = "#404041";
                          }}
                        >
                          {sublink.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                key={i}
                to={link.path}
                className="text-[#404041] font-medium hover:text-[#e82429] transition-colors duration-300"
              >
                {link.title}
              </Link>
            )
          )}

          {/* Search Input */}
          <form onSubmit={handleSearch} className="ml-6 relative">
            <input
              type="text"
              placeholder="Search for Packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e82429] focus:border-[#e82429] transition w-64"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </form>

          {/* Contact Us Button */}
          <Link
            to="/contact"
            className="ml-4 px-6 py-2 rounded-lg font-semibold text-white transition-transform duration-300 hover:scale-105 hover:bg-[#721011] shadow-md"
            style={{ backgroundColor: "#e82429" }}
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile & Tablet Toggle <992px */}
        <button
          className="lg:hidden text-[#404041]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </div>

      {/* Mobile & Tablet Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="flex flex-col px-5 py-4 space-y-2">
            {navLinks.map((link, i) => (
              <div key={i} className="border-b border-gray-100">
                {link.subLinks ? (
                  <>
                    <div className="flex justify-between items-center">
                      <Link
                        to={link.path}
                        className="px-4 py-2 font-medium text-[#404041] rounded-md hover:bg-[#e82429] hover:text-white transition-colors duration-200 flex-1"
                      >
                        {link.title}
                      </Link>
                      <button
                        className="px-2"
                        onClick={() =>
                          setActiveDropdown(activeDropdown === i ? null : i)
                        }
                      >
                        <FiChevronDown
                          className={`transition-transform ${
                            activeDropdown === i ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                    {activeDropdown === i && (
                      <div className="bg-white">
                        {link.subLinks.map((sublink, j) => (
                          <Link
                            key={j}
                            to={sublink.path}
                            className="block px-8 py-2 text-sm font-medium text-[#404041] hover:text-white hover:bg-[#e82429] transition-colors duration-200"
                          >
                            {sublink.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.path}
                    className="block px-4 py-2 font-medium text-[#404041] rounded-md hover:bg-[#e82429] hover:text-white transition-colors duration-200"
                  >
                    {link.title}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile / Tablet Search */}
            <form onSubmit={handleSearch} className="relative mt-2">
              <input
                type="text"
                placeholder="Search for Packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e82429] focus:border-[#e82429] transition"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </form>

            {/* Mobile / Tablet Contact */}
            <Link
              to="/contact"
              className="block px-4 py-2 mt-2 rounded-md font-semibold text-white bg-[#e82429] hover:bg-[#721011] transition-transform duration-300 hover:scale-105 text-center"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
