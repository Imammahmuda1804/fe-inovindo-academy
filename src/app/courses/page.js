"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FaSearch,
  FaCode,
  FaPalette,
  FaBullhorn,
  FaChartBar,
  FaList,
} from "react-icons/fa";
import AnimatedContent from "@/components/animatedcontent";
import "./courses.css";

// TODO: Ganti data ini dengan data dari API
const coursesData = [
  {
    id: 1,
    title: "Web Development Bootcamp",
    category: "Pengembangan",
    level: "Pemula",
    year: 2023,
    description:
      "Belajar HTML, CSS, Javascript, React, Node.js dan banyak lagi untuk menjadi Web Developer handal.",
    price: "199.900",
    rating: 4.8,
    imgSrc:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "Jane Cooper",
      imgSrc:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    },
  },
  {
    id: 2,
    title: "Digital Marketing Masterclass",
    category: "Pemasaran",
    level: "Semua Level",
    year: 2023,
    description:
      "Kuasai SEO, social media marketing, dan Google Ads untuk meningkatkan karir digital marketing Anda.",
    price: "129.900",
    rating: 4.7,
    imgSrc:
      "https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "Robert Fox",
      imgSrc:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    },
  },
  {
    id: 3,
    title: "Data Science with Python",
    category: "Data",
    level: "Menengah",
    year: 2024,
    description:
      "Analisis data, visualisasi, dan machine learning menggunakan Python, Pandas, dan Scikit-learn.",
    price: "249.900",
    rating: 4.9,
    imgSrc:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "Jenny Wilson",
      imgSrc:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
    },
  },
  {
    id: 4,
    title: "Beginners Guide to Design",
    category: "Desain",
    level: "Pemula",
    year: 2024,
    description:
      "Pelajari prinsip-prinsip dasar desain grafis dan UI/UX untuk memulai karir sebagai desainer.",
    price: "149.900",
    rating: 4.6,
    imgSrc:
      "https://media.geeksforgeeks.org/wp-content/uploads/20240625170311/Figma-tutorial.webp",
    instructor: {
      name: "Ronald Richards",
      imgSrc:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop",
    },
  },
  {
    id: 5,
    title: "Advanced React & State Management",
    category: "Pengembangan",
    level: "Mahir",
    year: 2024,
    description:
      "Dalam-dalam tentang React Hooks, Context API, dan Redux untuk aplikasi skala besar.",
    price: "299.900",
    rating: 4.9,
    imgSrc:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "Andre Onana",
      imgSrc:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    },
  },
  {
    id: 6,
    title: "UI/UX Design with Figma",
    category: "Desain",
    level: "Semua Level",
    year: 2023,
    description:
      "Dari wireframe hingga prototipe interaktif, kuasai Figma untuk desain aplikasi modern.",
    price: "179.900",
    rating: 4.7,
    imgSrc: "/assets/images/ui-ux.png",
    instructor: {
      name: "Sarah Johnson",
      imgSrc:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    },
  },
  {
    id: 7,
    title: "Content Marketing Strategy",
    category: "Pemasaran",
    level: "Menengah",
    year: 2023,
    description:
      "Bangun strategi konten yang efektif untuk menarik dan mempertahankan audiens.",
    price: "159.900",
    rating: 4.8,
    imgSrc: "/assets/images/digital-marketing.png",
    instructor: {
      name: "David Lee",
      imgSrc:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&auto=format&fit=crop",
    },
  },
  {
    id: 8,
    title: "Machine Learning A-Z",
    category: "Data",
    level: "Mahir",
    year: 2024,
    description:
      "Pelajari model-model machine learning dari regresi hingga deep learning.",
    price: "349.900",
    rating: 4.9,
    imgSrc: "/assets/images/data-sience.png",
    instructor: {
      name: "Emily Clark",
      imgSrc:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    },
  },
];

const CourseCard = ({ course }) => (
  <Link href={`/detail-course/${course.id}`} passHref>
    <motion.div
      className="flex flex-col h-full overflow-hidden text-left duration-300 bg-white border border-gray-200 shadow-lg cursor-pointer rounded-2xl group"
      whileHover={{
        y: -5,
        boxShadow: "0px 15px 25px rgba(0, 0, 0, 0.07)",
      }}
    >
      <div className="relative overflow-hidden w-full aspect-[16/9]">
        <Image
          src={course.imgSrc}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full self-start mb-2">
          {course.category}
        </span>
        <h2 className="text-lg font-bold text-gray-800">{course.title}</h2>

        <div className="flex items-center mt-3">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0">
            <Image
              src={course.instructor.imgSrc}
              alt={course.instructor.name}
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="text-gray-600 text-sm font-medium">
            {course.instructor.name}
          </span>
        </div>

        <div className="flex justify-end items-center mt-auto">
          <span className="text-xl font-extrabold text-gray-900">
            Rp{course.price}
          </span>
        </div>
      </div>
    </motion.div>
  </Link>
);

const Pagination = ({
  coursesPerPage,
  totalCourses,
  paginate,
  currentPage,
}) => {
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

const Sidebar = ({
  levels,
  filterLevel,
  setFilterLevel,
  years,
  filterYear,
  setFilterYear,
  sortOptions,
  sortBy,
  setSortBy,
  setCurrentPage,
}) => (
  <aside className="w-full lg:w-1/4 xl:w-1/5">
    <div className="p-6 bg-white rounded-2xl shadow-md space-y-6">
      <div>
        <h3 className="font-bold text-lg text-gray-800 mb-4">Urutkan</h3>
        <div className="space-y-3">
          {sortOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center space-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors"
            >
              <input
                type="radio"
                name="sort"
                value={opt.value}
                checked={sortBy === opt.value}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                onClick={(e) => {
                  if (sortBy === e.target.value) {
                    setSortBy("default");
                    setCurrentPage(1);
                  }
                }}
                className="appearance-none h-4 w-4 border border-gray-400 rounded-none bg-white checked:bg-[radial-gradient(circle,_theme(colors.blue.600)_40%,_transparent_45%)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-lg text-gray-800 mb-4">Level</h3>
        <div className="space-y-3">
          {levels.map((lvl) => (
            <label
              key={lvl.value}
              className="flex items-center space-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors"
            >
              <input
                type="checkbox"
                name="level"
                value={lvl.value}
                checked={filterLevel.includes(lvl.value)}
                onChange={(e) => {
                  const { value, checked } = e.target;
                  const newValues = checked
                    ? [...filterLevel, value]
                    : filterLevel.filter((item) => item !== value);
                  setFilterLevel(newValues);
                  setCurrentPage(1);
                }}
                className="appearance-none h-4 w-4 border border-gray-400 rounded-none bg-white checked:bg-[radial-gradient(circle,_theme(colors.blue.600)_40%,_transparent_45%)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span>{lvl.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-lg text-gray-800 mb-4">Tahun</h3>
        <div className="space-y-3">
          {years.map((year) => (
            <label
              key={year.value}
              className="flex items-center space-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors"
            >
              <input
                type="checkbox"
                name="year"
                value={year.value}
                checked={filterYear.includes(year.value)}
                onChange={(e) => {
                  const { value, checked } = e.target;
                  const numValue = parseInt(value, 10);
                  const newValues = checked
                    ? [...filterYear, numValue]
                    : filterYear.filter((item) => item !== numValue);
                  setFilterYear(newValues);
                  setCurrentPage(1);
                }}
                className="appearance-none h-4 w-4 border border-gray-400 rounded-none bg-white checked:bg-[radial-gradient(circle,_theme(colors.blue.600)_40%,_transparent_45%)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span>{year.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  </aside>
);

export default function CoursesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterLevel, setFilterLevel] = useState([]);
  const [filterYear, setFilterYear] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;

  const featuredCourses = coursesData.slice(0, 3);
  const otherCourses = coursesData.slice(3);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeCourse = featuredCourses[activeIndex];
  const inactiveCourses = featuredCourses.filter((_, i) => i !== activeIndex);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    { value: "All", label: "Semua", icon: FaList },
    { value: "Pengembangan", label: "Pengembangan", icon: FaCode },
    { value: "Desain", label: "Desain", icon: FaPalette },
    { value: "Pemasaran", label: "Pemasaran", icon: FaBullhorn },
    { value: "Data", label: "Data", icon: FaChartBar },
  ];

  const levels = [
    { value: "Pemula", label: "Pemula" },
    { value: "Menengah", label: "Menengah" },
    { value: "Mahir", label: "Mahir" },
  ];

  const years = [...new Set(coursesData.map((c) => c.year))]
    .sort((a, b) => b - a)
    .map((year) => ({ value: year, label: year.toString() }));

  const sortOptions = [
    { value: "price-asc", label: "Harga: Terendah" },
    { value: "price-desc", label: "Harga: Tertinggi" },
  ];

  const filteredCourses = otherCourses
    .filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterCategory === "All" || course.category === filterCategory) &&
        (filterLevel.length === 0 || filterLevel.includes(course.level)) &&
        (filterYear.length === 0 || filterYear.includes(course.year))
    )
    .sort((a, b) => {
      if (sortBy === "default") {
        return 0;
      }
      switch (sortBy) {
        case "price-asc":
          return (
            parseFloat(a.price.replace(".", "")) -
            parseFloat(b.price.replace(".", ""))
          );
        case "price-desc":
          return (
            parseFloat(b.price.replace(".", "")) -
            parseFloat(a.price.replace(".", ""))
          );
        default:
          return 0;
      }
    });

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

  const FilterButton = ({ label, value, currentFilter, setFilter }) => (
    <button
      onClick={() => {
        setFilter(value);
        setCurrentPage(1);
      }}
      className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 border ${
        currentFilter === value
          ? "bg-blue-600 text-white border-blue-600 shadow-md"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
      }`}
    >
      {label}
    </button>
  );

  return (
    <main className="bg-gray-50 pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/4 w-[80rem] h-[40rem] bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-20 -z-0"></div>
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative md:w-1/2">
                    <div className="w-full aspect-[16/9]">
                      <Image
                        src={activeCourse.imgSrc}
                        alt={activeCourse.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col flex-grow p-6">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full self-start">
                      {activeCourse.category}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-800 mt-4">
                      {activeCourse.title}
                    </h2>
                    <p className="mt-2 text-gray-600 text-sm line-clamp-4 flex-grow">
                      {activeCourse.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-2xl font-extrabold text-gray-900">
                        Rp{activeCourse.price}
                      </span>
                      <Link
                        href={`/detail-course/${activeCourse.id}`}
                        className="px-5 py-2.5 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                      >
                        View Course
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-4">
            {inactiveCourses.map((course) => {
              const courseIndex = featuredCourses.findIndex(
                (c) => c.id === course.id
              );
              return (
                <div
                  key={course.id}
                  className="flex flex-row items-center gap-4 p-3 rounded-2xl border bg-white shadow-sm cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setActiveIndex(courseIndex)}
                >
                  <div className="relative w-1/3 aspect-[16/9] rounded-lg overflow-hidden">
                    <Image
                      src={course.imgSrc}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="w-2/3">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {course.category}
                    </span>
                    <h3 className="font-bold text-gray-800 mt-2 line-clamp-2">
                      {course.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 drop-shadow-lg">
            Jelajahi Semua Kursus
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan kursus yang tepat untuk meningkatkan keahlian Anda.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
          <Sidebar
            levels={levels}
            filterLevel={filterLevel}
            setFilterLevel={setFilterLevel}
            years={years}
            filterYear={filterYear}
            setFilterYear={setFilterYear}
            sortOptions={sortOptions}
            sortBy={sortBy}
            setSortBy={setSortBy}
            setCurrentPage={setCurrentPage}
          />

          <div className="w-full lg:flex-1">
            {/* Search and Category Controls */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="relative md:w-1/3 lg:w-2/5">
                <input
                  type="text"
                  placeholder="Cari kursus..."
                  className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white"
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end">
                <span className="font-semibold text-gray-800 text-sm hidden sm:block">
                  Kategori:
                </span>
                {categories.map((cat) => (
                  <FilterButton
                    key={cat.value}
                    label={cat.label}
                    value={cat.value}
                    currentFilter={filterCategory}
                    setFilter={setFilterCategory}
                  />
                ))}
              </div>
            </div>

            {/* Courses Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow-lg p-5 animate-pulse"
                  >
                    <div className="h-44 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : currentCourses.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
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
              </motion.div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">
                  Tidak ada kursus yang cocok dengan kriteria Anda.
                </p>
              </div>
            )}

            {/* Pagination */}
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
      </div>
    </main>
  );
}
