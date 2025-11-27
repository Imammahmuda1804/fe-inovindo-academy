"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import AnimatedContent from "@/components/animatedcontent.jsx";
import { FaSearch, FaCode, FaPalette, FaBullhorn, FaChartBar, FaList } from "react-icons/fa";
import Sidebar from "@/components/Sidebar.jsx";
import MyCoursesSkeleton from "@/components/MyCoursesSkeleton.jsx";
import { getMyCourses } from "@/lib/apiService";
import { useAuth } from "@/context/AuthContext";
import { ensureAbsoluteUrl } from "@/lib/urlHelpers";
import ProtectedRoute from "@/components/ProtectedRoute";

const courseThumbnail = (course) =>
  ensureAbsoluteUrl(course?.thumbnail) || "/assets/images/home.png";

const CourseCard = ({ course }) => {
  const today = new Date();
  const isExpired = course.access_expires_at
    ? new Date(course.access_expires_at) < today
    : false;

  const getProgressColor = (progress) => {
    if (progress === 100) return "bg-green-500";
    if (progress > 0) return "bg-blue-500";
    return "bg-gray-300";
  };

  const mentor = course?.mentors?.length > 0 ? course.mentors[0].user : null;
  const mentorName = mentor ? mentor.name : "N/A";
  const mentorPhoto = ensureAbsoluteUrl(mentor?.photo) || "https://via.placeholder.com/32";
  const thumbnail = courseThumbnail(course);

  return (
    <motion.div
      className={`flex flex-col h-full overflow-hidden text-left duration-300 border bg-white shadow-lg border-gray-200/80 rounded-2xl group relative ${isExpired ? "opacity-60 cursor-not-allowed" : ""}`}
      whileHover={!isExpired ? {
        y: -6,
        boxShadow: "0px 15px 25px rgba(0, 0, 0, 0.1)",
      } : {}}
    >
      {isExpired && (
        <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          Telah Kedaluwarsa
        </div>
      )}
      <div className={`${isExpired ? "opacity-60 pointer-events-none" : ""}`}>
        <Link href={isExpired ? `/detail-course/${course.slug}` : `/materi/${course.slug}`} passHref>
          <div className="relative overflow-hidden w-full aspect-[16/9] cursor-pointer">
            <Image
              src={thumbnail}
              alt={course.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </Link>

        <div className="p-4 flex flex-col flex-grow">
          <Link href={isExpired ? `/detail-course/${course.slug}` : `/materi/${course.slug}`} passHref>
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full self-start mb-2 cursor-pointer">
              {course.category?.name || "Uncategorized"}
            </span>
          </Link>

          <Link href={isExpired ? `/detail-course/${course.slug}` : `/materi/${course.slug}`} passHref>
            <h2 className="text-lg font-bold text-gray-800 cursor-pointer">{course.name}</h2>
          </Link>

          <div className="flex items-center mt-3">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0">
              <Image
                src={mentorPhoto}
                alt={mentorName}
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            </div>

            <span className="text-gray-600 text-sm font-medium">{mentorName}</span>
          </div>

          <div className="w-full mt-auto">
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-semibold text-gray-500">Progres</p>
                <p className={`text-xs font-bold ${getProgressColor(course.progress_percentage).replace("bg-", "text-")}`}>
                  {course.progress_percentage}%
                </p>
              </div>

              <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                <motion.div
                  className={`h-2 rounded-full ${getProgressColor(course.progress_percentage)}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${course.progress_percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                ></motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 pt-0">
        {isExpired ? (
          course.enrollment_type === 'on_demand' ? (
            <Link href={`/payment/${course.slug}`} passHref>
              <motion.button
                className="w-full mt-4 inline-flex items-center justify-center px-4 py-2.5 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Perpanjang Langganan
              </motion.button>
            </Link>
          ) : (
            <button
              disabled
              className="w-full mt-4 inline-flex items-center justify-center px-4 py-2.5 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
            >
              Batch Course Telah Berakhir
            </button>
          )
        ) : (
          course.progress_percentage < 100 && (
            <Link href={`/materi/${course.slug}`} passHref>
              <motion.button
                className="w-full mt-4 inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Lanjutkan Belajar
              </motion.button>
            </Link>
          )
        )}
      </div>
    </motion.div>
  );
};

const Pagination = ({ coursesPerPage, totalCourses, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalCourses / coursesPerPage); i++) {
    pageNumbers.push(i);
  }
  if (pageNumbers.length <= 1) return null;

  return (
    <nav>
      <ul className="flex justify-center items-center space-x-2">
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`w-10 h-10 border rounded-lg transition-colors duration-300 font-semibold ${
                currentPage === number
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default function MyCoursesPage() {
  const { isLoggedIn, isAuthLoading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (isLoggedIn) {
        try {
          setIsLoading(true);
          const myCourses = await getMyCourses();
          const coursesWithNumericProgress = myCourses.map((course) => ({
            ...course,
            progress_percentage: Number(course.progress_percentage) || 0,
          }));
          setCourses(coursesWithNumericProgress);
          setFilteredCourses(coursesWithNumericProgress);

          const categoryIcons = {
            "Web Development": FaCode,
            "UI/UX Design": FaPalette,
            "Digital Marketing": FaBullhorn,
            "Data Science": FaChartBar,
          };

          const userCategories = [
            ...new Set(myCourses.map((course) => course.category?.name)),
          ].filter(Boolean);

          const dynamicCategories = userCategories.map((catName) => {
            const category = myCourses.find(c => c.category?.name === catName)?.category;
            const iconValue = category?.icon;
            const isImagePath = iconValue && (iconValue.includes('.') || iconValue.includes('/'));

            return {
              value: catName,
              label: catName,
              icon: isImagePath ? undefined : (categoryIcons[iconValue] || FaCode),
              imageUrl: isImagePath ? ensureAbsoluteUrl(iconValue) : undefined,
            };
          });

          setCategories([
            { value: "All", label: "Semua", icon: FaList },
            ...dynamicCategories,
          ]);
        } catch (error) {
          console.error("Gagal mengambil data kursus atau kategori:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    if (!isAuthLoading) {
      fetchCourseData();
    }
  }, [isLoggedIn, isAuthLoading]);

  useEffect(() => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== "All") {
      filtered = filtered.filter(
        (course) => course.category?.name === filterCategory
      );
    }

    setFilteredCourses(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterCategory, courses]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  const paginate = (pageNumber) => {
    if (
      pageNumber > 0 &&
      pageNumber <= Math.ceil(filteredCourses.length / coursesPerPage)
    ) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <ProtectedRoute>
      {isAuthLoading || isLoading ? (
        <MyCoursesSkeleton />
      ) : (
        <div className="relative min-h-screen font-sans bg-gray-50 pt-24 px-2 sm:px-6 md:px-8 lg:px-16">
          <main className="container mx-auto py-8 pb-24 md:pb-8 relative">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              <aside className="w-full lg:w-72">
                <div className="sticky top-48">
                  <Sidebar />
                </div>
              </aside>

              <div className="flex-1">
                <AnimatedContent distance={50} direction="vertical" reverse={true}>
                  <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 drop-shadow-lg">
                      Kursus Saya
                    </h1>
                    <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                      Kelola dan lanjutkan progres belajar Anda pada kursus-kursus
                      yang telah Anda ambil.
                    </p>
                  </div>
                </AnimatedContent>

                <AnimatedContent distance={50} delay={0.2}>
                  <div className="mb-8 p-4 bg-white/60 backdrop-blur-lg border border-white/30 rounded-2xl shadow-md">
                    <div className="flex flex-col gap-4">
                      <div className="relative md:w-1/3 lg:w-2/5">
                        <input
                          type="text"
                          placeholder="Cari kelas..."
                          className="w-full pl-10 pr-4 py-2.5 text-base border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                          }}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                          <FaSearch className="text-gray-400" />
                        </div>
                      </div>
                      <div className="flex space-x-2 overflow-x-auto pb-2 -mb-2 no-scrollbar">
                        {categories.map((cat) => (
                          <button
                            key={cat.value}
                            onClick={() => {
                              setFilterCategory(cat.value);
                              setCurrentPage(1);
                            }}
                            className={`px-4 py-2.5 text-sm font-semibold rounded-full flex-shrink-0 transition-colors duration-300 flex items-center ${
                              filterCategory === cat.value
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            {cat.imageUrl ? (
                              <Image src={cat.imageUrl} alt={cat.label} width={24} height={24} className="w-6 h-6 object-cover rounded-full mr-2" />
                            ) : (
                              cat.icon && <cat.icon className="mr-2" />
                            )}
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </AnimatedContent>

                <AnimatedContent distance={50} delay={0.4}>
                  {currentCourses.length > 0 ? (
                    <div
                      id="courses-container"
                      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 isolate"
                    >
                      {currentCourses.map((course, index) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <CourseCard course={course} />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <p className="text-gray-500 text-lg">
                        Tidak ada kursus yang cocok dengan pencarian Anda.
                      </p>
                    </div>
                  )}
                </AnimatedContent>

                <div className="flex justify-center mt-16 mb-8">
                  <Pagination
                    coursesPerPage={coursesPerPage}
                    totalCourses={filteredCourses.length}
                    paginate={paginate}
                    currentPage={currentPage}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </ProtectedRoute>
  );
}