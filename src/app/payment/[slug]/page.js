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
  FaInfoCircle,
} from "react-icons/fa";
import Image from "next/image";
import { getCourseBySlug, createTransaction } from "@/lib/apiService";
import { ensureAbsoluteUrl } from "@/lib/urlHelpers";
import "../payment.css";
import DetailCourseSkeleton from "@/components/DetailCourseSkeleton";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Toast from "@/components/Toast"; // Import Toast

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
  const { isAuthLoading } = useAuth();
  const router = useRouter();
  const resolvedParams = React.use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [summary, setSummary] = useState({
    planPrice: 0,
    taxAmount: 0,
    totalAmount: 0,
  });
  const [isReadyToPay, setIsReadyToPay] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // State for Toast and Inline Error
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [inlineError, setInlineError] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };


  useEffect(() => {
    const fetchCourseData = async () => {
      if (!resolvedParams.slug) return;
      setIsLoading(true);
      try {
        const data = await getCourseBySlug(resolvedParams.slug);
        if (data && data.status === "success") {
          setCourseData(data.data);
        } else {
          console.error("Failed to fetch course data:", data);
          setCourseData(null);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        setCourseData(null);
      } finally {
        setIsLoading(false);
      }
    };
    if(!isAuthLoading) {
        fetchCourseData();
    }
  }, [resolvedParams.slug, isAuthLoading]);




  const batchOptions = courseData?.batches || [];
  const pricingOptions = courseData?.pricings || [];
  const hasBatches = courseData?.has_batch;

  const handlePayment = React.useCallback(async () => {
    setInlineError(null); // Reset inline error on new attempt
    if (!isReadyToPay || isProcessingPayment) {
      setInlineError("Silakan pilih salah satu opsi yang tersedia untuk melanjutkan.");
      return;
    }
    setIsProcessingPayment(true);
    const payload = {
      course_id: courseData.id,
      pricing_id: selectedPlanId,
      course_batch_id: hasBatches ? selectedBatchId : null,
    };
    try {
      const response = await createTransaction(payload);

      if (summary.totalAmount === 0) {
        // Logika baru untuk kursus gratis, disesuaikan dengan dokumentasi
        if (response.status === "success") { // Cukup periksa status sukses umum
          showToast("Anda berhasil terdaftar di kursus ini!", "success");
          router.push(`/payment-success/${response.data.booking_trx_id}`); // booking_trx_id dijamin ada
        } else {
          console.error("Failed to enroll in free course:", response);
          showToast(response.message || "Gagal mendaftar ke kursus gratis. Silakan coba lagi.", "error");
        }
      } else {
        // Alur pembayaran Midtrans yang sudah ada untuk kursus berbayar
        if (response.status === "success" && response.data.snap_token) {
          if (window.snap) {
            window.snap.pay(response.data.snap_token, {
              onSuccess: function (result) {
                console.log("Payment successful:", result);
                showToast("Pembayaran berhasil!", "success");
                router.push(`/payment-success/${response.data.booking_trx_id}`);
              },
              onPending: function (result) {
                console.log("Payment pending:", result);
                showToast("Pembayaran Anda sedang diproses.", "info");
                router.push(`/payment-success/${response.data.booking_trx_id}`);
              },
              onError: function (result) {
                console.error("Payment error:", result);
                showToast("Pembayaran gagal. Silakan coba lagi.", "error");
              },
              onClose: function () {
                console.log("Payment popup closed by user.");
                showToast("Anda menutup jendela pembayaran sebelum menyelesaikan transaksi.", "warning");
              },
            });
          }
        } else {
          const errorMessage = response.message || "Gagal memulai pembayaran. Silakan coba lagi.";
          console.error("Failed to initiate Midtrans payment:", response);
          showToast(errorMessage, "error");
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat membuat transaksi.";
      console.error("Error creating transaction:", error);
      showToast(errorMessage, "error");
    } finally {
      setIsProcessingPayment(false);
    }
  }, [isReadyToPay, isProcessingPayment, courseData, selectedPlanId, hasBatches, selectedBatchId, router, summary.totalAmount]);

  useEffect(() => {
    if (!courseData) return;

    // Reset inline error when selection changes
    setInlineError(null);

    let currentPrice = 0;
    let isReady = false;

    if (hasBatches) {
        if (selectedBatchId) {
            const batch = batchOptions.find((b) => b.id === selectedBatchId);
            if (batch?.pricing) {
                if (selectedPlanId !== batch.pricing.id) {
                    setSelectedPlanId(batch.pricing.id);
                }
                currentPrice = batch.pricing.price;
                isReady = true;
            }
        }
    } else {
        if (selectedPlanId) {
            const plan = pricingOptions.find((p) => p.id === selectedPlanId);
            if (plan) {
                currentPrice = plan.price;
                isReady = true;
            }
        }
    }

    setIsReadyToPay(isReady);

    if (isReady && currentPrice > 0) {
        const tax = Math.round(currentPrice * 0.12); // 12% tax
        const total = currentPrice + tax;
        setSummary({
            planPrice: currentPrice,
            taxAmount: tax,
            totalAmount: total,
        });
    } else {
        setSummary({ planPrice: 0, taxAmount: 0, totalAmount: 0 });
    }
  }, [selectedBatchId, selectedPlanId, courseData, setSelectedPlanId, setIsReadyToPay, setSummary]);

  const renderContent = () => {
    if (isLoading || isAuthLoading) {
        return <DetailCourseSkeleton />;
    }
    if (!courseData) {
        return (
          <div className="flex items-center justify-center h-screen text-center">
            <div>
              <h2 className="text-2xl font-bold">Kursus Tidak Ditemukan</h2>
              <p className="text-gray-600">Kursus yang Anda cari tidak ada atau telah dihapus.</p>
              <a href="/courses" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
                Kembali ke Daftar Kursus
              </a>
            </div>
          </div>
        );
    }

    const mentor = courseData?.mentor || courseData?.mentors?.[0]?.user || courseData?.mentors?.[0] || { name: "N/A" };
    const selectedBatch = courseData?.batches?.find((b) => b.id === selectedBatchId);
    const selectedPlan = courseData?.pricings?.find((p) => p.id === selectedPlanId);
    const selectedPlanName = courseData?.has_batch ? selectedBatch?.name : selectedPlan?.name;
    const totalStudentsInCourse = courseData?.batches?.reduce((sum, batch) => sum + Number(batch.students_count || 0), 0);
  
  
    return (
      <div className="relative min-h-screen font-sans bg-gray-50 pt-16 px-2 sm:px-6 md:px-8 lg:px-16">
        <Toast toast={toast} setToast={setToast} />
        <main className="container mx-auto py-8 relative z-10">
          <motion.div className="grid lg:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div className="lg:col-span-2 space-y-6" variants={containerVariants}>
              <motion.div className="relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6" variants={itemVariants}>
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
                    <p className="text-sm font-semibold text-blue-700">{courseData.category?.name}</p>
                    <h1 className="text-xl font-bold leading-tight mt-1 text-gray-900">{courseData.name}</h1>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <FaUserCircle /> {mentor.name}
                      </span>
                      {totalStudentsInCourse > 0 && (
                          <span className="flex items-center gap-1.5">
                              <FaUsers /> {totalStudentsInCourse.toLocaleString("id-ID")} Siswa
                          </span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mt-2 border-t border-gray-200/80 pt-2">{courseData.about}</p>
                  </div>
                </div>
              </motion.div>
  
              {hasBatches ? (
                <motion.div key="step-batch" className="relative p-6 overflow-hidden bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-teal-300 rounded-full blur-3xl opacity-30"></div>
                  <h2 className="relative z-10 text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <FaCalendarAlt className="h-6 w-6 text-teal-500" /> Pilih Batch Tersedia
                  </h2>
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {batchOptions
                      .map((batch) => {
                      const isFull = batch.status?.trim().toLowerCase() === "penuh" || Number(batch.students_count) >= Number(batch.quota);
                      const filledPercentage = (Number(batch.students_count || 0) / Number(batch.quota || 1)) * 100;
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const isExpired = new Date(batch.start_date) < today;
                      const isRegistered = !!batch.terdaftar;

                      return (
                        <motion.div
                          key={batch.id}
                          className={`relative p-5 border-2 rounded-2xl transition-all h-full flex flex-col ${
                            isFull || isExpired || isRegistered ? "bg-gray-100/80 border-gray-200 text-gray-500 cursor-not-allowed" : "cursor-pointer bg-white/60 hover:border-blue-400"
                          } ${selectedBatchId === batch.id ? "border-blue-500 bg-blue-50/80 shadow-xl" : ""}`}
                          whileHover={{ scale: isFull || isExpired || isRegistered ? 1 : 1.03 }}
                          onClick={() => !isFull && !isExpired && !isRegistered && setSelectedBatchId(batch.id)}
                        >
                          {selectedBatchId === batch.id && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 text-blue-500">
                              <FaCheckCircle size={20}/>
                            </motion.div>
                          )}
                           {isRegistered && (
                                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                  Terdaftar
                                </div>
                              )}
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-lg text-gray-800 pr-4">{batch.name}</h4>
                            <div className={`flex items-center gap-2 text-xs font-semibold py-1 px-2.5 rounded-full ${isFull ? "bg-red-100 text-red-700" : isExpired ? "bg-gray-200 text-gray-700" : "bg-green-100 text-green-700"}`}>
                              <div className={`w-2 h-2 rounded-full ${isFull ? "bg-red-500" : isExpired ? "bg-gray-500" : "bg-green-500"}`}></div>
                              {isFull ? 'Penuh' : isExpired ? 'Ditutup' : batch.status}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mb-1 flex items-center gap-2"><FaUserCircle />{batch.mentor?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-500 mb-3 flex items-center gap-2"><FaCalendarAlt />{formatDate(batch.start_date)} - {formatDate(batch.end_date)}</p>
  
                          <div className="mt-auto">
                            <div className="text-2xl font-bold text-blue-600 mb-4">
                              {formatRupiah(batch.pricing?.price || 0)}
                            </div>
                            {!(isFull || isExpired || isRegistered) && (
                              <div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                  <motion.div className={`h-2.5 rounded-full ${filledPercentage > 80 ? "bg-red-500" : "bg-blue-500"}`} style={{ width: `${filledPercentage}%` }}></motion.div>
                                </div>
                                <p className="text-xs text-gray-500 text-right">{batch?.students_count || 0}/{batch?.quota || 0} terisi</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="step-ondemand" className="relative p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <FaGift className="h-6 w-6 text-purple-500" /> Pilih Paket Akses
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pricingOptions.map((plan) => (
                      <motion.div
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${selectedPlanId === plan.id ? "scale-105 shadow-2xl" : "opacity-80 shadow-xl hover:opacity-100"}`}
                        whileHover={{ scale: selectedPlanId === plan.id ? 1.05 : 1.02 }}
                      >
                        <div className={`absolute inset-0 rounded-2xl border-4 ${selectedPlanId === plan.id ? "border-blue-500" : "border-transparent"}`}></div>
                        <div className={`absolute inset-0 bg-white/60 backdrop-blur-xl rounded-2xl ${plan.is_popular ? "border-2 border-blue-500" : "border border-white/20"}`}></div>
                        <div className="relative z-10 flex flex-col h-full">
                          {plan.is_popular && (
                            <div className="absolute -top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                              <FaStar size={12} /> Populer
                            </div>
                          )}
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                          <p className="text-3xl font-extrabold text-blue-600 mb-4">{formatRupiah(plan.price)}</p>
                          <p className="text-sm text-gray-500 mb-6">
                            {plan.duration === 0 ? "Akses Selamanya" : `Akses selama ${plan.duration} hari`}
                          </p>
                          <ul className="space-y-3 text-gray-700 mb-8 flex-grow">
                            {plan.features?.map((feature, i) => (
                              <li key={i} className="flex items-center gap-3">
                                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                                <span>{feature.description}</span>
                              </li>
                            ))}
                          </ul>
                          <div className={`mt-auto w-full text-center py-2 rounded-lg font-semibold ${selectedPlanId === plan.id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}>
                            {selectedPlanId === plan.id ? "Paket Terpilih" : "Pilih Paket"}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
  
            <motion.div variants={itemVariants}>
              <div className="relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl sticky top-24">
                <div className="relative z-10 p-6 border-b border-gray-200/80">
                  <h2 className="text-xl font-bold text-gray-900">Ringkasan Pesanan</h2>
                </div>
                <div className="relative z-10 p-6 space-y-4 min-h-[280px]">
                  <AnimatePresence mode="wait">
                    {!isReadyToPay ? (
                      <motion.div key="empty" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center justify-center text-center text-gray-500 h-full pt-8">
                        <FaInfoCircle size={32} className="mb-4 text-blue-500" />
                        <p className="text-sm font-medium">
                          {hasBatches ? "Pilih batch untuk melihat rincian pesanan." : "Pilih paket untuk melihat rincian pesanan."}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pilihan</span>
                            <span className="font-medium text-gray-800">{selectedPlanName || "-"}</span>
                          </div>
                          <hr className="pt-2 border-gray-200/80" />
                          <div className="flex justify-between">
                            <span className="text-gray-600">Harga</span>
                            <span className="text-gray-700"><AnimatedPrice value={summary.planPrice} /></span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">PPN (12%)</span>
                            <span className="text-gray-700"><AnimatedPrice value={summary.taxAmount} /></span>
                          </div>
                        </div>
                        <hr className="my-4 border-gray-200/80" />
                        <div className="flex justify-between items-center text-lg font-bold">
                          <span className="text-gray-800">Total</span>
                          <span className="text-blue-600 text-xl"><AnimatedPrice value={summary.totalAmount} /></span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="relative z-10 p-6 border-t border-gray-200/80">
                  {inlineError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded-lg text-center"
                    >
                      {inlineError}
                    </motion.div>
                  )}
                  <motion.div animate={isReadyToPay ? { scale: [1, 1.03, 1] } : {}} transition={isReadyToPay ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : {}} className="rounded-lg shadow-lg">
                    <button
                      onClick={handlePayment}
                      disabled={!isReadyToPay || isProcessingPayment}
                      className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-colors duration-300 transform ${isReadyToPay && !isProcessingPayment ? "hover:bg-blue-700" : "opacity-50 cursor-not-allowed"}`}
                    >
                      {isProcessingPayment ? (
                        <span className="flex items-center justify-center gap-2">
                          Memproses<span className="loading-dots"><span className="dot">.</span><span className="dot">.</span><span className="dot">.</span></span>
                        </span>
                      ) : isReadyToPay ? (
                        <span className="flex items-center justify-center gap-2">
                          <FaRocket /> Bayar <AnimatedPrice value={summary.totalAmount} />
                        </span>
                      ) : hasBatches ? (
                        "Pilih Batch"
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

  return (
    <ProtectedRoute>
      {renderContent()}
    </ProtectedRoute>
  )
}