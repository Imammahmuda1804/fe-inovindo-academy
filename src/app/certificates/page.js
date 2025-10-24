'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import AnimatedContent from "@/components/animatedcontent.jsx";
import Sidebar from "@/components/Sidebar.jsx";
import CertificatesSkeleton from "@/components/CertificatesSkeleton.jsx";
import { FaSearch, FaCertificate, FaDownload } from "react-icons/fa";

// Dummy data based on the ERD's Sertificate table
const certificates = [
  {
    id: 1,
    course_name: 'Dasar-Dasar Desain UI/UX',
    thumbnail: "/assets/images/ui-ux.png",
    certificate_code: 'UIUX-2025-XYZ-001',
    issued_date: '2025-09-20',
    download_url: '#',
  },
  {
    id: 2,
    course_name: 'Membuat Aplikasi Kloning Uber',
    thumbnail: "/assets/images/home.png",
    certificate_code: 'DEV-2025-ABC-007',
    issued_date: '2025-08-15',
    download_url: '#',
  },
  {
    id: 3,
    course_name: 'Fundamental JavaScript Modern',
    thumbnail: "/assets/images/home.jpg",
    certificate_code: 'JS-2025-PQR-042',
    issued_date: '2025-07-01',
    download_url: '#',
  },
];

const CertificateCard = ({ cert, index }) => {
  return (
    <AnimatedContent distance={50} delay={index * 0.1}>
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5">
        <div className="relative h-44 bg-gray-100">
          <Image 
            src={cert.thumbnail} 
            alt={`Thumbnail for ${cert.course_name}`}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="p-5">
          <p className="text-sm text-gray-500 mb-1">Sertifikat Kelulusan</p>
          <h3 className="text-lg font-bold text-gray-800 mb-3 min-h-[3.5rem]">{cert.course_name}</h3>
          <div className="text-sm text-gray-600 space-y-2 mb-4">
            <p><span className="font-semibold">Tanggal Terbit:</span> {new Date(cert.issued_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><span className="font-semibold">Kode:</span> <span className="font-mono">{cert.certificate_code}</span></p>
          </div>
          <motion.a 
            href={cert.download_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full mt-4 inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaDownload className="mr-2" />
            Unduh Sertifikat
          </motion.a>
        </div>
      </div>
    </AnimatedContent>
  );
};

export default function CertificatesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Simulate 1.5 seconds loading time
    return () => clearTimeout(timer);
  }, []);

  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificate_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <CertificatesSkeleton />;
  }

  return (
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
                  Sertifikat Saya
                </h1>
                <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">Lihat, kelola, dan unduh semua sertifikat yang telah Anda peroleh.</p>
              </div>
            </AnimatedContent>

            <AnimatedContent distance={50} delay={0.2}>
              <div className="mb-8 p-4 bg-white/60 backdrop-blur-lg border border-white/30 rounded-2xl shadow-md">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama kursus atau kode sertifikat..."
                    className="w-full pl-10 pr-4 py-2.5 text-base border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                </div>
              </div>
            </AnimatedContent>

            <AnimatedContent distance={50} delay={0.4}>
              {filteredCertificates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 isolate">
                  {filteredCertificates.map((cert, index) => (
                    <CertificateCard key={cert.id} cert={cert} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                  <FaCertificate className="mx-auto text-5xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700">Belum Ada Sertifikat</h3>
                  <p className="text-gray-500 mt-2">Selesaikan kursus untuk mendapatkan sertifikat pertama Anda.</p>
                </div>
              )}
            </AnimatedContent>
          </div>
        </div>
      </main>
    </div>
  );
}