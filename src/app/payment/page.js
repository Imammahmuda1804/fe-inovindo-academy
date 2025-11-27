"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import apiService from "@/lib/apiService";
import { motion, AnimatePresence, animate } from "framer-motion";
import {
  FaUsers,
  FaUserCircle,
  FaCheckCircle,
  FaCalendarAlt,
  FaGift,
  FaStar,
  FaRocket,
  FaCertificate,
  FaInfinity,
  FaComments,
  FaBriefcase,
  FaUserCheck,
  FaInfoCircle,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import Image from "next/image";
import "./payment.css";

// --- DATA DUMMY ---
const courseDetails = {
  name: "Belajar Desain UI/UX dari Dasar hingga Mahir",
  category: "Desain UI/UX",
  description:
    "Kursus komprehensif untuk menjadi desainer produk digital yang siap berkarir di industri, mencakup riset, wireframing, prototyping, hingga testing.",
  thumbnail: "/assets/images/ui-ux.png",
  students: 1824,
  mentor: { name: "Jane Cooper", role: "Senior UI/UX Designer di TechCorp" },
  benefits: [
    { icon: FaCertificate, text: "Sertifikat kelulusan terverifikasi" },
    { icon: FaInfinity, text: "Akses materi kursus selamanya" },
    { icon: FaComments, text: "Grup diskusi privat dengan mentor" },
    { icon: FaBriefcase, text: "Studi kasus dunia nyata" },
    { icon: FaUserCheck, text: "Feedback proyek akhir personal" },
  ],
  has_batches: true,
};
const courseBatches = [
  {
    id: 1,
    name: "Batch September 2025",
    startDate: "2025-09-20",
    status: "Tersedia",
    totalSlots: 50,
    filledSlots: 25,
  },
  {
    id: 2,
    name: "Batch Oktober 2025",
    startDate: "2025-10-20",
    status: "Tersedia",
    totalSlots: 50,
    filledSlots: 45,
  },
  {
    id: 3,
    name: "Batch Agustus 2025",
    startDate: "2025-08-20",
    status: "Penuh",
    totalSlots: 50,
    filledSlots: 50,
  },
];
const pricingOptions = [
  {
    id: 1,
    name: "Basic",
    duration: "30 hari",
    price: 299000,
    popular: false,
    features: ["Akses ke semua materi video", "Sertifikat digital kelulusan"],
  },
  {
    id: 2,
    name: "Premium",
    duration: "90 hari",
    price: 599000,
    popular: true,
    features: [
      "Semua fitur di Basic",
      "Grup diskusi privat",
      "Feedback tugas & proyek",
    ],
  },
  {
    id: 3,
    name: "Pro",
    duration: "Selamanya",
    price: 999000,
    popular: false,
    features: [
      "Semua fitur di Premium",
      "Sesi mentoring 1-on-1",
      "Akses prioritas ke kursus baru",
    ],
  },
];

// --- FUNGSI UTILITAS ---
const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// --- KOMPONEN ---
function AnimatedPrice({ value }) {
  const ref = useRef(null);
  const prevValue = useRef(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controls = animate(prevValue.current, value, {
      duration: 0.7,
      ease: "easeOut",
      onUpdate(latest) {
        node.textContent = formatRupiah(latest);
      },
    });
    prevValue.current = value;
    return () => controls.stop();
  }, [value]);
  return <span ref={ref}>{formatRupiah(prevValue.current)}</span>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// --- HALAMAN UTAMA ---
const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

export default function PaymentPage() {
  const router = useRouter();
  const [step, setStep] = useState(courseDetails.has_batches ? 2 : 3);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [summary, setSummary] = useState({
    planPrice: 0,
    taxAmount: 0,
    totalAmount: 0,
  });
  const [isReadyToPay, setIsReadyToPay] = useState(false);

  useEffect(() => {
    // Load Midtrans Snap script
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js"; // Use sandbox for development
    script.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  useEffect(() => {
    const selectedBatch = selectedBatchId
      ? courseBatches.find((b) => b.id === selectedBatchId)
      : null;
    const selectedPlan = selectedPlanId
      ? pricingOptions.find((p) => p.id === selectedPlanId)
      : null;
    const ready = selectedPlan && (!courseDetails.has_batches || selectedBatch);
    setIsReadyToPay(ready);
    if (selectedPlan) {
      const tax = Math.round(selectedPlan.price * 0.11);
      const total = selectedPlan.price + tax;
      setSummary({
        planPrice: selectedPlan.price,
        taxAmount: tax,
        totalAmount: total,
      });
    } else {
      setSummary({ planPrice: 0, taxAmount: 0, totalAmount: 0 });
    }
  }, [selectedBatchId, selectedPlanId]);

  const handlePayment = () => {
    /* ... */
  };
  const selectedBatchName =
    courseBatches.find((b) => b.id === selectedBatchId)?.name || "-";
  const selectedPlanName =
    pricingOptions.find((p) => p.id === selectedPlanId)?.name || "-";

  return (
    <div className="relative min-h-screen font-sans bg-gray-50 pt-16 px-2 sm:px-6 md:px-8 lg:px-16">
      <main className="container mx-auto py-8 relative z-10">
        <motion.div
          className="grid lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="lg:col-span-2 space-y-6"
            variants={containerVariants}
          >
            <motion.div
              className="relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6"
              variants={itemVariants}
            >
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0 w-full sm:w-44">
                  <Image
                    src={courseDetails.thumbnail}
                    width={160}
                    height={90}
                    layout="responsive"
                    alt="Course Thumbnail"
                    className="rounded-lg shadow-md object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-700">
                    {courseDetails.category}
                  </p>
                  <h1 className="text-xl font-bold leading-tight mt-1 text-gray-900">
                    {courseDetails.name}
                  </h1>
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <FaUserCircle /> {courseDetails.mentor.name}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaUsers />{" "}
                      {courseDetails.students.toLocaleString("id-ID")} Siswa
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mt-2 border-t border-gray-200/80 pt-2">
                    {courseDetails.description}
                  </p>
                </div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {step === 2 && courseDetails.has_batches && (
                <motion.div
                  key="step2"
                  className="relative p-6 overflow-hidden bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-teal-300 rounded-full blur-3xl opacity-30"></div>
                  <h2 className="relative z-10 text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <FaCalendarAlt className="h-6 w-6 text-teal-500" />
                    Pilih Batch Tersedia
                  </h2>
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courseBatches.map((batch) => {
                      const isFull = batch.status === "Penuh";
                      const filledPercentage =
                        (batch.filledSlots / batch.totalSlots) * 100;
                      return (
                        <motion.div
                          key={batch.id}
                          className="relative"
                          whileHover={{ scale: isFull ? 1 : 1.03 }}
                        >
                          <input
                            type="radio"
                            id={`batch_${batch.id}`}
                            name="batch"
                            value={batch.id}
                            className="peer sr-only"
                            disabled={isFull}
                            onChange={(e) =>
                              setSelectedBatchId(Number(e.target.value))
                            }
                            checked={selectedBatchId === batch.id}
                          />
                          <label
                            htmlFor={`batch_${batch.id}`}
                            className={`flex flex-col p-4 border-2 rounded-lg transition-all h-full ${
                              isFull
                                ? "bg-gray-100/50 border-gray-200 text-gray-400 cursor-not-allowed"
                                : "cursor-pointer bg-white/30 hover:border-blue-400 peer-checked:border-blue-500 peer-checked:bg-blue-50/50"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-lg text-gray-800">
                                {batch.name}
                              </h4>
                              <div
                                className={`flex items-center gap-2 text-sm font-semibold py-1 px-3 rounded-full ${
                                  isFull
                                    ? "bg-red-100 text-red-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    isFull ? "bg-red-500" : "bg-green-500"
                                  }`}
                                ></div>
                                {batch.status}
                              </div>
                            </div>
                            <p
                              className={`text-sm mb-4 ${
                                isFull ? "text-gray-500" : "text-gray-600"
                              }`}
                            >
                              Mulai: {formatDate(batch.startDate)}
                            </p>
                            {!isFull && (
                              <div className="mt-auto">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                  <motion.div
                                    className={`${
                                      filledPercentage > 80
                                        ? "bg-red-500"
                                        : "bg-blue-500"
                                    } h-2.5 rounded-full`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${filledPercentage}%` }}
                                    transition={{
                                      duration: 1,
                                      ease: "easeOut",
                                    }}
                                  ></motion.div>
                                </div>
                                <p className="text-xs text-gray-500 text-right">
                                  {batch.filledSlots}/{batch.totalSlots} terisi
                                </p>
                              </div>
                            )}
                            <AnimatePresence>
                              {selectedBatchId === batch.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  className="absolute top-3 right-3 text-blue-500"
                                >
                                  <FaCheckCircle />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </label>
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={nextStep}
                      disabled={!selectedBatchId}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      Lanjutkan <FaArrowRight />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  className="relative p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <FaGift className="h-6 w-6 text-purple-500" />
                    Pilih Paket Akses
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {pricingOptions.map((plan) => (
                      <motion.div
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                          selectedPlanId === plan.id
                            ? "scale-105 shadow-2xl"
                            : "opacity-80 shadow-xl hover:opacity-100"
                        }`}
                        whileHover={{
                          scale: selectedPlanId === plan.id ? 1.05 : 1.02,
                        }}
                      >
                        <div
                          className={`absolute inset-0 rounded-2xl border-4 ${
                            selectedPlanId === plan.id
                              ? "border-blue-500"
                              : "border-transparent"
                          }`}
                        ></div>
                        <div
                          className={`absolute inset-0 bg-white/60 backdrop-blur-xl rounded-2xl ${
                            plan.popular
                              ? "border-2 border-blue-500"
                              : "border border-white/20"
                          }`}
                        ></div>
                        <div className="relative z-10 flex flex-col h-full">
                          {plan.popular && (
                            <div className="absolute -top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                              <FaStar size={12} /> Populer
                            </div>
                          )}
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            {plan.name}
                          </h3>
                          <p className="text-3xl font-extrabold text-blue-600 mb-4">
                            {formatRupiah(plan.price)}
                          </p>
                          <p className="text-sm text-gray-500 mb-6">
                            Akses selama {plan.duration}
                          </p>
                          <ul className="space-y-3 text-gray-700 mb-8 flex-grow">
                            {plan.features.map((feature, i) => (
                              <li key={i} className="flex items-center gap-3">
                                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <div
                            className={`mt-auto w-full text-center py-2 rounded-lg font-semibold ${
                              selectedPlanId === plan.id
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {selectedPlanId === plan.id
                              ? "Paket Terpilih"
                              : "Pilih Paket"}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={prevStep}
                      disabled={!courseDetails.has_batches}
                      className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-colors duration-300 hover:bg-gray-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaArrowLeft /> Kembali
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl sticky top-24">
              <div className="relative z-10 p-6 border-b border-gray-200/80">
                <h2 className="text-xl font-bold text-gray-900">
                  Ringkasan Pesanan
                </h2>
              </div>
              <div className="relative z-10 p-6 space-y-4 min-h-[280px]">
                <AnimatePresence mode="wait">
                  {selectedPlanId === null ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center justify-center text-center text-gray-500 h-full pt-8"
                    >
                      <FaInfoCircle size={32} className="mb-4 text-blue-500" />
                      <p className="text-sm font-medium">
                        Rincian pesanan akan muncul di sini setelah Anda memilih
                        paket.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="space-y-2 text-sm">
                        {courseDetails.has_batches && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Batch Terpilih
                            </span>
                            <span className="font-medium text-gray-800">
                              {selectedBatchName}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Paket Akses</span>
                          <span className="font-medium text-gray-800">
                            {selectedPlanName}
                          </span>
                        </div>
                        <hr className="pt-2 border-gray-200/80" />
                        <div className="flex justify-between">
                          <span className="text-gray-600">Harga</span>
                          <span className="text-gray-700">
                            <AnimatedPrice value={summary.planPrice} />
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">PPN (11%)</span>
                          <span className="text-gray-700">
                            <AnimatedPrice value={summary.taxAmount} />
                          </span>
                        </div>
                      </div>
                      <hr className="my-4 border-gray-200/80" />
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span className="text-gray-800">Total</span>
                        <span className="text-blue-600 text-xl">
                          <AnimatedPrice value={summary.totalAmount} />
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative z-10 p-6 border-t border-gray-200/80">
                <motion.div
                  animate={isReadyToPay ? { scale: [1, 1.03, 1] } : {}}
                  transition={
                    isReadyToPay
                      ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                      : {}
                  }
                  className="rounded-lg shadow-lg"
                >
                  <button
                    onClick={handlePayment}
                    disabled={!isReadyToPay}
                    className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-colors duration-300 transform ${
                      isReadyToPay
                        ? "hover:bg-blue-700"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    {isReadyToPay ? (
                      <span className="flex items-center justify-center gap-2">
                        <FaRocket /> Bayar{" "}
                        <AnimatedPrice value={summary.totalAmount} />
                      </span>
                    ) : courseDetails.has_batches ? (
                      "Pilih Batch & Paket"
                    ) : (
                      "Pilih Paket"
                    )}
                  </button>
                </motion.div>
                <p className="text-xs text-gray-500 text-center mt-3">
                  Pembayaran aman dan terenkripsi oleh Midtrans.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
