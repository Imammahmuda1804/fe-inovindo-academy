"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Swiper } from "swiper";
import { Autoplay, Mousewheel, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import AnimatedContent from "@/components/animatedcontent.jsx";
import SplitText from "@/components/splittext.jsx";
import TextType from "@/components/texttype";
import Magnet from "@/components/magnet.jsx";
import CountUp from "@/components/countup";
import { getStats } from "@/lib/apiService";
import api from "@/lib/apiService";

const scrollAnimateVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const categories = [
  {
    icon: "/assets/images/web.png",
    title: "Web Development",
    courses: "11 Courses",
  },
  {
    icon: "/assets/images/data-sience.png",
    title: "Data Science",
    courses: "12 Courses",
  },
  {
    icon: "/assets/images/digital-marketing.png",
    title: "Digital Marketing",
    courses: "12 Courses",
  },
  {
    icon: "/assets/images/ui-ux.png",
    title: "UI/UX Design",
    courses: "14 Courses",
  },
  {
    icon: "/assets/images/business.png",
    title: "Business",
    courses: "25 Courses",
  },
  {
    icon: "/assets/images/design.png",
    title: "Design",
    courses: "18 Courses",
  },
];

function CourseCard({ course, index }) {
  // normalize image src to avoid Invalid URL errors in next/image
  const rawSrc = course?.image;
  let imageSrc = "/assets/images/placeholder.png";
  if (typeof rawSrc === "string") {
    const src = rawSrc.trim();
    if (src.startsWith("http") || src.startsWith("/")) {
      imageSrc = src;
    } else if (src.length > 0) {
      // treat as relative path
      imageSrc = src.startsWith("./") ? src.slice(1) : `/${src}`;
    }
  }
  return (
    <motion.div
      className="relative flex flex-col h-full overflow-hidden text-left duration-300 border bg-white/30 backdrop-blur-lg border-white/40 rounded-2xl group"
      whileHover={{
        y: -6,
        boxShadow: "0px 15px 25px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="relative overflow-hidden w-full aspect-[16/9] rounded-t-2xl">
        <Image
          src={imageSrc}
          alt={course.alt || course.title || "Course image"}
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          // If image is an external URL, avoid Next.js image optimization to prevent server-side proxy fetch errors
          unoptimized={
            typeof imageSrc === "string" && imageSrc.startsWith("http")
          }
        />
      </div>
      <div className="flex flex-col flex-grow p-5">
        <h3 className="text-lg font-bold text-gray-900">
          <Link href={course.link} className="hover:underline">
            {course.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-gray-600">{course.author}</p>
        <div className="flex-grow mt-3">
          <p className="text-sm text-gray-500">{course.enrollment}</p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-xl font-extrabold text-gray-800">{course.price}</p>
          <Magnet padding={20} magnetStrength={4}>
            <Link href={course.link}>
              <motion.button
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg"
                whileHover={{ scale: 1.05, backgroundColor: "#2563EB" }}
                whileTap={{ scale: 0.95 }}
              >
                Enroll
              </motion.button>
            </Link>
          </Magnet>
        </div>
      </div>
    </motion.div>
  );
}

const mentors = [
  {
    name: "Ronald Richards",
    title: "UI/UX Designer",
    students: "2400 Students",
    image:
      "https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Jane Cooper",
    title: "Web Developer",
    students: "3500 Students",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Robert Fox",
    title: "Marketing Expert",
    students: "2800 Students",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Jenny Wilson",
    title: "Data Scientist",
    students: "4100 Students",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Esther Howard",
    title: "Astrologer",
    students: "800 Students",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Cody Fisher",
    title: "Physicist",
    students: "1500 Students",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Alex Johnson",
    title: "AI Specialist",
    students: "1900 Students",
    image:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Olivia Chen",
    title: "Cybersecurity Expert",
    students: "2200 Students",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Ben Carter",
    title: "Cloud Architect",
    students: "2700 Students",
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  },
];

function MentorCard({ mentor, index }) {
  const glowColors = [
    "bg-blue-400",
    "bg-green-400",
    "bg-purple-400",
    "bg-amber-400",
  ];
  const glowColor = glowColors[index % glowColors.length];

  return (
    <motion.div
      className="relative w-full h-full p-6 overflow-hidden text-center border shadow-xl sm:w-64 bg-white/50 backdrop-blur-xl border-white/20 rounded-3xl"
      whileHover={{
        y: -8,
        scale: 1.03,
        boxShadow: "0px 20px 30px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        className={`absolute w-32 h-32 ${glowColor} rounded-full opacity-30 -top-12 -right-12 blur-3xl`}
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <Image
          src={mentor.image}
          alt={`Profile of ${mentor.name}`}
          width={96}
          height={96}
          className="object-cover w-24 h-24 mx-auto rounded-full shadow-lg"
          // mark remote mentor images unoptimized to avoid server-side fetch issues during dev
          unoptimized={
            typeof mentor.image === "string" && mentor.image.startsWith("http")
          }
        />
        <h3 className="mt-4 text-lg font-bold text-gray-800">{mentor.name}</h3>
        <p className="text-sm text-gray-600">{mentor.title}</p>
        <p className="mt-4 text-sm font-semibold text-gray-700">
          {mentor.students}
        </p>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  // useRef untuk mengakses elemen DOM secara aman di React
  const statsSectionRef = useRef(null);
  const coursesSliderRef = useRef(null);
  const [apiPopularCourses, setApiPopularCourses] = useState(null);

  // useEffect untuk menjalankan semua skrip setelah komponen dimuat
  useEffect(() => {
    // declared to avoid ReferenceError in cleanup if not used
    let counterObserver = null;
    // --- Inisialisasi semua slider Swiper.js ---
    const swiperInstances = [];
    if (coursesSliderRef.current) {
      const swiper = new Swiper(coursesSliderRef.current, {
        modules: [Mousewheel, FreeMode],
        loop: false,
        spaceBetween: 24,
        slidesPerView: 1,
        centerInsufficientSlides: true,
        freeMode: {
          enabled: true,
          sticky: false,
        },
        mousewheel: {
          enabled: true,
          forceToAxis: true,
          sensitivity: 1,
          releaseOnEdges: true,
        },
        breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } },
      });
      swiperInstances.push(swiper);
    }

    // --- Logika Animasi Scroll ---
    const scrollObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document
      .querySelectorAll(".scroll-animate")
      .forEach((el) => scrollObserver.observe(el));
    // Fungsi cleanup untuk mencegah memory leak
    return () => {
      scrollObserver.disconnect();
      if (counterObserver) counterObserver.disconnect();
      swiperInstances.forEach((swiper) => swiper.destroy(true, true));
    };
  }, []);

  // Fetch popular courses dari API dan simpan di state
  useEffect(() => {
    let mounted = true;

    async function fetchPopularCourses() {
      try {
        const response = await api.get("/courses/popular");
        const payload = response.data;
        if (!mounted) return;
        if (payload && Array.isArray(payload.data)) {
          // Transform ke bentuk objek yang CourseCard mengharapkan
          const transformed = payload.data.map((c) => ({
            image: c.thumbnail,
            alt: c.name,
            title: c.name,
            author: c.category?.name ? `${c.category.name}` : "",
            enrollment: "",
            price: "",
            link: `/detail-course/${c.slug}`,
          }));
          setApiPopularCourses(transformed);
        }
      } catch (err) {
        console.error("Failed to fetch popular courses:", err);
      }
    }

    fetchPopularCourses();

    return () => {
      mounted = false;
    };
  }, []);

  const [stats, setStats] = useState({
    courses: 0,
    categories: 0,
    students: 0,
    mentors: 0,
    benefits: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getStats();
      setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <>
      <main className="pt-14">
        <div className="w-full px-1 sm:px-2 md:px-4 lg:px-8">
          <motion.section
            className="grid items-center grid-cols-1 gap-8 py-10 md:py-20 md:grid-cols-2 md:gap-12"
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.2 } } }}
          >
            <motion.div
              className="px-2 text-center md:text-left md:px-8 lg:px-12"
              variants={scrollAnimateVariants}
            >
              <h1 className="text-5xl font-extrabold leading-tight text-gray-900 lg:text-6xl drop-shadow-lg">
                <SplitText
                  text="Unlock Your Potential with "
                  textAlign="inherit"
                  delay={30}
                  duration={0.5}
                />
                <TextType
                  text="Inovindo Academy"
                  as="span"
                  className="text-5xl text-transparent bg-gradient-to-r from-blue-400 via-green-500 to-green-500 bg-clip-text"
                  loop={false}
                  textColors={["transparent"]}
                  initialDelay={1400}
                />
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                Pilih dari ribuan kursus online dengan video baru yang
                diterbitkan setiap bulan.
              </p>
              <Link href="/my-courses">
                <motion.button
                  className="px-8 py-3 mt-8 text-lg font-semibold text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-green-400 to-blue-500"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Mulai Perjalanan Anda
                </motion.button>
              </Link>
            </motion.div>

            <div>
              <div>
                <motion.div className="relative flex items-center justify-center px-2 md:px-0 [mask-image:_linear-gradient(to_bottom,black_85%,transparent)]">
                  {" "}
                  <Image
                    src="/assets/images/pesawat.png"
                    alt="Pesawat Kertas"
                    width={150}
                    height={150}
                    className="absolute top-0 w-40 h-auto transform left-70 -rotate-12 opacity-70"
                  />
                  <Image
                    src="/assets/images/panah.png"
                    alt="Panah"
                    width={110}
                    height={110}
                    className="absolute h-auto transform opacity-40 w-30 top-95 left-1 rotate-315"
                  />
                  <Image
                    src="/assets/images/book.svg"
                    alt="Buku"
                    width={110}
                    height={110}
                    className="absolute h-auto transform opacity-40 w-30 top-15 left-140 rotate-140"
                  />
                  <AnimatedContent
                    distance={150}
                    direction="vertical"
                    reverse={false}
                    duration={1.2}
                    ease="power3.out"
                    initialOpacity={0.2}
                    animateOpacity
                    scale={0.5}
                    threshold={0.2}
                    delay={0.3}
                  >
                    <Image
                      src="/assets/images/hero-home.png"
                      alt="Tim berkolaborasi dalam sebuah proyek"
                      width={1000}
                      height={1000}
                      className="relative z-10 object-contain w-full h-auto max-w-2xl"
                      priority
                    />
                  </AnimatedContent>
                </motion.div>
              </div>{" "}
            </div>
          </motion.section>
        </div>

        <div className="w-full">
          {/* Stats Section */}
          <section className="py-16">
            <div className="w-full px-2 sm:px-4 md:px-8 lg:px-16">
              <motion.div
                className="grid grid-cols-2 gap-8 md:grid-cols-4"
                initial="initial"
                whileInView="animate"
                variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
                viewport={{ once: true, amount: 0.2 }}
              >
                {/* Stat 1: Courses */}
                <motion.div
                  className="relative p-6 overflow-hidden text-center border shadow-xl bg-white/50 backdrop-blur-xl border-white/20 rounded-3xl"
                  variants={scrollAnimateVariants}
                >
                  <div className="absolute w-32 h-32 bg-blue-400 rounded-full opacity-50 -top-12 -right-12 blur-3xl"></div>
                  <div className="relative">
                    <h3 className="flex items-center justify-center text-4xl font-bold text-gray-600">
                      <CountUp
                        from={0}
                        to={stats.courses}
                        separator=","
                        direction="up"
                        duration={1}
                        className="count-up-text text-shadow-white text-5xl font-normal text-blue-800"
                      />
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Courses by our best mentors
                    </p>
                  </div>
                </motion.div>

                {/* Stat 2: Students */}
                <motion.div
                  className="relative p-6 overflow-hidden text-center border shadow-xl bg-white/50 backdrop-blur-xl border-white/20 rounded-3xl"
                  variants={scrollAnimateVariants}
                >
                  <div className="absolute w-32 h-32 bg-green-400 rounded-full opacity-50 -top-12 -right-12 blur-3xl"></div>
                  <div className="relative">
                    <h3 className="flex items-center justify-center text-4xl font-bold text-gray-600">
                      <CountUp
                        from={0}
                        to={stats.students}
                        separator=","
                        direction="up"
                        duration={1}
                        className="count-up-text text-shadow-white text-5xl font-normal text-green-800"
                      />
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Students Enrolled
                    </p>
                  </div>
                </motion.div>

                {/* Stat 3: Mentors */}
                <motion.div
                  className="relative p-6 overflow-hidden text-center border shadow-xl bg-white/50 backdrop-blur-xl border-white/20 rounded-3xl"
                  variants={scrollAnimateVariants}
                >
                  <div className="absolute w-32 h-32 bg-purple-400 rounded-full opacity-50 -top-12 -right-12 blur-3xl"></div>
                  <div className="relative">
                    <h3 className="flex items-center justify-center text-4xl font-bold text-gray-600">
                      <CountUp
                        from={0}
                        to={stats.mentors}
                        separator=","
                        direction="up"
                        duration={0.5}
                        className="count-up-text text-shadow-white text-5xl font-normal text-purple-800"
                      />
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">Expert Mentors</p>
                  </div>
                </motion.div>

                {/* Stat 4: Reviews */}
                <motion.div
                  className="relative p-6 overflow-hidden text-center border shadow-xl bg-white/50 backdrop-blur-xl border-white/20 rounded-3xl"
                  variants={scrollAnimateVariants}
                >
                  <div className="absolute w-32 h-32 rounded-full opacity-50 -top-12 -right-12 bg-amber-400 blur-3xl"></div>
                  <div className="relative">
                    <h3 className="flex items-center justify-center text-4xl font-bold text-gray-600">
                      <CountUp
                        from={0}
                        to={stats.benefits}
                        separator=","
                        direction="up"
                        duration={1}
                        className="count-up-text text-shadow-white text-5xl font-normal text-amber-500"
                      />
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Positive Benefits
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          <div className="w-full px-1 sm:px-2 md:px-4 lg:px-8">
            <section className="w-full py-24">
              <motion.div
                className="flex flex-col items-center justify-between gap-4 mb-12 md:flex-row"
                variants={scrollAnimateVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.5 }}
              >
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Kategori Teratas
                </h2>
                <Link
                  href="#"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Lihat Semua
                </Link>
              </motion.div>
              <motion.div
                className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3"
                variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
              >
                {categories.map((category, index) => (
                  <AnimatedContent
                    key={index}
                    distance={100}
                    direction={index % 2 === 0 ? "horizontal" : "vertical"}
                    reverse={index % 2 === 0}
                    duration={1}
                    ease="power3.out"
                    scale={0.8}
                  >
                    <motion.div
                      className="relative w-full h-full p-8 overflow-hidden text-center border shadow-xl bg-white/50 backdrop-blur-xl border-white/20 rounded-3xl"
                      whileHover={{
                        y: -8,
                        scale: 1.03,
                        boxShadow: "0px 20px 30px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full">
                        <Image
                          src={category.icon}
                          alt={`${category.title} Icon`}
                          width={50}
                          height={50}
                          className="object-contain"
                        />
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-gray-800">
                        {category.title}
                      </h3>
                      <p className="text-gray-600">{category.courses}</p>
                    </motion.div>
                  </AnimatedContent>
                ))}
              </motion.div>
            </section>

            <section className="py-16 scroll-animate">
              <motion.div
                className="flex flex-col items-center justify-between gap-8 mb-12 text-center md:flex-row md:text-left"
                variants={scrollAnimateVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
              >
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 lg:text-4xl">
                    Kursus Populer
                  </h2>
                </div>
                <Link
                  href="/my-courses"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Lihat Semua
                </Link>
              </motion.div>
              <div
                ref={coursesSliderRef}
                className="relative swiper popular-courses-slider"
              >
                <div className="swiper-wrapper">
                  {apiPopularCourses &&
                    apiPopularCourses.map((course, index) => (
                      <div className="h-auto pb-10 swiper-slide" key={index}>
                        <CourseCard course={course} index={index} />
                      </div>
                    ))}
                </div>
              </div>
            </section>

            <section className="py-16 scroll-animate">
              <motion.div
                className="flex flex-col items-center justify-between gap-8 mb-12 text-center md:flex-row md:text-left"
                variants={scrollAnimateVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
              >
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 lg:text-4xl">
                    Belajar dari Para Ahli
                  </h2>
                  <p className="max-w-2xl mx-auto mt-2 text-base text-gray-600 md:mx-0">
                    Mentor kami adalah praktisi industri dengan pengalaman
                    bertahun-tahun.
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="flex flex-wrap justify-center gap-8"
                variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
              >
                {" "}
                {mentors.map((mentor, index) => (
                  <MentorCard mentor={mentor} index={index} key={index} />
                ))}
              </motion.div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
