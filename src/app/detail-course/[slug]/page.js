"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedContent from "@/components/animatedcontent.jsx";
import DetailCourseSkeleton from "@/components/DetailCourseSkeleton.jsx";
import api from "@/lib/apiService";
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
  const [isLoading, setIsLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({
    1: true,
    2: false,
  });

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // use axios instance from src/lib/apiService (handles baseURL and headers)
        const response = await api.get(`/courses/${resolvedParams.slug}`);
        const data = response.data;

        if (data && data.status === "success") {
          console.log("API Response Data:", data.data);
          // Log mentor data specifically
          const mentorData =
            data.data.mentor ||
            data.data.user ||
            data.data.instructor ||
            data.data.author ||
            data.data.mentors?.[0]?.user ||
            data.data.mentors?.[0];

          // Debug mentor data structure
          console.log("Full API Response:", data);
          console.log("Course Data:", data.data);
          console.log("Mentor Raw Data:", {
            mentor: data.data.mentor,
            user: data.data.user,
            instructor: data.data.instructor,
            author: data.data.author,
            mentorsArray: data.data.mentors,
            firstMentor: data.data.mentors?.[0],
            firstMentorUser: data.data.mentors?.[0]?.user,
          });
          console.log("Selected Mentor Data:", mentorData);
          console.log("Mentor Job Data:", {
            mentorJob: mentorData?.job,
            firstMentorJob: data.data.mentors?.[0]?.job,
            allMentors: data.data.mentors,
          });
          console.log("Mentor About Fields:", {
            mentorAbout: mentorData?.about,
            mentorDescription: mentorData?.description,
            mentorBio: mentorData?.bio,
            originalMentorAbout: data.data.mentor?.about,
            firstMentorAbout: data.data.mentors?.[0]?.about,
          });
          console.log("Mentor Statistics:", {
            courses: {
              total_courses: mentorData?.total_courses,
              courses_count: mentorData?.courses_count,
              count: mentorData?.count,
              statistics_courses: mentorData?.statistics?.courses,
            },
            students: {
              total_students: mentorData?.total_students,
              students_count: mentorData?.students_count,
              student_count: mentorData?.student_count,
              statistics_students: mentorData?.statistics?.students,
            },
          });

          setCourseData(data.data);
        } else {
          console.error("Failed to fetch course data", data);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [resolvedParams.slug]);

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

  // Determine price: prefer first pricing entry if available, else fallback to courseData.price
  const pricingEntry =
    courseData?.pricings && courseData.pricings.length
      ? courseData.pricings[0]
      : null;
  const price = pricingEntry?.price ?? courseData?.price ?? 0;

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
                          ensureAbsoluteUrl(mentor?.photo) ||
                          ensureAbsoluteUrl(mentor?.avatar) ||
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
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={
                        courseData.video_url ||
                        "https://www.youtube.com/embed/5JVjl5kzTRk"
                      }
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
                                {benefit.description}
                              </p>
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
                      {courseData.sections?.map((section, index) => (
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
                                  {section.contents?.map((content, mIndex) => (
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
                          ensureAbsoluteUrl(mentor?.foto) ||
                          ensureAbsoluteUrl(mentor?.avatar) ||
                          "https://via.placeholder.com/100x100"
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
                            {mentor?.total_courses ||
                              mentor?.courses_count ||
                              mentor?.statistics?.total_courses ||
                              0}{" "}
                            Kursus
                          </span>
                          <span className="flex items-center gap-2 font-medium">
                            <FaUserFriends className="text-blue-500" />
                            {mentor?.total_students ||
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
                          Rp {Number(price)?.toLocaleString("id-ID")}
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
