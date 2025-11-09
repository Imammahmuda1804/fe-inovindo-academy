"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { getCourseBySlug, getPricingByCourseId } from "@/lib/apiService";
import { ensureAbsoluteUrl } from "@/lib/urlHelpers";
import "../payment.css";
import DetailCourseSkeleton from "@/components/DetailCourseSkeleton"; // Menggunakan skeleton yang sama

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
export default function PaymentPage({ params }) {
  const resolvedParams = React.use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const [pricingOptions, setPricingOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);

  const [step, setStep] = useState(2); // Default step
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [summary, setSummary] = useState({
    planPrice: 0,
    taxAmount: 0,
    totalAmount: 0,
  });
  const [isReadyToPay, setIsReadyToPay] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      setIsLoading(true);
      try {
        const data = await getCourseBySlug(resolvedParams.slug);
        if (data && data.status === "success") {
          setCourseData(data.data);
          // Step setting is moved to the second useEffect
        } else {
          console.error("Failed to fetch course data:", data);
          setCourseData(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        setCourseData(null);
        setIsLoading(false);
      }
    };

    if (resolvedParams.slug) {
      fetchCourseData();
    }
  }, [resolvedParams.slug]);

  useEffect(() => {
    const fetchDetailedData = async () => {
      if (courseData?.id) {
        try {
          const detailedData = await getPricingByCourseId(courseData.id);
          if (detailedData && detailedData.status === "success") {
            const data = detailedData.data;
            setPricingOptions(data.pricings || []);
            setBatchOptions(data.batches || []);
            setStep(data.batches && data.batches.length > 0 ? 2 : 3);
          } else {
            setPricingOptions([]);
            setBatchOptions([]);
          }
        } catch (error) {
          console.error("Error fetching detailed course data:", error);
          setPricingOptions([]);
          setBatchOptions([]);
        } finally {
          setIsLoading(false);
        }
      } else if (courseData) {
        // If courseData exists but has no id (or other issue), stop loading
        setIsLoading(false);
      }
    };

    fetchDetailedData();
  }, [courseData]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  useEffect(() => {
    if (!courseData) return;

    const hasBatches = batchOptions && batchOptions.length > 0;
    const selectedBatch = selectedBatchId
      ? batchOptions.find((b) => b.id === selectedBatchId)
      : null;
    const selectedPlan = selectedPlanId
      ? pricingOptions.find((p) => p.id === selectedPlanId)
      : null;

    const ready = selectedPlan && (!hasBatches || selectedBatch);
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
  }, [selectedBatchId, selectedPlanId, courseData, pricingOptions, batchOptions]);

  const handlePayment = () => {
    // TODO: Implement payment gateway logic (e.g., Midtrans Snap)
    console.log("Proceeding to payment with:", {
      course: courseData.name,
      batch: selectedBatchId,
      plan: selectedPlanId,
      total: summary.totalAmount,
    });
  };

  if (isLoading) {
    return <DetailCourseSkeleton />;
  }

  if (!courseData) {
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <div>
          <h2 className="text-2xl font-bold">Kursus Tidak Ditemukan</h2>
          <p className="text-gray-600">
            Kursus yang Anda cari tidak ada atau telah dihapus.
          </p>
          <a
            href="/courses"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Kembali ke Daftar Kursus
          </a>
        </div>
      </div>
    );
  }

  const mentor = courseData?.mentor ||
    courseData?.mentors?.[0]?.user ||
    courseData?.mentors?.[0] || { name: "N/A" };
  const selectedBatchName =
    batchOptions.find((b) => b.id === selectedBatchId)?.name || "-";
  const selectedPlanName =
    pricingOptions.find((p) => p.id === selectedPlanId)?.name || "-";
  const hasBatches = batchOptions && batchOptions.length > 0;
  const totalStudentsInCourse = hasBatches
    ? batchOptions.reduce((sum, batch) => sum + (batch.students_count || 0), 0)
    : 0;

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
                    src={ensureAbsoluteUrl(courseData.thumbnail)}
                    width={160}
                    height={90}
                    layout="responsive"
                    alt="Course Thumbnail"
                    className="rounded-lg shadow-md object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-700">
                    {courseData.category?.name}
                  </p>
                  <h1 className="text-xl font-bold leading-tight mt-1 text-gray-900">
                    {courseData.name}
                  </h1>
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <FaUserCircle /> {mentor.name}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaUsers />{" "}
                      {totalStudentsInCourse.toLocaleString("id-ID") ||
                        "0"}{" "}
                      Siswa
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mt-2 border-t border-gray-200/80 pt-2">
                    {courseData.about}
                  </p>
                </div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {step === 2 && hasBatches && (
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
                    {batchOptions.map((batch) => {
                      const isFull =
                        batch.status?.trim().toLowerCase() === "penuh";
                      const filledPercentage =
                        ((batch?.students_count || 0) / (batch?.quota || 1)) * 100;
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
                              Mulai: {formatDate(batch.start_date)}
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
                                  {batch?.students_count || 0}/
                                  {batch?.quota || 0} terisi
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
                            plan.is_popular
                              ? "border-2 border-blue-500"
                              : "border border-white/20"
                          }`}
                        ></div>
                        <div className="relative z-10 flex flex-col h-full">
                          {plan.is_popular && (
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
                            Akses selama {plan.duration} hari
                          </p>
                          <ul className="space-y-3 text-gray-700 mb-8 flex-grow">
                            {plan.features?.map((feature, i) => (
                              <li key={i} className="flex items-center gap-3">
                                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                                <span>{feature.description}</span>
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
                      disabled={!hasBatches}
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
                        {hasBatches && (
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
                    ) : hasBatches ? (
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
