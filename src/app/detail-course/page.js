"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Head from "next/head";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaBook,
  FaPlayCircle,
  FaUserFriends,
  FaCode,
  FaMobileAlt,
  FaVuejs,
  FaDatabase,
  FaBookOpen,
  FaFileAlt,
  FaGlobe,
  FaListAlt,
  FaMapMarkedAlt,
  FaMap,
  FaPalette,
  FaBug,
  FaTag,
  FaShoppingCart,
  FaCertificate,
} from "react-icons/fa";
import "./detail.css";

const DetailCoursePage = () => {
  const [openSections, setOpenSections] = useState({
    1: true,
    2: false,
    3: false,
    4: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <>
      <Head>
        <title>Membuat Aplikasi Kloning Uber - INOVINDO ACADEMY</title>
        <link
          rel="icon"
          type="image/png"
          href="https://inovindoacademy.com/assets/images/inovindo.png"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </Head>

      <div className="font-['Inter'] bg-slate-50 mt-20">
        <main className="course-page">
          <div className="container mt-5">
            <motion.div
              className="py-8 course-header-section md:py-12 bg-slate-100"
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative z-10 mt-4 course-details">
                <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase breadcrumbs">
                  Pengembangan / Mobile Engineer
                </p>
                <h1 className="my-3 text-4xl font-extrabold md:text-5xl text-slate-800">
                  Membuat Aplikasi Kloning Uber
                </h1>
                <div className="flex items-center gap-3 mt-4 instructor">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Justinus_Lhaksana.jpg/250px-Justinus_Lhaksana.jpg"
                    alt="Instructor"
                    width={48}
                    height={48}
                    className="object-cover w-12 h-12 border-2 border-white rounded-full shadow-md"
                  />
                  <div>
                    <p className="text-sm text-slate-600">Instruktur</p>
                    <p className="text-lg font-bold text-slate-700">
                      Ruben Amorim
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="container main-content-section">
            <div className="course-main-content">
              <motion.div
                className="video-container"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <iframe
                  src="https://www.youtube.com/embed/5JVjl5kzTRk"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </motion.div>

              <motion.div
                className="course-tabs"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <a
                  href="#about-course"
                  className="flex items-center gap-2 active"
                >
                  <FaFileAlt /> Deskripsi
                </a>
                <a href="#benefits" className="flex items-center gap-2">
                  <FaCheckCircle /> Benefit
                </a>
                <a href="#syllabus" className="flex items-center gap-2">
                  <FaListAlt /> Materi
                </a>{" "}
              </motion.div>
              <motion.section
                id="about-course"
                className="about-course"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2>Tentang Kursus</h2>
                <p>
                  Yue (diucapkan /juː/, seperti view) adalah kerangka kerja
                  progresif untuk membangun antarmuka pengguna. Tidak seperti
                  kerangka kerja monolitik lainnya, Yue dirancang dari awal agar
                  dapat diadaptasi secara bertahap. Pustaka inti hanya berfokus
                  pada lapisan tampilan, dan mudah untuk diambil dan
                  diintegrasikan dengan pustaka lain atau proyek yang sudah ada.
                  Di sisi lain, Yue juga sangat mampu mendukung Aplikasi Halaman
                  Tunggal yang canggih bila digunakan dalam kombinasi dengan
                  perangkat modern dan pustaka pendukung.
                </p>
              </motion.section>

              <motion.section
                id="benefits"
                className="course-benefits"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2>Apa yang akan Anda pelajari</h2>
                <div className="benefits-grid">
                  <div className="benefit-item">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-blue-600 bg-blue-100 rounded-full">
                      <FaMobileAlt />
                    </div>
                    <p>Membangun aplikasi kloning Uber yang berfungsi penuh.</p>
                  </div>
                  <div className="benefit-item">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-blue-600 bg-blue-100 rounded-full">
                      <FaCode />
                    </div>
                    <p>Memahami konsep-konsep inti pemrograman mobile.</p>
                  </div>
                  <div className="benefit-item">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-blue-600 bg-blue-100 rounded-full">
                      <FaMapMarkedAlt />
                    </div>
                    <p>
                      Menguasai penggunaan API dan navigasi berbasis lokasi.
                    </p>
                  </div>
                  <div className="benefit-item">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-blue-600 bg-blue-100 rounded-full">
                      <FaMap />
                    </div>
                    <p>
                      Mengintegrasikan fungsionalitas peta dan pemesanan
                      real-time.
                    </p>
                  </div>
                  <div className="benefit-item">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-blue-600 bg-blue-100 rounded-full">
                      <FaPalette />
                    </div>
                    <p>Membuat antarmuka pengguna yang modern dan responsif.</p>
                  </div>
                  <div className="benefit-item">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-blue-600 bg-blue-100 rounded-full">
                      <FaBug />
                    </div>
                    <p>
                      Mengembangkan keterampilan dalam debugging dan pengujian
                      aplikasi.
                    </p>
                  </div>
                </div>
              </motion.section>

              <motion.section
                id="syllabus"
                className="syllabus"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2>Kurikulum Kursus</h2>
                <div className="space-y-2">
                  {/* Grup Materi 1 */}
                  <div>
                    <button
                      onClick={() => toggleSection(1)}
                      className="syllabus-header"
                    >
                      <span>Bab 1: Pendahuluan Desain Grafis</span>
                      <svg
                        className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${
                          openSections[1] ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </button>
                    {openSections[1] && (
                      <div className="syllabus-content">
                        <a
                          href="#"
                          className="flex items-center p-3 space-x-3 text-sm text-gray-600 rounded-lg hover:bg-blue-50"
                        >
                          <FaBook className="flex-shrink-0 w-5 h-5 text-gray-400" />
                          <span>1. Sejarah dan Perkembangan Desain</span>
                        </a>
                        <a
                          href="#"
                          className="flex items-center p-3 space-x-3 text-sm text-gray-600 rounded-lg hover:bg-blue-50"
                        >
                          <FaBook className="flex-shrink-0 w-5 h-5 text-gray-400" />
                          <span>2. Prinsip Dasar Desain Grafis</span>
                        </a>
                        <a
                          href="#"
                          className="flex items-center p-3 space-x-3 text-sm text-gray-600 rounded-lg hover:bg-blue-50"
                        >
                          <FaBook className="flex-shrink-0 w-5 h-5 text-gray-400" />
                          <span>3. Elemen-elemen Visual</span>
                        </a>
                      </div>
                    )}
                  </div>
                  {/* Grup Materi 2 */}
                  <div className="pt-2 border-t border-gray-200">
                    <button
                      onClick={() => toggleSection(2)}
                      className="syllabus-header"
                    >
                      <span>Bab 2: Software Desain</span>
                      <svg
                        className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${
                          openSections[2] ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </button>
                    {openSections[2] && (
                      <div className="syllabus-content">
                        <a
                          href="#"
                          className="flex items-center p-3 space-x-3 text-sm text-gray-600 rounded-lg hover:bg-blue-50"
                        >
                          <FaBook className="flex-shrink-0 w-5 h-5 text-gray-400" />
                          <span>4. Pengenalan Adobe Photoshop</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.section>

              <motion.section
                className="mentor-profile"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2>Tentang Instruktur</h2>
                <div className="mentor-card">
                  <div className="mentor-info">
                    <div className="mentor-avatar">
                      <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Justinus_Lhaksana.jpg/250px-Justinus_Lhaksana.jpg"
                        alt="Mentor Profile Picture"
                        width={80}
                        height={80}
                      />
                    </div>
                    <div className="mentor-details">
                      <h3>Ruben Amorim</h3>
                      <p className="mentor-bio">
                        Insinyur Mobile berpengalaman dengan lebih dari 10 tahun
                        dalam pengembangan aplikasi.
                      </p>
                      <div className="mentor-stats">
                        <span className="flex items-center gap-2">
                          <FaPlayCircle /> 10 Kursus
                        </span>
                        <span className="flex items-center gap-2">
                          <FaUserFriends /> 50,000+ Siswa
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mentor-specialties">
                    <h4>Spesialisasi</h4>
                    <ul>
                      <li className="flex items-center gap-2">
                        <FaCode /> Pengembangan Aplikasi Mobile
                      </li>
                      <li className="flex items-center gap-2">
                        <FaMobileAlt /> Android & iOS
                      </li>
                      <li className="flex items-center gap-2">
                        <FaVuejs /> Vue JS
                      </li>
                      <li className="flex items-center gap-2">
                        <FaDatabase /> Manajemen Database
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.section>
            </div>

            <motion.aside
              className="sidebar"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="course-card">
                <div className="flex items-center gap-3 text-3xl font-bold text-slate-800">
                  <FaTag className="text-blue-500" />
                  <span>Rp 350.000</span>
                </div>
                <button className="flex items-center justify-center w-full gap-2 btn-buy">
                  <FaShoppingCart />
                  <span>Beli Kursus Ini</span>
                </button>

                <ul className="mt-6 space-y-3 text-slate-600">
                  <li className="flex items-center gap-3">
                    <FaBookOpen className="w-5 h-5 text-blue-500" />
                    <span>22 Bagian</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaFileAlt className="w-5 h-5 text-blue-500" />
                    <span>152 Konten</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaMobileAlt className="w-5 h-5 text-blue-500" />
                    <span>Mobile Development</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaGlobe className="w-5 h-5 text-blue-500" />
                    <span>Bahasa Indonesia</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCertificate className="w-5 h-5 text-blue-500" />
                    <span>Sertifikat</span>
                  </li>
                </ul>
              </div>
            </motion.aside>
          </div>
        </main>
      </div>
    </>
  );
};

export default DetailCoursePage;
