"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className="relative z-50 text-gray-800 bg-white/20 backdrop-blur-lg border-t border-white/30"
    >
      <div className="w-full px-4 pt-8 md:pt-12 sm:px-6 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-xl font-extrabold">INOVINDO ACADEMY</h3>
            <p className="mt-4 text-gray-600">
              Platform untuk belajar dan berkembang bersama para ahli terbaik.
            </p>
          </div>
          <div>
            <div className="flex items-center text-gray-600 transition-colors duration-300 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 16v-4m8-8h-4M4 12h4m10.66-5.34l-2.83-2.83M5.17 18.83l-2.83-2.83M18.83 5.17l2.83 2.83M5.17 5.17l2.83 2.83"
                />
              </svg>
              <h4 className="text-lg font-semibold">Jelajahi</h4>
            </div>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-gray-700 hover:text-black">
                  Kursus
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-black">
                  Mentor
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-black">
                  Tentang Kami
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="flex items-center text-gray-600 transition-colors duration-300 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <h4 className="text-lg font-semibold">Kategori</h4>
            </div>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-gray-500 hover:text-black">
                  Development
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-black">
                  Marketing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-black">
                  Desain
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="flex items-center text-gray-600 transition-colors duration-300 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367-2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
              <h4 className="text-lg font-semibold">Ikuti Kami</h4>
            </div>
            <div className="flex mt-4 space-x-4">
              <motion.a
                href="#"
                className="transition-transform duration-300 hover:scale-110"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <img
                  src="/assets/images/fb.png"
                  alt="Facebook"
                  width={24}
                  height={24}
                  className="brightness-0"
                />
              </motion.a>
              <motion.a
                href="#"
                className="transition-transform duration-300 hover:scale-110"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <img
                  src="/assets/images/ig.png"
                  alt="Instagram"
                  width={24}
                  height={24}
                  className="brightness-0"
                />
              </motion.a>
              <motion.a
                href="#"
                className="transition-transform duration-300 hover:scale-110"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <img
                  src="/assets/images/tw.png"
                  alt="Twitter"
                  width={24}
                  height={24}
                  className="brightness-0"
                />
              </motion.a>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 px-4 py-4 mt-6 -mx-4 text-sm text-center border-t sm:-mx-6 md:-mx-8 lg:-mx-16 sm:px-6 md:px-8 lg:px-16 border-white/30 sm:flex-row sm:justify-between sm:text-left">
          <p className="text-gray-500">
            &copy; 2025 INOVINDO ACADEMY. All Rights Reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="transition-colors text-gray-500 hover:text-black"
            >
              Kebijakan Privasi
            </a>
            <a
              href="#"
              className="transition-colors text-gray-500 hover:text-black"
            >
              Syarat & Ketentuan
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
