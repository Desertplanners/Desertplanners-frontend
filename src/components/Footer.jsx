import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFileContract,
  FaShieldAlt,
  FaArrowRight,
  FaTimesCircle,
} from "react-icons/fa";

export default function Footer() {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Tour Packages", path: "/tours" },
    { name: "Holiday Packages", path: "/holidays" },
    { name: "Visa Services", path: "/visa" },
    { name: "Contact Us", path: "/contact-us" },
  ];

  const topDestinations = [
    { name: "Abu Dhabi City Tour", path: "/tours/abu-dhabi-city-tour" },
    { name: "Dubai City Tour", path: "/tours/dubai-city-tour" },
    { name: "Yas WaterPark With Meal", path: "/tours/yas-waterpark-with-meal" },
    { name: "Dubai Miracle Garden", path: "/tours/dubai-miracle-garden" },
    { name: "Sharjah City Tour", path: "/tours/sharjah-city-tour" },
  ];

  const socialLinks = [
    { icon: FaFacebookF, color: "bg-[#3b5998]", href: "#" },
    { icon: FaInstagram, color: "bg-gradient-to-tr from-pink-500 to-orange-400", href: "#" },
    { icon: FaTwitter, color: "bg-[#00acee]", href: "#" },
    { icon: FaLinkedinIn, color: "bg-[#0077b5]", href: "#" },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">

          {/* Brand */}
          <div className="space-y-6">
            <img
              src="/desertplannersfooter_logo.png"
              alt="Desert Planners Logo"
              className="w-32 h-16 object-contain"
            />
            <p className="text-sm leading-6 text-gray-400">
              Discover your next adventure with us! Explore the best tour packages
              and unforgettable experiences around the world.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${social.color} p-3 rounded-xl hover:scale-110 transition-all duration-300 group`}
                >
                  <social.icon className="text-white text-sm group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-[#e82429] rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-all group text-sm"
                  >
                    <FaArrowRight className="text-[#e82429] text-xs group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Destinations */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-[#e82429] rounded-full"></span>
              Top Destinations
            </h3>
            <ul className="space-y-3">
              {topDestinations.map((dest) => (
                <li key={dest.name}>
                  <Link
                    to={dest.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm hover:underline"
                  >
                    {dest.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-[#e82429] rounded-full"></span>
              Get In Touch
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <FaMapMarkerAlt className="text-[#e82429] mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
                  123 Main Street, Dubai, UAE
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <FaPhoneAlt className="text-[#e82429] group-hover:scale-110 transition-transform" />
                <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
                  +971 50 369 4525
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <FaEnvelope className="text-[#e82429] group-hover:scale-110 transition-transform" />
                <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
                  info@desertplanners.net
                </span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-[#e82429] rounded-full"></span>
              Legal
            </h3>
            <div className="space-y-3">
              <Link
                to="/terms-and-conditions"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-all group text-sm"
              >
                <FaFileContract className="text-[#e82429] text-xs group-hover:scale-110 transition-transform" />
                Terms & Conditions
              </Link>
              <Link
                to="/privacy-policy"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-all group text-sm"
              >
                <FaShieldAlt className="text-[#e82429] text-xs group-hover:scale-110 transition-transform" />
                Privacy Policy
              </Link>
              <Link
                to="/cancellation-policy"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-all group text-sm"
              >
                <FaTimesCircle className="text-[#e82429] text-xs group-hover:scale-110 transition-transform" />
                Cancellation & Refund Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Desert Planners Tourism LLC. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Designed with passion</span>
              <span className="text-[#e82429] mx-1">•</span>
              <span>by Chirag</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
