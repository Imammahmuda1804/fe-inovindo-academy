"use client";

import { useState, useRef, useEffect } from "react";
import {
  FaHome,
  FaBook,
  FaTimes,
  FaSignInAlt,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaCreditCard,
  FaInfoCircle,
  FaUsers,
  FaAward,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";
import Magnet from "./magnet";
import { useRouter } from "next/navigation";
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/AuthContext";
import Loader from "./Loader";
import ensureAbsoluteUrl from "@/lib/urlHelpers";
import useDebounce from "@/hooks/useDebounce";
import { searchCourses } from "@/lib/apiService";

const top = {
  closed: { rotate: 0, translateY: 0 },
  open: { rotate: 45, translateY: 8 },
};
const middle = { closed: { opacity: 1 }, open: { opacity: 0 } };
const bottom = {
  closed: { rotate: 0, translateY: 0 },
  open: { rotate: -45, translateY: -8 },
};

export default function Header() {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const { user, isLoggedIn, isLoading, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showLogoutLoader, setShowLogoutLoader] = useState(false);

  // New states for search preview
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const searchInputMobile = useRef(null);
  const searchInputDesktop = useRef(null);
  const searchWrapperRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Effect for fetching search results
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery) {
        setIsSearching(true);
        const results = await searchCourses(debouncedSearchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    };
    performSearch();
  }, [debouncedSearchQuery]);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      router.push(`/courses?search=${searchQuery}`);
      setSearchResults([]); // Close preview on enter
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
    setSearchResults([]);
  };

  const handleLogoutClick = () => {
    setProfileDropdownOpen(false);
    openModal({
      title: "Konfirmasi Logout",
      children: "Apakah Anda yakin ingin keluar dari sesi ini?",
      onConfirm: () => {
        closeModal();
        setShowLogoutLoader(true);
        logout();
        router.push("/login");
      },
    });
  };

  const SearchPreview = () => (
    <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden z-50">
      {isSearching && (
        <div className="p-4 text-center text-gray-500">Mencari...</div>
      )}
      {!isSearching && searchResults.length === 0 && debouncedSearchQuery && (
        <div className="p-4 text-center text-gray-500">
          Tidak ada hasil ditemukan.
        </div>
      )}
      {!isSearching && searchResults.length > 0 && (
        <ul>
          {searchResults.slice(0, 5).map((course) => (
            <li key={course.id}>
              <a
                href={`/detail-course/${course.slug}`}
                className="flex items-start p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="relative w-24 h-14 rounded-md overflow-hidden mr-4 flex-shrink-0">
                  <Image
                    src={
                      ensureAbsoluteUrl(course.thumbnail) ||
                      "/assets/images/default-course.png"
                    }
                    alt={course.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-lg text-gray-800 line-clamp-1">
                    {course.name}
                  </span>
                  <span className="text-base text-gray-500">
                    {course.category?.name}
                  </span>
                  {course.price && (
                    <span className="text-base font-bold text-blue-600 mt-1">
                      Rp{course.price.toLocaleString("id-ID")}
                    </span>
                  )}
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const AuthButton = () => {
    if (isLoading) {
      return (
        <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
      );
    }
    if (isLoggedIn && user) {
      return (
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <div className="w-10 h-10 rounded-full border-2 border-gray-300 overflow-hidden relative">
              <Image
                src={ensureAbsoluteUrl(user.photo) || "/assets/images/logo.png"}
                alt={user.name}
                fill
                className="object-cover object-center"
              />
            </div>
            <span className="hidden sm:inline font-semibold">
              Halo, {user.name.split(" ")[0]}
            </span>
          </button>
          {isProfileDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[60]"
            >
              <a
                href="/my-courses"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaBook /> Kursus saya
              </a>
              <a
                href="/transactions"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaCreditCard /> Transaksi
              </a>
              <a
                href="/certificates"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaAward /> Sertifikat
              </a>
              <a
                href="/settings"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaCog /> Pengaturan
              </a>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <FaSignOutAlt /> Logout
              </button>
            </motion.div>
          )}
        </div>
      );
    }
    return (
      <a
        href="/login"
        className="flex items-center gap-2 p-2 font-medium text-blue-600 transition-colors border border-blue-200 rounded-lg group hover:bg-blue-600 hover:text-white sm:px-4 sm:py-2"
      >
        <FaSignInAlt className="transition-all group-hover:text-white" />
        <span className="hidden sm:inline">Masuk</span>
      </a>
    );
  };

  return (
    <>
      {showLogoutLoader && <Loader text="Logging out..." />}
      <motion.div
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-40 w-full px-2 sm:px-6 md:px-8 lg:px-16"
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
              <div
                className="flex items-center justify-center flex-1 min-w-0 mx-2 md:mx-4"
                ref={searchWrapperRef}
              >
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
                    {searchOpen && <SearchPreview />}
                  </div>
                </motion.div>
                <div className="relative items-center justify-center hidden w-full h-10 max-w-6xl md:flex">
                  <button
                    onClick={() => handleOpenSearch()}
                    className="p-8 text-gray-600 transition-colors rounded-full hover:text-blue-600 hover:bg-gray-100 -ml-8"
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
                    className={`transition-all duration-300 flex items-center justify-center space-x-6 w-full ${
                      searchOpen
                        ? "opacity-0 scale-95 invisible"
                        : "opacity-100 scale-100 visible"
                    }`}
                  >
                    <Magnet padding={15} magnetStrength={5}>
                      <motion.a
                        href="/home"
                        className="flex items-center gap-2 font-medium text-gray-600 transition-colors duration-300 hover:text-blue-600"
                        whileHover={{ scale: 1.1 }}
                      >
                        <FaHome /> Beranda
                      </motion.a>
                    </Magnet>
                    <Magnet padding={15} magnetStrength={5}>
                      <motion.a
                        href="/courses"
                        className="flex items-center gap-2 font-medium text-gray-600 transition-colors duration-300 hover:text-blue-600"
                        whileHover={{ scale: 1.1 }}
                      >
                        <FaBook /> Kursus
                      </motion.a>
                    </Magnet>
                    <Magnet padding={15} magnetStrength={5}>
                      <motion.a
                        href="/about"
                        className="flex items-center gap-2 font-medium text-gray-600 transition-colors duration-300 hover:text-blue-600 whitespace-nowrap"
                        whileHover={{ scale: 1.1 }}
                      >
                        <FaInfoCircle /> Tentang kami
                      </motion.a>
                    </Magnet>
                    <Magnet padding={15} magnetStrength={5}>
                      <motion.a
                        href="/community"
                        className="flex items-center gap-2 font-medium text-gray-600 transition-colors duration-300 hover:text-blue-600"
                        whileHover={{ scale: 1.1 }}
                      >
                        <FaUsers /> Komunitas
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
                      {searchOpen && <SearchPreview />}
                    </div>
                  </motion.div>
                </div>
              </div>
              <div className="relative flex-shrink-0 md:flex-1 md:flex md:justify-end">
                <AuthButton />
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
                  href="/about"
                  className="flex items-center gap-4 px-3 py-3 mt-1 text-base text-gray-700 transition-colors duration-200 rounded-lg hover:bg-gray-100 whitespace-nowrap"
                  whileHover={{ scale: 1.1 }}
                >
                  <FaInfoCircle /> Tentang kami
                </motion.a>
                <motion.a
                  href="/community"
                  className="flex items-center gap-4 px-3 py-3 mt-1 text-base text-gray-700 transition-colors duration-200 rounded-lg hover:bg-gray-100"
                  whileHover={{ scale: 1.1 }}
                >
                  <FaUsers /> Community
                </motion.a>
              </div>
            )}
          </div>
        </header>
      </motion.div>
    </>
  );
}
