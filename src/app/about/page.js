// src/app/about/page.js
"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FaBuilding,
  FaBullseye,
  FaLaptopCode,
  FaUsers,
  FaAward,
  FaHandshake,
} from "react-icons/fa";
import Image from "next/image";

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const services = [
    {
      name: "Website Development",
      icon: <FaLaptopCode className="text-3xl" />,
    },
    {
      name: "Mobile App Development",
      icon: <FaLaptopCode className="text-3xl" />,
    },
    { name: "2D & 3D Animation", icon: <FaLaptopCode className="text-3xl" /> },
    {
      name: "Architectural & Engineering Design",
      icon: <FaBuilding className="text-3xl" />,
    },
    { name: "Videography", icon: <FaLaptopCode className="text-3xl" /> },
    {
      name: "Social Media Optimization",
      icon: <FaUsers className="text-3xl" />,
    },
  ];

  const partnerships = [
    {
      name: "Kementerian Pendidikan dan Kebudayaan RI (KEMENDIKBUD RI)",
      description:
        "Kerja sama untuk meningkatkan kualitas pendidikan vokasi melalui pelatihan guru, sinkronisasi kurikulum, dan program magang.",
      icon: <FaHandshake className="text-3xl text-blue-500" />,
    },
    {
      name: "Kementerian Koperasi dan UKM RI (KemenKUMKM RI)",
      description:
        "Menyelenggarakan pelatihan Digital Marketing untuk para pelaku UMKM di Indonesia.",
      icon: <FaHandshake className="text-3xl text-green-500" />,
    },
    {
      name: "Universitas Pendidikan Indonesia (UPI)",
      description:
        "Kemitraan dengan Program Studi Pendidikan Multimedia untuk memperkuat hubungan antara dunia pendidikan dan industri.",
      icon: <FaHandshake className="text-3xl text-purple-500" />,
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
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold text-slate-900 drop-shadow-lg"
            variants={itemVariants}
          >
            Tentang Inovindo Digital Media
          </motion.h1>
          <motion.p
            className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Mendorong Inovasi dan Transformasi Digital di Indonesia Sejak 2010.
          </motion.p>
        </div>
      </motion.section>

      <motion.div
        className="container mx-auto px-4 py-16 space-y-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Section: Tentang Kami */}
        <motion.section id="tentang-kami" variants={itemVariants}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative w-full h-80 rounded-2xl shadow-2xl overflow-hidden">
              <Image
                src="/assets/images/logo.png"
                alt="Tim Inovindo"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <FaBuilding className="mr-3 text-blue-500" /> Tentang Kami
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                PT. Inovindo Digital Media adalah perusahaan Teknologi Informasi
                yang didirikan di Bandung pada 10 November 2010. Dengan lebih
                dari 10 tahun pengalaman, kami telah menyelesaikan lebih dari
                1000 proyek untuk instansi pemerintah serta perusahaan domestik
                dan internasional.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Tim kami terdiri dari para ahli muda yang kompeten dan
                berdedikasi untuk memberikan layanan terbaik bagi klien dan
                mitra kami, mendorong inovasi di setiap langkah.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Section: Layanan Kami */}
        <motion.section id="layanan" variants={itemVariants}>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Layanan Kami</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
              Kami menyediakan berbagai layanan digital untuk memenuhi kebutuhan
              bisnis Anda di era modern.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200/80 flex flex-col items-center justify-center aspect-square"
                whileHover={{
                  y: -5,
                  boxShadow: "0px 10px 20px rgba(0,0,0,0.08)",
                }}
              >
                <div className="p-4 bg-blue-100 text-blue-600 rounded-full mb-4">
                  {service.icon}
                </div>
                <h4 className="font-semibold text-gray-700">{service.name}</h4>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section: Kemitraan & Penghargaan */}
        <motion.section id="kemitraan" variants={itemVariants}>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Kemitraan & Penghargaan</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
              Kami bangga dapat berkolaborasi dengan berbagai institusi
              terkemuka untuk memajukan pendidikan dan industri digital di
              Indonesia.
            </p>
          </div>
          <div className="space-y-8">
            {partnerships.map((partner, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200/80 flex items-start gap-6"
              >
                <div className="flex-shrink-0">{partner.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {partner.name}
                  </h3>
                  <p className="mt-2 text-gray-600">{partner.description}</p>
                </div>
              </motion.div>
            ))}
            <motion.div
              variants={itemVariants}
              className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200/80 flex items-start gap-6"
            >
              <div className="flex-shrink-0">
                <FaAward className="text-3xl text-amber-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Penghargaan Mitra Industri Terbaik
                </h3>
                <p className="mt-2 text-gray-600">
                  Pada tahun 2024, PT. Inovindo Digital Media menerima
                  penghargaan dari BMTI KEMDIKBUD RI sebagai salah satu mitra
                  industri terbaik.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}
