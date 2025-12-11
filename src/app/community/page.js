// src/app/community/page.js
"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaLightbulb, FaRocket, FaHandshake } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function CommunityPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const benefits = [
    {
      icon: <FaLightbulb className="text-yellow-400" />,
      title: "Kolaborasi & Pertukaran Ide",
      description:
        "Diskusikan ide-ide baru, pecahkan masalah bersama, dan bangun proyek inovatif dengan sesama anggota.",
    },
    {
      icon: <FaUsers className="text-blue-400" />,
      title: "Jaringan Profesional",
      description:
        "Terhubung dengan para profesional dan praktisi industri yang berpengalaman di bidangnya.",
    },
    {
      icon: <FaRocket className="text-green-400" />,
      title: "Dukungan & Pertumbuhan",
      description:
        "Dapatkan dukungan dari mentor dan rekan sejawat dalam perjalanan belajar dan pengembangan karier Anda.",
    },
  ];

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <motion.section
        className="relative pt-32 pb-20 text-center bg-gradient-to-br from-blue-100 via-white to-green-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="p-4 bg-green-200 text-green-800 rounded-full inline-flex items-center justify-center mb-4"
            variants={itemVariants}
          >
            <FaUsers className="text-2xl" />
          </motion.div>
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold text-slate-900 drop-shadow-lg"
            variants={itemVariants}
          >
            Bergabunglah dengan Komunitas Kami
          </motion.h1>
          <motion.p
            className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Tempat di mana profesionalisme, kekeluargaan, dan kebersamaan
            bertemu untuk menciptakan inovasi.
          </motion.p>
        </div>
      </motion.section>

      <motion.div
        className="container mx-auto px-4 py-16 space-y-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Section: Tujuan Komunitas */}
        <motion.section id="tujuan-komunitas" variants={itemVariants}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative w-full h-80 rounded-2xl shadow-2xl overflow-hidden">
              <Image
                src="/assets/images/logo.png"
                alt="Diskusi Komunitas"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Tujuan Komunitas Inovindo Academy
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                Komunitas Inovindo Academy bertujuan untuk menjadi wadah bagi
                para peserta kursus, alumni, dan para penggiat teknologi untuk
                saling terhubung, berkolaborasi, dan tumbuh bersama.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Kami percaya bahwa belajar adalah sebuah perjalanan sosial.
                Melalui komunitas ini, kami memfasilitasi lingkungan yang
                suportif di mana setiap anggota dapat berbagi pengetahuan,
                mendapatkan wawasan industri, dan membangun jaringan profesional
                yang berharga.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Section: Manfaat Bergabung */}
        <motion.section id="manfaat" variants={itemVariants}>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-12">Manfaat Bergabung</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200/80 text-center"
                variants={itemVariants}
              >
                <div className="text-5xl inline-block mb-6">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section: Call to Action */}
        <motion.section
          id="cta"
          className="text-center bg-white p-12 rounded-3xl shadow-2xl border border-gray-200/80"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold mb-4">Siap untuk Memulai?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Ambil langkah pertama Anda dengan mengikuti salah satu kursus kami
            dan dapatkan akses eksklusif ke komunitas belajar kami.
          </p>
          <Link href="/courses">
            <motion.button
              className="px-10 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Jelajahi Semua Kursus
            </motion.button>
          </Link>
        </motion.section>
      </motion.div>
    </div>
  );
}
