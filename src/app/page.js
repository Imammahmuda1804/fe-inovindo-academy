"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { FiTarget, FiAward, FiUsers } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";
import Link from "next/link";
import AnimatedContent from "@/components/animatedcontent.jsx";
import SplitText from "@/components/splittext.jsx";
import ScrollFloat from "@/components/scrollfloat";
import { getStats } from "@/lib/apiService";
import CountUp from "@/components/countup";

// Animation variants for scroll animations
const scrollAnimateVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function NewLandingPage() {
  const testimonials = [
    {
      quote:
        "LMS tech courses are top-notch! As someone who's always looking to stay ahead, I appreciate the up-to-date content.",
      name: "Jane Doe",
      company: "Google",
      img: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    {
      quote:
        "Byway's tech courses are top-notch! The content is relevant, and the multimedia makes learning engaging and fun.",
      name: "John Smith",
      company: "Designer",
      img: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    {
      quote:
        "A fantastic platform for skill development. The flexible schedule helped me learn at my own pace without any pressure.",
      name: "Emily White",
      company: "Developer",
      img: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    },
    {
      quote:
        "The mentors are incredibly helpful and responsive. I never felt stuck on any topic thanks to their amazing support.",
      name: "Michael Brown",
      company: "Data Scientist",
      img: "https://i.pravatar.cc/150?u=a042581f4e29026706d",
    },
  ];
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
      <div className="relative pt-2 overflow-x-hidden font-sans">
        <div className="w-full px-2 sm:px-4 md:px-8 lg:px-16">
          <div className="relative">
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
                <h1 className="mt-12 text-4xl font-extrabold leading-tight text-center text-gray-900 md:mt-0 lg:text-5xl">
                  <SplitText
                    text="Ayo Tingkatkan Karir Digital Bersama Kami!"
                    className="text-2xl font-extrabold leading-tight text-gray-900 lg:text-5xl"
                    delay={100}
                    duration={0.6}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="left"
                  />
                </h1>
                <p className="mt-6 text-lg text-gray-600">
                  Bergabunglah dengan ribuan pembelajar di seluruh dunia.
                  Dapatkan akses ke kursus-kursus terbaik yang diajar oleh para
                  ahli di bidangnya.
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
                    Mulai Belajar
                  </motion.button>
                </Link>
              </motion.div>

              <div>
                <motion.div
                  className="relative flex items-center justify-center px-2 md:px-0 [mask-image:_linear-gradient(to_bottom,black_85%,transparent)]"
                  variants={scrollAnimateVariants}
                >
                  <Image
                    src="/assets/images/pesawat.png"
                    alt="Pesawat Kertas"
                    width={150}
                    height={150}
                    className="absolute w-40 h-auto transform top-45 left-20 -rotate-12 opacity-70"
                  />
                  <Image
                    src="/assets/images/panah.png"
                    alt="Pesawat Kertas"
                    width={110}
                    height={110}
                    className="absolute h-auto transform opacity-40 w-30 top-20 left-110 rotate-140"
                  />
                  <Image
                    src="/assets/images/book.svg"
                    alt="Pesawat Kertas"
                    width={110}
                    height={110}
                    className="absolute h-auto transform opacity-40 w-30 top-100 left-120 rotate-140"
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
                    delay={0.2}
                  >
                    <Image
                      src="/assets/images/landing.png"
                      alt="Ilustrasi Belajar Online"
                      width={500}
                      height={500}
                      className="relative z-10 object-contain w-full h-auto max-w-md"
                      priority
                    />
                  </AnimatedContent>
                </motion.div>
              </div>
            </motion.section>
          </div>
        </div>

        <section className="w-full px-2 py-24 sm:px-4 md:px-8 lg:px-16">
          <motion.div
            className="text-center mb-25"
            initial="initial"
            whileInView="animate"
            variants={scrollAnimateVariants}
            viewport={{ once: true, amount: 0.5 }}
          >
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=35%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
              textClassName="text-2xl font-extrabold text-gray-900"
            >
              Kenapa Memilih Kami?
            </ScrollFloat>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 gap-10 md:grid-cols-3"
            initial="initial"
            whileInView="animate"
            variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <AnimatedContent
              distance={150}
              direction="horizontal"
              reverse={true}
              duration={1.2}
              ease="power3.out"
              initialOpacity={0.2}
              animateOpacity
              scale={0.7}
              threshold={0.2}
            >
              <motion.div
                className="relative p-8 overflow-hidden border shadow-xl bg-white/75 backdrop-blur-xl border-white/20 rounded-3xl"
                variants={scrollAnimateVariants}
              >
                <div className="absolute w-48 h-48 bg-blue-400 rounded-full -top-16 -right-16 blur-3xl opacity-40"></div>
                <div className="relative z-10">
                  <div className="inline-block p-4 mb-6 text-white bg-blue-500 rounded-2xl">
                    <FiTarget size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Kurikulum Relevan
                  </h3>
                  <p className="mt-3 text-gray-600">
                    Kurikulum kami dirancang bersama para ahli industri untuk
                    memastikan Anda mempelajari skill yang paling dicari saat
                    ini.
                  </p>
                </div>
              </motion.div>
            </AnimatedContent>
            <AnimatedContent
              distance={150}
              direction="vertical"
              reverse={true}
              duration={1.2}
              ease="power3.out"
              initialOpacity={0.2}
              animateOpacity
              scale={0.7}
              threshold={0.2}
            >
              <motion.div
                className="relative p-8 overflow-hidden border shadow-xl bg-white/50 backdrop-blur-xl border-white/20 rounded-3xl"
                variants={scrollAnimateVariants}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                  boxShadow: "0px 20px 30px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="absolute w-48 h-48 bg-green-400 rounded-full -top-16 -right-16 blur-3xl opacity-40"></div>
                <div className="relative z-10">
                  <div className="inline-block p-4 mb-6 text-white bg-green-500 rounded-2xl">
                    <FiAward size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Mentor Profesional
                  </h3>
                  <p className="mt-3 text-gray-600">
                    Belajar langsung dari praktisi berpengalaman yang akan
                    membimbing Anda dari awal hingga menjadi seorang
                    profesional.
                  </p>
                </div>
              </motion.div>
            </AnimatedContent>
            <AnimatedContent
              distance={150}
              direction="horizontal"
              reverse={false}
              duration={1.2}
              ease="power3.out"
              initialOpacity={0.2}
              animateOpacity
              scale={0.7}
              threshold={0.2}
            >
              <motion.div
                className="relative p-8 overflow-hidden border shadow-xl bg-white/50 backdrop-blur-xl border-white/20 rounded-3xl"
                variants={scrollAnimateVariants}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                  boxShadow: "0px 20px 30px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="absolute w-48 h-48 bg-purple-400 rounded-full -top-16 -right-16 blur-3xl opacity-40"></div>
                <div className="relative z-10">
                  <div className="inline-block p-4 mb-6 text-white bg-purple-500 rounded-2xl">
                    <FiUsers size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Komunitas Solid
                  </h3>
                  <p className="mt-3 text-gray-600">
                    Bergabunglah dengan komunitas pembelajar yang aktif,
                    berkolaborasi dalam proyek, dan perluas jaringan profesional
                    Anda.
                  </p>
                </div>
              </motion.div>
            </AnimatedContent>
          </motion.div>
        </section>

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

        <section className="w-full py-24 mb-32 overflow-hidden">
          <div className="w-full px-2 mb-8 sm:px-4 md:px-8 lg:px-16">
            <motion.div
              className="mb-20 text-center"
              initial="initial"
              whileInView="animate"
              variants={scrollAnimateVariants}
              viewport={{ once: true, amount: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-800">
                What Our Customer Say
              </h2>
              <p className="text-gray-500">About Us</p>
            </motion.div>
          </div>
          <div className="[mask-image:_linear-gradient(to_bottom,black_75%,transparent)] mt-5">
            <div className="w-full inline-flex flex-nowrap [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
              {[...Array(2)].map((_, i) => (
                <motion.ul
                  key={i}
                  className="flex items-center justify-center"
                  animate={{ x: ["0%", "-100%"] }}
                  transition={{
                    ease: "linear",
                    duration: 60,
                    repeat: Infinity,
                  }}
                  aria-hidden={i === 1}
                >
                  {testimonials
                    .concat(testimonials)
                    .map((testimonial, index) => (
                      <li key={index} className="flex-shrink-0 py-4 mx-6">
                        <div className="relative p-8 overflow-hidden border shadow-xl w-96 bg-white/90 backdrop-blur-xl border-white/20 rounded-3xl">
                          <div className="absolute w-48 h-48 bg-indigo-300 rounded-full -top-20 -left-20 blur-3xl opacity-30"></div>
                          <div className="relative z-10">
                            <FaQuoteLeft className="mb-4 text-4xl text-indigo-400" />
                            <p className="text-gray-700">{testimonial.quote}</p>
                            <div className="flex items-center mt-6 mb-6">
                              <Image
                                src={testimonial.img}
                                alt={`Foto profil ${testimonial.name}`}
                                width={48}
                                height={48}
                                className="object-cover w-12 h-12 rounded-full"
                              />
                              <div className="ml-4">
                                <p className="font-semibold text-gray-800">
                                  {testimonial.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {testimonial.company}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                </motion.ul>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
