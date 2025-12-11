"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FaSearch,
  FaCode,
  FaPalette,
  FaBullhorn,
  FaChartBar,
  FaList,
  FaTag,
} from "react-icons/fa";
import { ensureAbsoluteUrl } from "@/lib/urlHelpers";
import "./courses.css";
import { useSearchParams, useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext"; // Import useLoading

const CourseCard = ({ course }) => {
  const { setIsPageLoading } = useLoading();
  // const router = useRouter(); // No longer needed for direct push
  const instructor = course.mentors?.[0]?.user;
  const instructorImage = instructor?.photo
    ? ensureAbsoluteUrl(instructor.photo)
    : "/assets/images/default-avatar.png";

  const hasAccess = !!course.has_access;

  // const handleCardClick = () => { // No longer needed
  //   router.push(`/detail-course/${course.slug}`);
  // };

  const formatCurrency = (amount) => {
    if (typeof amount !== "number" || amount < 0) return "";
    if (amount === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const displayPrice = formatCurrency(course.price);

  return (
    <motion.div
      className="flex flex-col h-full overflow-hidden text-left duration-300 bg-white border border-gray-200 shadow-lg rounded-2xl group"
      whileHover={{
        y: -5,
        boxShadow: "0px 15px 25px rgba(0, 0, 0, 0.07)",
      }}
    >
      <Link
        href={`/detail-course/${course.slug}`}
        passHref
        onClick={() => setIsPageLoading(true)}
      >
        <div className="cursor-pointer flex flex-col flex-grow">
          <div className="relative overflow-hidden w-full aspect-[16/9]">
            <Image
              src={course.thumbnail_url || "/assets/images/default-course.png"}
              alt={course.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {hasAccess && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Terdaftar
              </div>
            )}
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full self-start mb-2">
              {course.category?.name || "Uncategorized"}
            </span>
            <h2 className="text-lg font-bold text-gray-800 line-clamp-2 min-h-[3.25rem]">
              {course.name}
            </h2>
            {/* Spacer to push instructor and button/price to bottom */}
            <div className="flex-grow"></div>

            {instructor && (
              <div className="flex items-center mt-3">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0">
                  <Image
                    src={instructorImage}
                    alt={instructor.name}
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="text-gray-600 text-sm font-medium">
                  {instructor.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <div className="flex justify-end items-center">
          {hasAccess ? (
            <Link
              href={`/materi/${course.slug}`}
              passHref
              onClick={(e) => {
                e.stopPropagation();
                setIsPageLoading(true);
              }}
            >
              <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700">
                Mulai Belajar
              </button>
            </Link>
          ) : displayPrice === "Gratis" ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
              {displayPrice}
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-gray-100 text-gray-800">
              <FaTag className="mr-2 text-blue-500" />
              {displayPrice}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
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
  years,
  filterYear,
  setFilterYear,
  setCurrentPage,
  categories,
  filterCategory,
  setFilterCategory,
  sortOrder,
  setSortOrder,
  filterPrice,
  setFilterPrice,
  setIsFiltering, // Receive setIsFiltering
}) => (
  <aside className="w-full lg:w-1/4 xl:w-1/5">
    <div className="p-6 bg-white rounded-2xl shadow-md space-y-6">
      {/* Sort Order Filter */}
      <div>
        <h3 className="font-bold text-lg text-gray-800 mb-4">Urutkan</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors">
            <input
              type="checkbox"
              value="terbaru"
              checked={sortOrder === "terbaru"}
              onChange={(e) => {
                const { value } = e.target;
                setIsFiltering(true); // Start filtering
                setSortOrder((prev) => (prev === value ? null : value));
              }}
              className="appearance-none h-4 w-4 border border-gray-400 rounded-none bg-white checked:bg-[radial-gradient(circle,_theme(colors.blue.600)_40%,_transparent_45%)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span>Terbaru</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors">
            <input
              type="checkbox"
              value="terlama"
              checked={sortOrder === "terlama"}
              onChange={(e) => {
                const { value } = e.target;
                setIsFiltering(true); // Start filtering
                setSortOrder((prev) => (prev === value ? null : value));
              }}
              className="appearance-none h-4 w-4 border border-gray-400 rounded-none bg-white checked:bg-[radial-gradient(circle,_theme(colors.blue.600)_40%,_transparent_45%)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span>Terlama</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors">
            <input
              type="checkbox"
              value="harga-termahal"
              checked={sortOrder === "harga-termahal"}
              onChange={(e) => {
                const { value } = e.target;
                setIsFiltering(true); // Start filtering
                setSortOrder((prev) => (prev === value ? null : value));
              }}
              className="appearance-none h-4 w-4 border border-gray-400 rounded-none bg-white checked:bg-[radial-gradient(circle,_theme(colors.blue.600)_40%,_transparent_45%)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span>Harga Termahal</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors">
            <input
              type="checkbox"
              value="harga-termurah"
              checked={sortOrder === "harga-termurah"}
              onChange={(e) => {
                const { value } = e.target;
                setIsFiltering(true); // Start filtering
                setSortOrder((prev) => (prev === value ? null : value));
              }}
              className="appearance-none h-4 w-4 border border-gray-400 rounded-none bg-white checked:bg-[radial-gradient(circle,_theme(colors.blue.600)_40%,_transparent_45%)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span>Harga Termurah</span>
          </label>
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="font-bold text-lg text-gray-800 mb-4">Harga</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors">
            <input
              type="radio"
              name="price"
              value="all"
              checked={filterPrice === "all"}
              onChange={(e) => {
                setIsFiltering(true); // Start filtering
                setFilterPrice(e.target.value);
                setCurrentPage(1);
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span>Semua</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors">
            <input
              type="radio"
              name="price"
              value="paid"
              checked={filterPrice === "paid"}
              onChange={(e) => {
                setIsFiltering(true); // Start filtering
                setFilterPrice(e.target.value);
                setCurrentPage(1);
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span>Berbayar</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors">
            <input
              type="radio"
              name="price"
              value="free"
              checked={filterPrice === "free"}
              onChange={(e) => {
                setIsFiltering(true); // Start filtering
                setFilterPrice(e.target.value);
                setCurrentPage(1);
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span>Gratis</span>
          </label>
        </div>
      </div>

      {/* Year Filter */}
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
                  setIsFiltering(true); // Start filtering
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

      {/* Category Filter */}
      <div>
        <h3 className="font-bold text-lg text-gray-800 mb-4">Kategori</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <FilterButton
              key={cat.value}
              label={cat.label}
              value={cat.value}
              currentFilter={filterCategory}
              setFilter={setFilterCategory}
              icon={cat.icon}
              imageUrl={cat.imageUrl}
              setCurrentPage={setCurrentPage}
              setIsFiltering={setIsFiltering} // Pass setIsFiltering
            />
          ))}
        </div>
      </div>
    </div>
  </aside>
);
const ICON_MAP = {
  FaCode: FaCode,
  FaPalette: FaPalette,
  FaBullhorn: FaBullhorn,
  FaChartBar: FaChartBar,
  FaList: FaList,
};

const FilterButton = ({
  label,
  value,
  currentFilter,
  setFilter,
  icon: IconComponent,
  imageUrl,
  setCurrentPage,
  setIsFiltering, // Receive setIsFiltering
}) => (
  <button
    onClick={() => {
      setIsFiltering(true); // Start filtering
      setFilter(value);
      setCurrentPage(1);
    }}
    className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 border flex items-center gap-2 ${
      currentFilter === value
        ? "bg-blue-600 text-white border-blue-600 shadow-md"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
    }`}
  >
    {imageUrl ? (
      <Image
        src={imageUrl}
        alt={label}
        width={24}
        height={24}
        className="w-6 h-6 object-cover rounded-full"
      />
    ) : (
      IconComponent && <IconComponent className="w-6 h-6 rounded-full" />
    )}
    {label}
  </button>
);

import { getCourses } from "@/lib/apiService";
import { useAuth } from "@/context/AuthContext";

export default function CoursesPageClient({
  initialCourses,
  initialCategories,
}) {
  const searchParams = useSearchParams();
  const auth = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [allCourses, setAllCourses] = useState(initialCourses);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [allCategories, setAllCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterYear, setFilterYear] = useState([]);
  const [sortOrder, setSortOrder] = useState(null);
  const [filterPrice, setFilterPrice] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const coursesPerPage = 8;
  const [isFiltering, setIsFiltering] = useState(false);

  // Effect for fetching and setting initial data based on auth state
  useEffect(() => {
    function formatCurrency(amount) {
      if (typeof amount !== "number" || amount < 0) return "";
      if (amount === 0) return "Gratis";
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);
    }

    const fetchOrSetCourses = async () => {
      if (auth.isLoading) return; // Wait until auth check is complete

      try {
        let coursesData = initialCourses;
        if (auth.isLoggedIn) {
          // Fetch personalized data if logged in
          coursesData = await getCourses({});
        }

        setAllCourses(coursesData);
      } catch (error) {
        console.error(
          "Failed to fetch courses, falling back to initial data.",
          error
        );
        setAllCourses(initialCourses); // Fallback on error
      } finally {
        setIsLoading(false); // Signal that loading is complete
      }
    };

    fetchOrSetCourses();
  }, [auth.isLoading, auth.isLoggedIn, initialCourses]);

  // Effect for filtering and sorting, runs only when data or filters change
  useEffect(() => {
    setIsFiltering(true); // Start filtering loading state
    let filtered = allCourses;

    if (searchTerm) {
      filtered = filtered.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== "All") {
      filtered = filtered.filter(
        (course) => course.category.name === filterCategory
      );
    }

    if (filterYear.length > 0) {
      filtered = filtered.filter((course) =>
        filterYear.includes(new Date(course.created_at).getFullYear())
      );
    }

    if (filterPrice === "paid") {
      filtered = filtered.filter((course) => course.price > 0);
    } else if (filterPrice === "free") {
      filtered = filtered.filter((course) => course.price === 0);
    }

    const sorted = [...filtered];
    if (sortOrder === "terbaru") {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortOrder === "terlama") {
      sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortOrder === "harga-termahal") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "harga-termurah") {
      sorted.sort((a, b) => a.price - b.price);
    }

    setFilteredCourses(sorted);
    setFeaturedCourses(sorted.slice(0, 3));
    setCurrentPage(1);
    setIsFiltering(false); // End filtering loading state
  }, [
    searchTerm,
    filterCategory,
    filterYear,
    allCourses,
    sortOrder,
    filterPrice,
  ]);

  const activeCourse = featuredCourses[activeIndex];
  const inactiveCourses = featuredCourses.filter((_, i) => i !== activeIndex);

  const categories = [
    { value: "All", label: "Semua", icon: ICON_MAP["FaList"] },
    ...allCategories.map((cat) => {
      const isImagePath =
        cat.icon && (cat.icon.includes(".") || cat.icon.includes("/"));
      return {
        value: cat.name,
        label: cat.name,
        icon: isImagePath ? undefined : ICON_MAP[cat.icon] || FaCode,
        imageUrl: isImagePath ? ensureAbsoluteUrl(cat.icon) : undefined,
      };
    }),
  ];

  const years = [
    ...new Set(allCourses.map((c) => new Date(c.created_at).getFullYear())),
  ]
    .sort((a, b) => b - a)
    .map((year) => ({ value: year, label: year.toString() }));

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

  if (isLoading) {
    return (
      <main className="bg-gray-50 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-12 bg-gray-200 rounded-lg w-1/2 mx-auto animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-3/4 mx-auto mt-4 animate-pulse"></div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
          <div className="w-full lg:w-1/4 xl:w-1/5">
            <div className="p-6 bg-white rounded-2xl shadow-md space-y-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded-lg"></div>
                <div className="h-6 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
          <div className="w-full lg:flex-1">
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
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/4 w-[80rem] h-[40rem] bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-20 -z-0"></div>
      <div className="container mx-auto relative z-10">
        {featuredCourses.length > 0 && (
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
                    <div className="relative md:w-3/5 flex items-center justify-center bg-gray-100 rounded-l-2xl">
                      <Image
                        src={activeCourse.thumbnail_url}
                        alt={activeCourse.name}
                        width={800}
                        height={600}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    <div className="flex flex-col flex-grow p-6 md:w-2/5">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full self-start">
                        {activeCourse.category?.name}
                      </span>
                      <h2 className="text-2xl font-bold text-gray-800 mt-4">
                        {activeCourse.name}
                      </h2>
                      <p className="mt-2 text-gray-600 text-sm line-clamp-4 flex-grow">
                        {activeCourse.about}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        {activeCourse.mentors?.[0]?.user && (
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0">
                              <Image
                                src={
                                  ensureAbsoluteUrl(
                                    activeCourse.mentors[0].user.photo
                                  ) || "/assets/images/default-avatar.png"
                                }
                                alt={activeCourse.mentors[0].user.name}
                                width={32}
                                height={32}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <span className="text-gray-600 text-sm font-medium">
                              {activeCourse.mentors[0].user.name}
                            </span>
                          </div>
                        )}
                        <Link
                          href={`/detail-course/${activeCourse.slug}`}
                          onClick={() => setIsPageLoading(true)}
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
                        src={course.thumbnail_url}
                        alt={course.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="w-2/3">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {course.category?.name}
                      </span>
                      <h3 className="font-bold text-gray-800 mt-2 line-clamp-2">
                        {course.name}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-center mb-12">
          <h1
            id="jelajahi-kursus-section"
            className="text-4xl md:text-5xl font-extrabold text-slate-900 drop-shadow-lg"
          >
            Jelajahi Semua Kursus
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan kursus yang tepat untuk meningkatkan keahlian Anda.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
          <Sidebar
            years={years}
            filterYear={filterYear}
            setFilterYear={setFilterYear}
            setCurrentPage={setCurrentPage}
            categories={categories}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            filterPrice={filterPrice}
            setFilterPrice={setFilterPrice}
            setIsFiltering={setIsFiltering} // Pass setIsFiltering
          />

          <div className="w-full lg:flex-1">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="relative w-full md:w-2/5 lg:w-1/2">
                <input
                  type="text"
                  placeholder="Cari kursus..."
                  value={searchTerm}
                  className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white"
                  onChange={(e) => {
                    setIsFiltering(true); // Start filtering
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>
            </div>

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
              <div className="relative">
                {" "}
                {/* Added relative positioning for the overlay */}
                {isFiltering && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-2xl">
                    <svg
                      className="animate-spin h-8 w-8 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                )}
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
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">
                  Tidak ada kursus yang cocok dengan kriteria Anda.
                </p>
              </div>
            )}

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
