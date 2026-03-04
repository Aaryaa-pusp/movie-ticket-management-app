import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import logo from "../assets/logo.svg";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react"; // Added UserButton

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hidden, setHidden] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const { user, isSignedIn } = useUser(); // Check if user is logged in
  const { openSignIn } = useClerk(); // Fixed typo from openSignIN

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "Theaters", path: "/theaters" },
    { name: "Favourites", path: "/favourite" },
    { name: "Past Bookings", path: "/my-bookings" },
  ];

  // Hide navbar on scroll down past 50px
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 50) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/movies?search=${searchTerm}`);
      setShowSearch(false);
      setSearchTerm("");
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${hidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}>
      <div className="flex items-center justify-between px-6 md:px-16 py-4 bg-transparent relative z-50">

        {/* Logo */}
        <Link to="/" className={`${showSearch ? "hidden sm:flex" : "flex"} items-center gap-2`}>
          <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
        </Link>

        {/* Desktop Menu */}
        {!showSearch && (
          <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all
                ${location.pathname === link.path ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-300 hover:text-white"}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}

        {/* Search & Clerk Actions */}
        <div className={`flex items-center gap-4 ${showSearch ? "flex-1 justify-end" : ""}`}>
          <form
            onSubmit={handleSearchSubmit}
            className={`relative flex items-center transition-all duration-300 ${showSearch ? "w-full max-w-md ml-4" : "w-10"}`}
          >
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full bg-white/10 border border-white/20 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary transition-all ${showSearch ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
            />
            <Search
              className={`absolute left-3 w-5 h-5 cursor-pointer ${showSearch ? "text-primary" : "text-gray-400 hover:text-white"}`}
              onClick={() => setShowSearch(!showSearch)}
            />
          </form>

          {!showSearch && (
            <>
              {isSignedIn ? (
                /* 1. Show Profile Pic when logged in */
                <UserButton afterSignOutUrl="/" />
              ) : (
                /* 2. Show Login Button when logged out */
                <button
                  onClick={() => openSignIn()}
                  className="px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-full font-semibold text-sm transition-all active:scale-95"
                >
                  Login
                </button>
              )}

              <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white p-1 hover:bg-white/10 rounded-lg">
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div className={`absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden transition-all duration-300 md:hidden ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="flex flex-col p-6 gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`px-4 py-3 rounded-xl text-lg font-medium ${location.pathname === link.path ? "text-primary bg-primary/10" : "text-white"}`}
            >
              {link.name}
            </Link>
          ))}
          {/* Mobile Login if signed out */}
          {!isSignedIn && (
            <button onClick={() => openSignIn()} className="w-full py-3 bg-primary text-white rounded-xl font-bold mt-2">
              Login / Signup
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;