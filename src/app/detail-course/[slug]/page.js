"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import { motion, AnimatePresence } from "framer-motion";
import AnimatedContent from "@/components/animatedcontent.jsx";
import DetailCourseSkeleton from "@/components/DetailCourseSkeleton.jsx";
import { getCourseBySlug } from "@/lib/apiService";
import { ensureAbsoluteUrl } from "@/lib/urlHelpers";
import {
  FaCheckCircle,
  FaBook,
  FaPlayCircle,
  FaUserFriends,
  FaCode,
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
import { BiSolidCategory } from "react-icons/bi";

const DetailCoursePage = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter(); // Initialize useRouter
  const [isLoading, setIsLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({
    1: true,
    2: false,
  });
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [selectedPricingId, setSelectedPricingId] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false); // New state for navigation loading

  useEffect(() => {
    const fetchCourseData = async () => {
      setIsLoading(true);
      try {
        const data = await getCourseBySlug(resolvedParams.slug);
        if (data && data.status === "success") {
          setCourseData(data.data);
        } else {
          console.error("Failed to fetch course data:", data);
          setCourseData(null);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        setCourseData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (resolvedParams.slug) {
      fetchCourseData();
    }
  }, [resolvedParams.slug]);

  useEffect(() => {
    if (!courseData) return;

    if (courseData.has_batch && courseData.batches?.length > 0) {
      const firstAvailableBatch = courseData.batches.find(
        (b) => b.is_available && b.pricing
      );
      if (firstAvailableBatch) {
        setSelectedBatchId(firstAvailableBatch.id);
      }
    } else if (!courseData.has_batch && courseData.pricings?.length > 0) {
      setSelectedPricingId(courseData.pricings[0].id);
    }
  }, [courseData]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Normalize mentor object to support different API payload shapes
  // some APIs return mentor under `mentor`, others under `user` or `instructor`.
  // API may return mentors as an array (mentors[0].user)
  const mentor =
    courseData?.mentor ||
    courseData?.user ||
    courseData?.instructor ||
    courseData?.author ||
    courseData?.mentors?.[0]?.user ||
    courseData?.mentors?.[0] ||
    null;

  // Normalize mentor about/description field
  const mentorAbout =
    courseData?.mentors?.[0]?.about || "Belum ada deskripsi tentang mentor";

  // Compute derived totals if API doesn't provide them directly
  const totalSections = courseData?.sections?.length || 0;
  const totalMaterials =
    courseData?.sections?.reduce(
      (sum, s) => sum + (s?.contents?.length || 0),
      0
    ) || 0;

  // Tentukan harga dari batch atau opsi harga yang dipilih
  const selectedBatch =
    courseData?.batches?.find((b) => b.id === selectedBatchId) || null;
  const selectedPricing =
    courseData?.pricings?.find((p) => p.id === selectedPricingId) || null;

  const price =
    (courseData?.has_batch
      ? selectedBatch?.pricing?.price
      : selectedPricing?.price) ?? 0;

  const handleBatchChange = (event) => {
    setSelectedBatchId(Number(event.target.value));
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

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    } else {
      return null;
    }
    return `https://www.youtube.com/embed/${videoId}`;
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

  if (!courseData) {
    return <div>Course not found</div>;
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
                    {courseData.category?.name}
                  </p>
                  <h1 className="my-3 text-4xl font-extrabold text-slate-900 md:text-5xl drop-shadow-lg">
                    {courseData.name}
                  </h1>
                  <div className="inline-flex items-center gap-4 mt-6">
                    <div className="w-14 h-14 flex-shrink-0">
                      <Image
                        src={
                          ensureAbsoluteUrl(mentor?.photo_url) ||
                          "https://via.placeholder.com/56x56"
                        }
                        alt="Instructor"
                        width={56}
                        height={56}
                        className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-500">Instruktur</p>
                      <p className="text-xl font-bold text-slate-800">
                        {mentor?.name || "Nama Mentor"}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent distance={50} duration={1.1} delay={0.2}>
                <div className="mb-8 overflow-hidden rounded-2xl shadow-2xl">
                  <div className="relative pb-[56.25%] h-0">
                    {getYouTubeEmbedUrl(courseData?.video) ? (
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={getYouTubeEmbedUrl(courseData?.video)}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <Image
                        src={
                          ensureAbsoluteUrl(courseData.thumbnail_url) ||
                          "/assets/images/default-course.png"
                        }
                        alt={courseData.name || "Course Thumbnail"}
                        fill
                        className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
                        priority
                      />
                    )}
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
                      {courseData.about}
                    </p>
                  </section>

                  <hr className="border-gray-200" />

                  <section id="benefits">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                      Apa yang akan Anda pelajari
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {courseData.benefits?.map((benefit, index) => (
                        <AnimatedContent
                          key={index}
                          distance={30}
                          delay={0.1 * index}
                        >
                          <div className="p-4 transition-all duration-300 rounded-xl">
                            <div className="flex items-start gap-5">
                              <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-blue-100 text-blue-600 rounded-xl shadow-lg p-2">
                                <Image
                                  src="/assets/images/web.png"
                                  alt="Benefit Icon"
                                  width={40}
                                  height={40}
                                  className="object-contain"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-700 font-semibold text-lg">
                                  {benefit.name}
                                </p>
                                {benefit.description && (
                                  <p className="text-gray-600 text-base mt-1">
                                    {benefit.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </AnimatedContent>
                      ))}
                    </div>
                  </section>

                  <hr className="border-gray-200" />

                  <section id="syllabus">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                      Kurikulum Kursus
                    </h2>
                    <div className="space-y-4">
                      {courseData.sections
                        ?.slice()
                        .sort((a, b) => a.position - b.position)
                        .map((section, index) => (
                        <div
                          key={index}
                          className="border border-gray-200/80 bg-white rounded-xl overflow-hidden shadow-sm"
                        >
                          <button
                            onClick={() => toggleSection(index)}
                            className="w-full flex justify-between items-center p-5 hover:bg-gray-50 transition-all duration-300"
                          >
                            <span className="font-semibold text-lg text-gray-800">
                              Bab {index + 1}: {section.name}
                            </span>
                            <svg
                              className={`w-6 h-6 text-gray-600 transform transition-transform duration-300 ${
                                openSections[index] ? "rotate-180" : ""
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
                            {openSections[index] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.3,
                                  ease: "easeInOut",
                                }}
                                className="overflow-hidden"
                              >
                                <div className="p-5 bg-gray-50/80 border-t border-gray-200">
                                  {section.contents
                                    ?.slice()
                                    .sort((a, b) => a.position - b.position)
                                    .map((content, mIndex) => (
                                    <a
                                      key={mIndex}
                                      href="#"
                                      className="flex items-center p-4 space-x-4 text-gray-700 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:pl-6 hover:text-blue-600 font-medium"
                                    >
                                      <FaBook className="flex-shrink-0 w-5 h-5 text-blue-500" />
                                      <span>
                                        {mIndex + 1}. {content.name}
                                      </span>
                                    </a>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </section>

                  <hr className="border-gray-200" />

                  <section>
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                      Tentang Instruktur
                    </h2>
                    <div className="p-6 bg-white rounded-2xl shadow-lg flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                      <Image
                        src={
                          ensureAbsoluteUrl(mentor?.photo_url) ||
                          "https://via.placeholder.com/56x56"
                        }
                        alt="Mentor Profile Picture"
                        width={100}
                        height={100}
                        className="rounded-full shadow-lg object-cover border-4 border-white sm:-mt-16"
                      />
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {mentor?.name}
                        </h3>
                        <p className="text-gray-600 mt-1 mb-4">{mentorAbout}</p>
                        <div className="flex flex-col sm:flex-row justify-center sm:justify-start items-center gap-4 sm:gap-6 text-gray-600">
                          <span className="flex items-center gap-2 font-medium">
                            <FaPlayCircle className="text-blue-500" />
                            {mentor?.classes_taught_count ||
                              mentor?.total_courses ||
                              mentor?.courses_count ||
                              mentor?.statistics?.total_courses ||
                              0}{" "}
                            Kursus
                          </span>
                          <span className="flex items-center gap-2 font-medium">
                            <FaUserFriends className="text-blue-500" />
                            {mentor?.total_students_count ||
                              mentor?.total_students ||
                              mentor?.students_count ||
                              mentor?.statistics?.total_students ||
                              0}{" "}
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
                        {mentor?.job ? (
                          <li className="flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 hover:shadow-md hover:scale-105 border border-blue-200/50">
                            <FaCode />
                            {mentor.job}
                          </li>
                        ) : courseData?.mentors?.[0]?.job ? (
                          <li className="flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 hover:shadow-md hover:scale-105 border border-blue-200/50">
                            <FaCode />
                            {courseData.mentors[0].job}
                          </li>
                        ) : (
                          <li className="text-gray-500">
                            Belum ada spesialisasi
                          </li>
                        )}
                      </ul>
                    </div>
                  </section>

                  <hr className="border-gray-200" />

                  {courseData?.batches?.length > 0 ? (
                    <section id="batch-selection">
                      <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        Pilih Batch
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {courseData.batches.map((batch) => {
                          const isSelected = batch.id === selectedBatchId;
                          const isFull = batch.quota <= batch.student_count;
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const isExpired = new Date(batch.start_date) < today;
                          const isUnavailable = !batch.is_available || !batch.pricing;

                          const filledPercentage =
                            (batch.student_count / batch.quota) * 100;
                          
                          let statusLabel = null;
                          if (isExpired) {
                            statusLabel = 'Ditutup';
                          } else if (isFull) {
                            statusLabel = 'Penuh';
                          } else if (isUnavailable) {
                            statusLabel = 'Tidak Tersedia';
                          }


                          return (
                            <motion.div
                              key={batch.id}
                              onClick={() =>
                                !isFull && !batch.terdaftar && !isExpired && !isUnavailable && setSelectedBatchId(batch.id)
                              }
                              className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                                isSelected
                                  ? "border-blue-500 bg-blue-50/50 scale-105 shadow-xl"
                                  : "border-gray-200 bg-white hover:border-blue-400"
                              } ${
                                isFull || batch.terdaftar || isExpired || isUnavailable
                                  ? "cursor-not-allowed bg-gray-100 opacity-70"
                                  : ""
                              }`}
                              whileHover={{
                                scale: isSelected || isFull || batch.terdaftar || isExpired || isUnavailable ? 1.05 : 1.02,
                              }}
                            >
                              {isSelected && (
                                <div className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full p-1 shadow-lg">
                                  <FaCheckCircle size={16} />
                                </div>
                              )}
                              {batch.terdaftar && (
                                <div className="absolute top-[0.125rem] left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                  Terdaftar
                                </div>
                              )}

                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-xl font-bold text-gray-800">
                                  {batch.name}
                                </h4>
                                {statusLabel && (
                                  <span className={`text-sm font-semibold py-1 px-3 rounded-full ${statusLabel === 'Penuh' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700'}`}>
                                    {statusLabel}
                                  </span>
                                )}
                              </div>

                              <p className="text-gray-600 text-sm">
                                Mentor: {batch.mentor?.name || "N/A"}
                              </p>
                              <p className="text-gray-600 text-sm mb-3">
                                Periode:{" "}
                                {new Date(batch.start_date).toLocaleDateString(
                                  "id-ID",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}{" "}
                                -{" "}
                                {new Date(batch.end_date).toLocaleDateString(
                                  "id-ID",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </p>

                              <div className="text-2xl font-bold text-blue-600 mb-4">
                                Rp{" "}
                                {Number(batch.pricing?.price || 0).toLocaleString(
                                  "id-ID"
                                )}
                              </div>

                              {!isFull && !isExpired && !isUnavailable &&(
                                <div>
                                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                    <motion.div
                                      className="bg-blue-500 h-2.5 rounded-full"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${filledPercentage}%` }}
                                      transition={{
                                        duration: 1,
                                        ease: "easeOut",
                                      }}
                                    ></motion.div>
                                  </div>
                                  <p className="text-xs text-gray-500 text-right">
                                    {batch.student_count}/{batch.quota} terisi
                                  </p>
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </section>
                  ) : courseData.pricings?.length > 0 ? (
                    <section id="pricing-selection">
                      <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        Pilih Paket
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {courseData.pricings.map((pricing) => {
                          const isSelected =
                            pricing.id === selectedPricingId;

                          return (
                            <motion.div
                              key={pricing.id}
                              onClick={() =>
                                setSelectedPricingId(pricing.id)
                              }
                              className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                                isSelected
                                  ? "border-blue-500 bg-blue-50/50 scale-105 shadow-xl"
                                  : "border-gray-200 bg-white hover:border-blue-400"
                              }`}
                              whileHover={{
                                scale: isSelected ? 1.05 : 1.02,
                              }}
                            >
                              {isSelected && (
                                <div className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full p-1 shadow-lg">
                                  <FaCheckCircle size={16} />
                                </div>
                              )}
                              <h4 className="text-xl font-bold text-gray-800 mb-2">
                                {pricing.name}
                              </h4>
                              <div className="text-2xl font-bold text-blue-600 mb-4">
                                Rp{" "}
                                {Number(pricing.price).toLocaleString(
                                  "id-ID"
                                )}
                              </div>
                              <p className="text-gray-600 text-sm">
                                {pricing.duration > 0
                                  ? `Akses selama ${pricing.duration} hari`
                                  : "Akses Selamanya"}
                              </p>
                            </motion.div>
                          );
                        })}
                      </div>
                    </section>
                  ) : null}
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
                      {courseData.has_access ? (
                        <div className="mb-5">
                          <span className="text-lg font-semibold text-green-600">Anda sudah terdaftar di kursus ini.</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-3 mb-5">
                          <FaTag className="text-2xl text-blue-500" />
                          <span className="text-4xl font-extrabold text-gray-800">
                            Rp {Number(price)?.toLocaleString("id-ID")}
                          </span>
                        </div>
                      )}

                      {courseData.has_access ? (
                        <div className="space-y-4">
                          <motion.button
                            onClick={() => {
                              setIsNavigating(true);
                              router.push(`/materi/${courseData.slug}`);
                            }}
                            disabled={isNavigating}
                            className="w-full px-8 py-4 text-lg font-semibold text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{
                              scale: 1.05,
                              boxShadow:
                                "0px 15px 25px rgba(99, 102, 241, 0.4)",
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="flex items-center justify-center gap-3">
                              {isNavigating ? (
                                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <FaPlayCircle />
                              )}
                              <span>{isNavigating ? "Memuat..." : "Mulai Belajar"}</span>
                            </div>
                          </motion.button>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">
                              Atau ingin membeli akses lagi?
                            </p>
                            <motion.button
                                onClick={() => {
                                  setIsNavigating(true);
                                  router.push(`/payment/${resolvedParams.slug}`);
                                }}
                                disabled={isNavigating}
                                className="w-full px-6 py-3 text-base font-semibold text-blue-600 transition-all duration-300 bg-white border-2 border-blue-500 rounded-xl hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="flex items-center justify-center gap-3">
                                  {isNavigating ? (
                                    <svg className="animate-spin h-5 w-5 mr-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  ) : (
                                    <FaShoppingCart />
                                  )}
                                  <span>{isNavigating ? "Memuat..." : "Beli Batch/Paket Lain"}</span>
                                </div>
                              </motion.button>
                          </div>
                        </div>
                      ) : (
                        <motion.button
                            onClick={() => {
                              setIsNavigating(true);
                              router.push(`/payment/${resolvedParams.slug}`);
                            }}
                            disabled={isNavigating}
                            className="w-full px-8 py-4 text-lg font-semibold text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{
                              scale: 1.05,
                              boxShadow: "0px 15px 25px rgba(37, 99, 235, 0.4)",
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="flex items-center justify-center gap-3">
                              {isNavigating ? (
                                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <FaShoppingCart />
                              )}
                              <span>{isNavigating ? "Memuat..." : "Beli Kursus Ini"}</span>
                            </div>
                          </motion.button>
                      )}

                      <ul className="mt-6 space-y-3 text-gray-700">
                        {[
                          { icon: FaBookOpen, text: `${totalSections} Bagian` },
                          { icon: FaFileAlt, text: `${totalMaterials} Konten` },
                          {
                            icon: BiSolidCategory,
                            text: courseData.category?.name,
                          },
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
