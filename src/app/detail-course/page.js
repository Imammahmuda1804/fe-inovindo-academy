'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedContent from "@/components/animatedcontent.jsx";
import DetailCourseSkeleton from "@/components/DetailCourseSkeleton.jsx";
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
  FaMap,
  FaPalette,
  FaBug,
  FaTag,
  FaShoppingCart,
  FaCertificate,
} from "react-icons/fa";

const DetailCoursePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [openSections, setOpenSections] = useState({
    1: true,
    2: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSmoothScroll = (event, targetId) => {
    event.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerOffset = 120; 
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const tabs = [
    {
      id: "deskripsi",
      label: "Deskripsi",
      icon: FaFileAlt,
      targetId: "#about-course",
    },
    {
      id: "benefits",
      label: "Benefit",
      icon: FaCheckCircle,
      targetId: "#benefits",
    },
    { id: "syllabus", label: "Materi", icon: FaListAlt, targetId: "#syllabus" },
  ];

  if (isLoading) {
    return <DetailCourseSkeleton />;
  }

  return (
    <>
      <div className="relative min-h-screen font-sans bg-gray-50 pt-24 px-2 sm:px-6 md:px-8 lg:px-16">
        <main className="container mx-auto py-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Main Content Column */}
            <div className="w-full lg:w-2/3">
              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={true}
                duration={1.0}
              >
                <div className="mb-12 text-center">
                  <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase">
                    Pengembangan / Mobile Engineer
                  </p>
                  <h1 className="my-3 text-4xl font-extrabold text-slate-900 md:text-5xl drop-shadow-lg">
                    Membuat Aplikasi Kloning Uber
                  </h1>
                  <div className="inline-flex items-center gap-4 mt-6">
                    <div className="w-14 h-14 flex-shrink-0">
                      <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Justinus_Lhaksana.jpg/250px-Justinus_Lhaksana.jpg"
                        alt="Instructor"
                        width={56}
                        height={56}
                        className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-500">Instruktur</p>
                      <p className="text-xl font-bold text-slate-800">
                        Ruben Amorim
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent distance={50} duration={1.1} delay={0.2}>
                <div className="mb-8 overflow-hidden rounded-2xl shadow-2xl">
                  <div className="relative pb-[56.25%] h-0">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src="https://www.youtube.com/embed/5JVjl5kzTRk"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </AnimatedContent>

              {/* Tabs */}
              <AnimatedContent distance={50} delay={0.1}>
                <div className="flex mb-8 space-x-2 p-2 bg-white/70 backdrop-blur-lg border border-white/20 shadow-md rounded-xl">
                  {tabs.map(({ id, label, icon: Icon, targetId }) => (
                    <a
                      key={id}
                      href={targetId}
                      onClick={(e) => handleSmoothScroll(e, targetId)}
                      className="flex-1 text-center px-4 py-3 font-semibold rounded-lg transition-all duration-300 text-gray-600 hover:bg-gray-200 hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <Icon /> {label}
                    </a>
                  ))}
                </div>
              </AnimatedContent>

              {/* Single Card Container for all sections */}
              <AnimatedContent distance={30}>
                <div className="space-y-12">
                  <section id="about-course">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      Tentang Kursus
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Yue (diucapkan /juː/, seperti view) adalah kerangka kerja
                      progresif untuk membangun antarmuka pengguna. Tidak
                      seperti kerangka kerja monolitik lainnya, Yue dirancang
                      dari awal agar dapat diadaptasi secara bertahap. Pustaka
                      inti hanya berfokus pada lapisan tampilan, dan mudah untuk
                      diambil dan diintegrasikan dengan pustaka lain atau proyek
                      yang sudah ada. Di sisi lain, Yue juga sangat mampu
                      mendukung Aplikasi Halaman Tunggal yang canggih bila
                      digunakan dalam kombinasi dengan perangkat modern dan
                      pustaka pendukung.
                    </p>
                  </section>

                  <hr className="border-gray-200" />

                  <section id="benefits">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                      Apa yang akan Anda pelajari
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <AnimatedContent distance={30} delay={0.1}>
                        <div className="p-4 transition-all duration-300 rounded-xl">
                          <div className="flex items-center gap-5">
                            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-blue-100 text-blue-600 rounded-xl shadow-lg p-2">
                              <Image
                                src="/assets/images/web.png"
                                alt="Benefit Icon"
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            </div>
                            <p className="text-gray-700 font-semibold text-lg">
                              Membangun aplikasi kloning Uber yang berfungsi
                              penuh.
                            </p>
                          </div>
                        </div>
                      </AnimatedContent>
                      <AnimatedContent distance={30} delay={0.2}>
                        <div className="p-4 transition-all duration-300 rounded-xl">
                          <div className="flex items-center gap-5">
                            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-blue-100 text-blue-600 rounded-xl shadow-lg p-2">
                              <Image
                                src="/assets/images/ui-ux.png"
                                alt="Benefit Icon"
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            </div>
                            <p className="text-gray-700 font-semibold text-lg">
                              Memahami konsep-konsep inti pemrograman mobile.
                            </p>
                          </div>
                        </div>
                      </AnimatedContent>
                      <AnimatedContent distance={30} delay={0.3}>
                        <div className="p-4 transition-all duration-300 rounded-xl">
                          <div className="flex items-center gap-5">
                            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-blue-100 text-blue-600 rounded-xl shadow-lg p-2">
                              <Image
                                src="/assets/images/business.png"
                                alt="Benefit Icon"
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            </div>
                            <p className="text-gray-700 font-semibold text-lg">
                              Menguasai penggunaan API dan navigasi berbasis
                              lokasi.
                            </p>
                          </div>
                        </div>
                      </AnimatedContent>
                      <AnimatedContent distance={30} delay={0.4}>
                        <div className="p-4 transition-all duration-300 rounded-xl">
                          <div className="flex items-center gap-5">
                            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-blue-100 text-blue-600 rounded-xl shadow-lg p-2">
                              <Image
                                src="/assets/images/data-sience.png"
                                alt="Benefit Icon"
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            </div>
                            <p className="text-gray-700 font-semibold text-lg">
                              Mengintegrasikan fungsionalitas peta dan pemesanan
                              real-time.
                            </p>
                          </div>
                        </div>
                      </AnimatedContent>
                      <AnimatedContent distance={30} delay={0.5}>
                        <div className="p-4 transition-all duration-300 rounded-xl">
                          <div className="flex items-center gap-5">
                            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-blue-100 text-blue-600 rounded-xl shadow-lg p-2">
                              <Image
                                src="/assets/images/design.png"
                                alt="Benefit Icon"
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            </div>
                            <p className="text-gray-700 font-semibold text-lg">
                              Membuat antarmuka pengguna yang modern dan
                              responsif.
                            </p>
                          </div>
                        </div>
                      </AnimatedContent>
                      <AnimatedContent distance={30} delay={0.6}>
                        <div className="p-4 transition-all duration-300 rounded-xl">
                          <div className="flex items-center gap-5">
                            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-blue-100 text-blue-600 rounded-xl shadow-lg p-2">
                              <Image
                                src="/assets/images/digital-marketing.png"
                                alt="Benefit Icon"
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            </div>
                            <p className="text-gray-700 font-semibold text-lg">
                              Mengembangkan keterampilan dalam debugging dan
                              pengujian aplikasi.
                            </p>
                          </div>
                        </div>
                      </AnimatedContent>
                    </div>
                  </section>

                  <hr className="border-gray-200" />

                  <section id="syllabus">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                      Kurikulum Kursus
                    </h2>
                    <div className="space-y-4">
                      {/* Grup Materi 1 */}
                      <div className="border border-gray-200/80 bg-white rounded-xl overflow-hidden shadow-sm">
                        <button
                          onClick={() => toggleSection(1)}
                          className="w-full flex justify-between items-center p-5 hover:bg-gray-50 transition-all duration-300"
                        >
                          <span className="font-semibold text-lg text-gray-800">
                            Bab 1: Pendahuluan Desain Grafis
                          </span>
                          <svg
                            className={`w-6 h-6 text-gray-600 transform transition-transform duration-300 ${
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
                        <AnimatePresence initial={false}>
                          {openSections[1] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="p-5 bg-gray-50/80 border-t border-gray-200">
                                <a
                                  href="#"
                                  className="flex items-center p-4 space-x-4 text-gray-700 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:pl-6 hover:text-blue-600 font-medium"
                                >
                                  <FaBook className="flex-shrink-0 w-5 h-5 text-blue-500" />
                                  <span>
                                    1. Sejarah dan Perkembangan Desain
                                  </span>
                                </a>
                                <a
                                  href="#"
                                  className="flex items-center p-4 space-x-4 text-gray-700 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:pl-6 hover:text-blue-600 font-medium"
                                >
                                  <FaBook className="flex-shrink-0 w-5 h-5 text-blue-500" />
                                  <span>2. Prinsip Dasar Desain Grafis</span>
                                </a>
                                <a
                                  href="#"
                                  className="flex items-center p-4 space-x-4 text-gray-700 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:pl-6 hover:text-blue-600 font-medium"
                                >
                                  <FaBook className="flex-shrink-0 w-5 h-5 text-blue-500" />
                                  <span>3. Elemen-elemen Visual</span>
                                </a>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Grup Materi 2 */}
                      <div className="border border-gray-200/80 bg-white rounded-xl overflow-hidden shadow-sm">
                        <button
                          onClick={() => toggleSection(2)}
                          className="w-full flex justify-between items-center p-5 hover:bg-gray-50 transition-all duration-300"
                        >
                          <span className="font-semibold text-lg text-gray-800">
                            Bab 2: Software Desain
                          </span>
                          <svg
                            className={`w-6 h-6 text-gray-600 transform transition-transform duration-300 ${
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
                        <AnimatePresence initial={false}>
                          {openSections[2] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="p-5 bg-gray-50/80 border-t border-gray-200">
                                <a
                                  href="#"
                                  className="flex items-center p-4 space-x-4 text-gray-700 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:pl-6 hover:text-blue-600 font-medium"
                                >
                                  <FaBook className="flex-shrink-0 w-5 h-5 text-blue-500" />
                                  <span>4. Pengenalan Adobe Photoshop</span>
                                </a>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </section>

                  <hr className="border-gray-200" />

                  <section>
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                      Tentang Instruktur
                    </h2>
                    <div className="p-6 bg-white rounded-2xl shadow-lg flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                      <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Justinus_Lhaksana.jpg/250px-Justinus_Lhaksana.jpg"
                        alt="Mentor Profile Picture"
                        width={100}
                        height={100}
                        className="rounded-full shadow-lg object-cover border-4 border-white sm:-mt-16"
                      />
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-2xl font-bold text-gray-900">
                          Ruben Amorim
                        </h3>
                        <p className="text-gray-600 mt-1 mb-4">
                          Insinyur Mobile berpengalaman dengan lebih dari 10
                          tahun dalam pengembangan aplikasi.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center sm:justify-start items-center gap-4 sm:gap-6 text-gray-600">
                          <span className="flex items-center gap-2 font-medium">
                            <FaPlayCircle className="text-blue-500" /> 10 Kursus
                          </span>
                          <span className="flex items-center gap-2 font-medium">
                            <FaUserFriends className="text-blue-500" /> 50,000+
                            Siswa
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8">
                      <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                        Spesialisasi
                      </h4>
                      <ul className="flex flex-wrap gap-3">
                        {[
                          {
                            icon: FaCode,
                            text: "Pengembangan Aplikasi Mobile",
                          },
                          { icon: FaMobileAlt, text: "Android & iOS" },
                          { icon: FaVuejs, text: "Vue JS" },
                          { icon: FaDatabase, text: "Manajemen Database" },
                        ].map(({ icon: Icon, text }, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 hover:shadow-md hover:scale-105 border border-blue-200/50"
                          >
                            <Icon />
                            {text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>
                </div>
              </AnimatedContent>
            </div>

            {/* Sidebar Column */}
            <aside className="w-full lg:w-1/3">
              <div className="sticky top-28">
                <AnimatedContent
                  distance={50}
                  direction="horizontal"
                  delay={0.4}
                  duration={1.5}
                >
                  <div className="relative p-6 overflow-hidden border shadow-2xl bg-white/50 backdrop-blur-xl border-white/30 rounded-3xl">
                    <div className="absolute w-48 h-48 bg-green-400 rounded-full -top-16 -right-16 blur-3xl opacity-30"></div>
                    <div className="relative z-10">
                      <div className="flex items-baseline gap-3 mb-5">
                        <FaTag className="text-2xl text-blue-500" />
                        <span className="text-4xl font-extrabold text-gray-800">
                          Rp 350.000
                        </span>
                      </div>
                      <motion.button
                        className="w-full px-8 py-4 text-lg font-semibold text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 shadow-lg hover:shadow-blue-500/50"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0px 15px 25px rgba(37, 99, 235, 0.4)",
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="flex items-center justify-center gap-3">
                          <FaShoppingCart />
                          <span>Beli Kursus Ini</span>
                        </div>
                      </motion.button>

                      <ul className="mt-6 space-y-3 text-gray-700">
                        {[
                          { icon: FaBookOpen, text: "22 Bagian" },
                          { icon: FaFileAlt, text: "152 Konten" },
                          { icon: FaMobileAlt, text: "Mobile Development" },
                          { icon: FaGlobe, text: "Bahasa Indonesia" },
                          { icon: FaCertificate, text: "Sertifikat" },
                        ].map(({ icon: Icon, text }, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-4 p-3 rounded-lg transition-all duration-200 hover:bg-gray-200/50"
                          >
                            <Icon className="w-5 h-5 text-blue-500" />
                            <span className="font-medium">{text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AnimatedContent>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
};

export default DetailCoursePage;
