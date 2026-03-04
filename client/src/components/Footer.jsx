import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import { assets } from "../assets/assets";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "Theatres", path: "/theaters" },
    { name: "My Bookings", path: "/my-bookings" },
    { name: "Favourites", path: "/favourite" },
  ];

  const genres = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Sci-Fi",
    "Romance",
    "Thriller",
    "Animation",
  ];

  const socials = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "Youtube" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-black via-[#0a0a0a] to-[#0f0f0f] border-t border-white/5">
      {/* Top gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="px-6 md:px-16 lg:px-36 pt-16 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-5">
              <img src={logo} alt="QuickShow" className="h-10" />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Your one-stop destination for booking movie tickets. Explore the
              latest movies, pick your favourite seats, and enjoy the show!
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-500 hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-5">
              Genres
            </h4>
            <ul className="space-y-3">
              {genres.map((genre) => (
                <li key={genre}>
                  <span className="text-sm text-gray-500 hover:text-primary transition-colors duration-200 cursor-pointer">
                    {genre}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Download */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-5">
              Get In Touch
            </h4>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-sm text-gray-500">
                <MapPin className="w-4 h-4 mt-0.5 text-primary/60 shrink-0" />
                <span>123 Cinema Street, Mumbai, India 400001</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <Phone className="w-4 h-4 text-primary/60 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <Mail className="w-4 h-4 text-primary/60 shrink-0" />
                <span>support@quickshow.in</span>
              </li>
            </ul>

            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Download App
            </h4>
            <div className="flex gap-3">
              <a href="#" className="transition-transform hover:scale-105">
                <img
                  src={assets.googlePlay}
                  alt="Google Play"
                  className="h-10"
                />
              </a>
              <a href="#" className="transition-transform hover:scale-105">
                <img
                  src={assets.appStore}
                  alt="App Store"
                  className="h-10"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} QuickShow. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
