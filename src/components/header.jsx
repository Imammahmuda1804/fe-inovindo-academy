"use client";

import { useState, useRef, useEffect } from "react";
import {
  FaHome,
  FaBook,
  FaUserTie,
  FaTimes,
  FaSignInAlt,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaCreditCard,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Magnet from "./magnet";
import { useRouter } from "next/navigation";

const top = {
  closed: {
    rotate: 0,
    translateY: 0,
  },
  open: {
    rotate: 45,
    translateY: 8,
  },
};

const middle = {
  closed: {
    opacity: 1,
  },
  open: {
    opacity: 0,
  },
};

const bottom = {
  closed: {
    rotate: 0,
    translateY: 0,
  },
  open: {
    rotate: -45,
    translateY: -8,
  },
};

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputMobile = useRef(null);
  const searchInputDesktop = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    }

    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      router.push(`/courses?search=${searchQuery}`);
    }
  };

  const handleOpenSearch = (isMobile = false) => {
    setSearchOpen(true);
    setSearchQuery("");
    setTimeout(() => {
      if (isMobile && searchInputMobile.current) {
        searchInputMobile.current.focus();
      } else if (!isMobile && searchInputDesktop.current) {
        searchInputDesktop.current.focus();
      }
    }, 100);
  };

  const handleCloseSearch = () => {
    setSearchOpen(false);
  };

  const handleLogout = () => {
    // TODO: Implement actual logout logic (e.g., remove token, call API)
    setIsLoggedIn(false);
    setProfileDropdownOpen(false);
    router.push("/login");
  };

  return (
    <motion.div
      initial={{ y: -120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 w-full px-2 sm:px-6 md:px-8 lg:px-16"
    >
      <header
        className={`sticky z-50 p-4 rounded-xl transition-all duration-300 ${
          isScrolled
            ? "bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg"
            : "bg-transparent border-transparent shadow-none"
        }`}
      >
        <div className="container mx-auto">
          <nav className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center justify-start md:flex-1">
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => handleOpenSearch(true)}
                  className="p-2 ml-1 text-gray-600 transition-colors rounded-full hover:text-blue-600 hover:bg-gray-100"
                >
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-gray-600 rounded-md hover:text-blue-600 focus:outline-none hover:bg-gray-100"
                >
                  <motion.svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    animate={mobileMenuOpen ? "open" : "closed"}
                    initial="closed"
                  >
                    <motion.line
                      x1="4"
                      y1="6"
                      x2="20"
                      y2="6"
                      stroke="currentColor"
                      strokeWidth="2"
                      variants={top}
                    />
                    <motion.line
                      x1="4"
                      y1="12"
                      x2="20"
                      y2="12"
                      stroke="currentColor"
                      strokeWidth="2"
                      variants={middle}
                    />
                    <motion.line
                      x1="4"
                      y1="18"
                      x2="20"
                      y2="18"
                      stroke="currentColor"
                      strokeWidth="2"
                      variants={bottom}
                    />
                  </motion.svg>
                </button>
              </div>
              <a href="/" className="hidden md:block">
                <img
                  src="/assets/images/logo.png"
                  alt="INOVINDO ACADEMY"
                  width={160}
                  height={40}
                  className="w-auto h-10"
                />
              </a>
            </div>

            {/* Center Section */}
            <div className="flex items-center justify-center flex-1 min-w-0 mx-2 md:mx-4">
              {!searchOpen && (
                <a href="/" className="flex-shrink-0 md:hidden">
                  <img
                    src="/assets/images/logo.png"
                    alt="INOVINDO ACADEMY"
                    width={160}
                    height={40}
                    className="w-auto h-10"
                  />
                </a>
              )}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{
                  width: searchOpen ? "100%" : 0,
                  opacity: searchOpen ? 1 : 0,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={`md:hidden relative h-10 flex-1 w-full`}
              >
                <div className="relative w-full h-10">
                  <input
                    ref={searchInputMobile}
                    type="text"
                    placeholder="Cari kursus..."
                    className="w-full h-full pl-10 pr-10 text-gray-700 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <Magnet padding={15} magnetStrength={3}>
                    {searchOpen && (
                      <button
                        onClick={handleCloseSearch}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 transition-colors rounded-full hover:text-blue-600 hover:bg-gray-100"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </Magnet>
                </div>
              </motion.div>

              <div className="relative items-center justify-center hidden w-full h-10 max-w-lg md:flex">
                <button
                  onClick={() => handleOpenSearch()}
                  className="p-2 text-gray-600 transition-colors rounded-full hover:text-blue-600 hover:bg-gray-100"
                >
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div
                  className={`transition-all duration-300 flex items-center justify-center space-x-8 w-full ${
                    searchOpen
                      ? "opacity-0 scale-95 invisible"
                      : "opacity-100 scale-100 visible"
                  }`}
                >
                  <Magnet padding={15} magnetStrength={2}>
                    <motion.a
                      href="/home"
                      className="flex items-center gap-2 font-medium text-gray-600 transition-colors duration-300 hover:text-blue-600"
                      whileHover={{ scale: 1.1 }}
                    >
                      <FaHome /> Beranda
                    </motion.a>
                  </Magnet>
                  <Magnet padding={15} magnetStrength={2}>
                    <motion.a
                      href="/courses"
                      className="flex items-center gap-2 font-medium text-gray-600 transition-colors duration-300 hover:text-blue-600"
                      whileHover={{ scale: 1.1 }}
                    >
                      <FaBook /> Kursus
                    </motion.a>
                  </Magnet>
                  <Magnet padding={15} magnetStrength={2}>
                    <motion.a
                      href="/mentors"
                      className="flex items-center gap-2 font-medium text-gray-600 transition-colors duration-300 hover:text-blue-600"
                      whileHover={{ scale: 1.1 }}
                    >
                      <FaUserTie /> Mentor
                    </motion.a>
                  </Magnet>
                </div>
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{
                    width: searchOpen ? "100%" : 0,
                    opacity: searchOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className={`absolute inset-0 ${
                    searchOpen ? "" : "pointer-events-none"
                  }`}
                >
                  <div className="relative w-full h-10">
                    <input
                      ref={searchInputDesktop}
                      type="text"
                      placeholder="Cari kursus..."
                      className="w-full h-full pl-10 pr-10 text-gray-700 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearch}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    {searchOpen && (
                      <button
                        onClick={handleCloseSearch}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 transition-colors rounded-full hover:text-blue-600 hover:bg-gray-100"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Section */}
            <div className="relative flex-shrink-0 md:flex-1 md:flex md:justify-end">
              {isLoggedIn ? (
                <div ref={profileDropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center justify-center w-10 h-10 text-gray-600 bg-gray-200 rounded-full hover:bg-gray-300"
                  >
                    <FaUser />
                  </button>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                    >
                      <a
                        href="/my-courses"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaBook /> My Courses
                      </a>
                      <a
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaCog /> Settings
                      </a>
                      <a
                        href="/transactions"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaCreditCard /> Transactions
                      </a>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <a
                  href="/login"
                  className="flex items-center gap-2 p-2 font-medium text-blue-600 transition-colors border border-blue-200 rounded-lg group hover:bg-blue-600 hover:text-white sm:px-4 sm:py-2"
                >
                  <FaSignInAlt className="transition-all group-hover:text-white" />
                  <span className="hidden sm:inline">Masuk</span>
                </a>
              )}
            </div>
          </nav>
          {mobileMenuOpen && (
            <div className="p-2 mt-4 bg-white rounded-lg shadow-md md:hidden">
              <motion.a
                href="/home"
                className="flex items-center gap-4 px-3 py-3 text-base text-gray-700 transition-colors duration-200 rounded-lg hover:bg-gray-100"
                whileHover={{ scale: 1.1 }}
              >
                <FaHome /> Beranda
              </motion.a>
              <motion.a
                href="/courses"
                className="flex items-center gap-4 px-3 py-3 mt-1 text-base text-gray-700 transition-colors duration-200 rounded-lg hover:bg-gray-100"
                whileHover={{ scale: 1.1 }}
              >
                <FaBook /> Kursus
              </motion.a>
              <motion.a
                href="/mentors"
                className="flex items-center gap-4 px-3 py-3 mt-1 text-base text-gray-700 transition-colors duration-200 rounded-lg hover:bg-gray-100"
                whileHover={{ scale: 1.1 }}
              >
                <FaUserTie /> Mentor
              </motion.a>
            </div>
          )}
        </div>
      </header>
    </motion.div>
  );
}
