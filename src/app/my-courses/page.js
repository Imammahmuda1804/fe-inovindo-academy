'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import AnimatedContent from "@/components/animatedcontent.jsx";
import { FaSearch, FaCode, FaPalette, FaBullhorn, FaChartBar, FaList } from "react-icons/fa";
import Sidebar from "@/components/Sidebar.jsx";
import MyCoursesSkeleton from "@/components/MyCoursesSkeleton.jsx"; // Import skeleton

const courses = [
  {
    imgSrc: "/assets/images/home.png",
    title: "Membuat Aplikasi Kloning Uber",
    category: "Pengembangan",
    progress: 75,
    instructor: {
      name: "Ruben Amorim",
      imgSrc:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
    },
  },
  {
    imgSrc: "/assets/images/home.jpg",
    title: "Fundamental JavaScript Modern",
    category: "Pengembangan",
    progress: 50,
    instructor: {
      name: "Andre Onana",
      imgSrc:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
    },
  },
  {
    imgSrc: "/assets/images/hero.png",
    title: "Membangun Aplikasi dengan React",
    category: "Pengembangan",
    progress: 25,
    instructor: {
      name: "Bruno Fernandes",
      imgSrc:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
    },
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
  },
  {
    imgSrc: "/assets/images/digital-marketing.png",
    title: "Digital Marketing 101",
    category: "Pemasaran",
    progress: 0,
    instructor: {
      name: "David Lee",
      imgSrc:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1770&auto=format&fit=crop",
    },
  },
  {
    imgSrc: "/assets/images/data-sience.png",
    title: "Pengantar Ilmu Data",
    category: "Data",
    progress: 10,
    instructor: {
      name: "Emily Clark",
      imgSrc:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop",
    },
  },
];

const CourseCard = ({ course }) => {
  const getProgressColor = (progress) => {
    if (progress === 100) return "bg-green-500";
    if (progress > 0) return "bg-blue-500";
    return "bg-gray-300";
  };

  return (
    <Link href="/detail-course" passHref>
      <motion.div
        className="flex flex-col h-full overflow-hidden text-left duration-300 border cursor-pointer bg-white shadow-lg border-gray-200/80 rounded-2xl group"
        whileHover={{
          y: -6,
          boxShadow: "0px 15px 25px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="relative overflow-hidden h-40">
          <Image
            src={course.imgSrc}
            alt={course.title}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h2 className="text-lg font-bold text-gray-800 flex-grow min-h-[3.5rem]">{course.title}</h2>
          
          <div className="flex items-center my-4">
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

          <div className="w-full mt-auto">
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-semibold text-gray-500">Progres</p>
                <p className={`text-xs font-bold ${getProgressColor(course.progress).replace('bg-', 'text-')}`}>{course.progress}%</p>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                <motion.div
                  className={`h-2 rounded-full ${getProgressColor(course.progress)}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${course.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                ></motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
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
      <ul className='flex justify-center items-center space-x-2'>
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`w-10 h-10 border rounded-lg transition-colors duration-300 font-semibold ${ 
                currentPage === number 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
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
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate fetching categories
      try {
        const categoryIcons = {
          'Pengembangan': FaCode,
          'Desain': FaPalette,
          'Pemasaran': FaBullhorn,
          'Data': FaChartBar,
        };
        // In a real app, you would fetch from an API
        // const response = await fetch('http://your-api.com/api/categories');
        // const data = await response.json();
        const hardcodedCategories = [
          { value: "All", label: "Semua", icon: FaList },
          { value: "Pengembangan", label: "Pengembangan", icon: FaCode },
          { value: "Desain", label: "Desain", icon: FaPalette },
          { value: "Pemasaran", label: "Pemasaran", icon: FaBullhorn },
          { value: "Data", label: "Data", icon: FaChartBar },
        ];
        setCategories(hardcodedCategories);
      } catch (error) {
        console.error("Gagal mengambil data kategori:", error);
        // Fallback just in case
      }

      // Simulate overall data loading time
      setTimeout(() => {
        setIsLoading(false);
      }, 1500); // Simulate 1.5 seconds loading time
    };

    fetchData();
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === "All" || course.category === filterCategory)
  );

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= Math.ceil(filteredCourses.length / coursesPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  if (isLoading) {
    return <MyCoursesSkeleton />;
  }

  return (
    <div className="relative min-h-screen font-sans bg-gray-50 pt-24 px-2 sm:px-6 md:px-8 lg:px-16">
      <main className="container mx-auto py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar Column */}
          <aside className="w-full lg:w-72">
            <div className="sticky top-48">
              <Sidebar />
            </div>
          </aside>

          {/* Main Content Column */}
          <div className="flex-1">
            <AnimatedContent distance={50} direction="vertical" reverse={true}>
              <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 drop-shadow-lg">
                  Kursus Saya
                </h1>
                <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">Kelola dan lanjutkan progres belajar Anda pada kursus-kursus yang telah Anda ambil.</p>
              </div>
            </AnimatedContent>

            <AnimatedContent distance={50} delay={0.2}>
              <div className="mb-8 p-4 bg-white/60 backdrop-blur-lg border border-white/30 rounded-2xl shadow-md">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Cari kelas..."
                      className="w-full pl-10 pr-4 py-2.5 text-base border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                  </div>
                  <div className="flex space-x-2 overflow-x-auto pb-2 -mb-2 no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat.value}
                            onClick={() => { setFilterCategory(cat.value); setCurrentPage(1); }}
                            className={`px-4 py-2.5 text-sm font-semibold rounded-full flex-shrink-0 transition-colors duration-300 flex items-center ${ 
                                filterCategory === cat.value
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            {cat.icon && <cat.icon className="mr-2" />}
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
                  className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
                >
                  {currentCourses.map((course, index) => (
                    <AnimatedContent key={index} distance={30} delay={index * 0.1}>
                      <CourseCard course={course} />
                    </AnimatedContent>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">Tidak ada kursus yang cocok dengan pencarian Anda.</p>
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
  );
}