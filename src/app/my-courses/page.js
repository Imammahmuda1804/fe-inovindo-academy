'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import "./my-course.css";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { FaCirclePlay } from "react-icons/fa6";

const courses = [
  {
    imgSrc: "/assets/images/web.png",
    title: "Membuat Aplikasi Kloning Uber",
    category: "Pengembangan",
    progress: 75,
    instructor: {
      name: "Ruben Amorim",
      imgSrc:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
    },
    buttonText: "Lanjutkan",
    progressColor: "bg-green-500",
  },
  {
    imgSrc: "/assets/images/web.png",
    title: "Fundamental JavaScript Modern",
    category: "Pengembangan",
    progress: 50,
    instructor: {
      name: "Andre Onana",
      imgSrc:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
    },
    buttonText: "Lanjutkan",
    progressColor: "bg-blue-500",
  },
  {
    imgSrc: "/assets/images/web.png",
    title: "Membangun Aplikasi dengan React",
    category: "Pengembangan",
    progress: 25,
    instructor: {
      name: "Bruno Fernandes",
      imgSrc:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
    },
    buttonText: "Lanjutkan",
    progressColor: "bg-blue-500",
  },
  {
    imgSrc: "/assets/images/ui-ux.png",
    title: "Dasar-Dasar Desain UI/UX",
    category: "Desain",
    progress: 100,
    instructor: {
      name: "Sarah Johnson",
      imgSrc:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
    },
    buttonText: "Selesai",
    progressColor: "bg-green-500",
  },
  {
    imgSrc: "/assets/images/digital-marketing.png",
    title: "Digital Marketing 101",
    category: "Pemasaran",
    progress: 0,
    instructor: {
      name: "David Lee",
      imgSrc:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
    },
    buttonText: "Mulai",
    progressColor: "bg-gray-400",
  },
  {
    imgSrc: "/assets/images/data-sience.png",
    title: "Pengantar Ilmu Data",
    category: "Data",
    progress: 10,
    instructor: {
      name: "Emily Clark",
      imgSrc:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
    },
    buttonText: "Lanjutkan",
    progressColor: "bg-blue-500",
  },
];

const CourseCard = ({ course }) => (
  <motion.div
    className="course-card group"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.05, boxShadow: "0px 15px 25px rgba(0,0,0,0.1)" }}
  >
    <div className="course-image-container">
      <Image
        src={course.imgSrc}
        alt={course.title}
        width={400}
        height={200}
        className="course-image"
      />
      <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <FaCirclePlay className="text-blue-600 w-8 h-8 transform translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
      </div>
    </div>
    <div className="flex flex-col flex-grow p-3">
      <div className="flex-grow">
        <h2 className="mb-2 text-base font-bold text-gray-800 min-h-[3rem]">{course.title}</h2>
        
        {/* Mentor Info */}
        <div className="flex items-center mb-3">
            <div className="w-6 h-6 rounded-full overflow-hidden mr-2 flex-shrink-0">
                <Image
                    src={course.instructor.imgSrc}
                    alt={course.instructor.name}
                    width={24}
                    height={24}
                    className="object-cover"
                />
            </div>
            <span className="text-gray-600 text-sm font-medium">
                {course.instructor.name}
            </span>
        </div>
      </div>
      <div>
        <div className="mb-3">
          <p className="mb-1 text-xs font-semibold text-gray-600">Progres</p>
          <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
            <motion.div
              className={`h-2 rounded-full ${course.progressColor}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${course.progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeInOut" }}
            ></motion.div>
          </div>
        </div>
        <div className="flex items-center justify-start">
          <Link href="/detail-course">
            <motion.button
              className="btn-start"
              whileHover={{
                scale: 1.1,
              }}
            >
              {course.buttonText}
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
);

const Pagination = ({ coursesPerPage, totalCourses, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalCourses / coursesPerPage); i++) {
    pageNumbers.push(i);
  }

  if (pageNumbers.length <= 1) return null;

  return (
    <nav>
      <ul className='flex justify-center items-center space-x-2'>
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`w-10 h-10 border rounded-md transition-colors ${
                currentPage === number ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-100'
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage, setCoursesPerPage] = useState(8);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) { // sm breakpoint
        setCoursesPerPage(4);
      } else {
        setCoursesPerPage(8);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = [
    { value: "All", label: "Semua Kategori" },
    { value: "Pengembangan", label: "Pengembangan" },
    { value: "Desain", label: "Desain" },
    { value: "Pemasaran", label: "Pemasaran" },
    { value: "Data", label: "Data" },
  ];

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === "All" || course.category === filterCategory)
  );

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= Math.ceil(filteredCourses.length / coursesPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1
  };

  const handleCategoryChange = (value) => {
    setFilterCategory(value);
    setCurrentPage(1); // Reset to page 1
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50 pt-28">
      <div className="sidebar">
        <Sidebar />
      </div>
      <main className="flex-grow p-4 sm:p-8 main-content flex flex-col">
        <motion.h1
          className="mb-8 text-3xl font-extrabold text-gray-900"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Kursus Saya
        </motion.h1>

        <div className="flex flex-col mb-8 space-y-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Cari kelas..."
              className="px-4 py-2 text-base border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={handleSearchChange}
            />
          </div>
          <div>
            {/* Unified Swipeable Buttons for all screen sizes */}
            <div className="w-full sm:w-auto sm:px-0">
              <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat.value}
                        onClick={() => handleCategoryChange(cat.value)}
                        className={`px-3 py-2 text-sm font-semibold rounded-full flex-shrink-0 transition-colors duration-200 ${
                            filterCategory === cat.value
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white text-gray-700 border border-gray-200'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <motion.div
          id="courses-container"
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 flex-grow"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {currentCourses.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </motion.div>

        <div className="flex justify-center mt-16 mb-8">
            <Pagination 
                coursesPerPage={coursesPerPage}
                totalCourses={filteredCourses.length}
                paginate={paginate}
                currentPage={currentPage}
            />
        </div>

      </main>
    </div>
  );
}
