"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { FiAward, FiCheckCircle, FiCircle, FiLock } from "react-icons/fi";
import { useParams, useRouter } from "next/navigation";
import "./materi.css";
import AnimatedContent from "@/components/animatedcontent.jsx";
import SplitText from "@/components/splittext.jsx";
import CountUp from "@/components/countup.jsx";
import MateriSkeleton from "@/components/MateriSkeleton.jsx";
import ConfirmModal from "@/components/ConfirmModal.jsx";
import {
  getMateriBySlug,
  createQuizAttempt,
  markContentAsComplete,
  createCertificate,
  getMyCourses,
} from "@/lib/apiService";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";


const passingScore = 70;

export default function MateriPage() {
  const { user, isAuthLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { slug } = params;

  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarScrolled, setSidebarScrolled] = useState(false);
  const [openSections, setOpenSections] = useState({});

  const [courseData, setCourseData] = useState(null);
  const [currentContent, setCurrentContent] = useState(null);
  const [currentContentId, setCurrentContentId] = useState(null);
  const [isContentCompleted, setIsContentCompleted] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const [history, setHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isLockedByStartDate, setIsLockedByStartDate] = useState(false);
  const [batchStartDate, setBatchStartDate] = useState(null);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: ''});
  const [infoModal, setInfoModal] = useState({ isOpen: false, title: '', children: '', variant: 'info' });
  const [certificateConfirmModal, setCertificateConfirmModal] = useState({ isOpen: false });


  const mainContentRef = useRef(null);
  const sidebarRef = useRef(null);
  const isFirstLoad = useRef(true);

  const fetchCourseData = useCallback(
    async (isInitialLoad = false) => {
      if (!slug) return;
      if (isInitialLoad) setIsLoading(true);

      try {
        const response = await getMateriBySlug(slug);
        
        if (response && response.status === "success") {
          const rawCourseData = response.data;
          const activeBatchId = rawCourseData.active_batch_id;

          const validatedSections = rawCourseData.sections
            .slice()
            .sort((a, b) => a.position - b.position)
            .map(section => ({
                ...section,
                contents: section.contents
                    .slice()
                    .sort((a, b) => a.position - b.position)
                    .map(content => {
                        const relevantProgress = content.course_progress?.find(p => p.course_batch_id === activeBatchId);
                        const isTrulyCompleted = !!(relevantProgress && relevantProgress.is_completed);
                        return { ...content, is_completed: isTrulyCompleted };
                    })
            }));
        
          const validatedCourseData = { ...rawCourseData, sections: validatedSections };
          setCourseData(validatedCourseData);

          const myCourses = await getMyCourses();
          const currentCourseEnrollment = myCourses.find(
            (course) => course.slug === slug
          );

          if (currentCourseEnrollment) {
            setEnrollmentData(currentCourseEnrollment);

            if (currentCourseEnrollment.batch_info && currentCourseEnrollment.batch_info.start_date) {
              const startDate = new Date(currentCourseEnrollment.batch_info.start_date);
              const now = new Date();
              now.setHours(0, 0, 0, 0);

              if (startDate > now) {
                setIsLockedByStartDate(true);
                setBatchStartDate(startDate);
                if (isInitialLoad) setIsLoading(false);
                return;
              }
            }
          }

          let contentToSet = null;
          if (currentContentId) {
            for (const section of validatedCourseData.sections) {
              const foundContent = section.contents.find(
                (c) => c.id === currentContentId
              );
              if (foundContent) {
                contentToSet = foundContent;
                break;
              }
            }
          } else if (
            validatedCourseData.sections &&
            validatedCourseData.sections.length > 0
          ) {
            const firstSection = validatedCourseData.sections[0];
            setOpenSections((prev) => ({ ...prev, [firstSection.id]: true }));
            if (firstSection.contents && firstSection.contents.length > 0) {
              contentToSet = firstSection.contents[0];
              setCurrentContentId(contentToSet.id);
            }
          }

          if (contentToSet) {
            setCurrentContent(contentToSet);
          }
        } else {
          throw new Error(response?.message || "Gagal memuat data materi.");
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 401) {
            router.push('/login');
            return;
          }
          if (status === 403) {
            let title = "Akses Ditolak";
            let message = "Anda tidak memiliki izin untuk melihat materi ini.";
            if (data.message === "Akses Anda ke kursus ini telah kedaluwarsa.") {
              title = "Akses Kedaluwarsa";
              message = data.message;
            } else if (data.message === "You are not enrolled in this course.") {
              message = "Anda tidak terdaftar di kursus ini. Silakan beli kursus terlebih dahulu.";
            }
            setErrorModal({ isOpen: true, title, message });
          } else {
            setErrorModal({ isOpen: true, title: "Error", message: "Terjadi kesalahan saat memuat materi kursus." });
          }
        } else {
          setErrorModal({ isOpen: true, title: "Error", message: "Gagal terhubung ke server. Silakan coba lagi nanti." });
        }
        console.error("Error fetching course data:", error);
      } finally {
        if (isInitialLoad) setIsLoading(false);
      }
    },
    [slug, router, currentContentId]
  );

  useEffect(() => {
    if (!isAuthLoading) {
      fetchCourseData(isFirstLoad.current);
      isFirstLoad.current = false;
    }
  }, [slug, isAuthLoading, fetchCourseData]);

  useEffect(() => {
    if (currentContent) {
      setIsContentCompleted(!!currentContent.is_completed);
      if (
        currentContent.quiz &&
        Array.isArray(currentContent.quiz.quiz_attempts)
      ) {
        setHistory(currentContent.quiz.quiz_attempts);
      } else {
        setHistory([]);
      }
    }
  }, [currentContent]);

  const handleSidebarScroll = useCallback(() => {
    if (sidebarRef.current) {
      setSidebarScrolled(sidebarRef.current.scrollTop > 10);
    }
  }, []);

  useEffect(() => {
    if (isLoading || !courseData) return;
    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener("scroll", handleSidebarScroll);
      return () => sidebar.removeEventListener("scroll", handleSidebarScroll);
    }
  }, [isLoading, courseData, handleSidebarScroll]);

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const handleContentClick = (content, isLocked) => {
    if (isLocked) {
      setInfoModal({ 
        isOpen: true, 
        title: 'Materi Terkunci', 
        children: 'Selesaikan materi sebelumnya terlebih dahulu untuk membuka materi ini.', 
        variant: 'danger' 
      });
      return;
    }
    setCurrentContent(content);
setCurrentContentId(content.id);
    setSidebarOpen(false);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizStartTime(null);
    setFinalScore(0);
  };

  const initializeQuiz = () => {
    if (!currentContent?.quiz) return;
    setQuizStartTime(new Date());
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizFinished(false);
    setFinalScore(0);
    document.getElementById("startQuizContainer").classList.add("hidden");
    document.getElementById("quiz-section").classList.remove("hidden");
  };

  const handleQuizSubmit = async () => {
    if (!currentContent?.quiz) return;
    const endTime = new Date();
    let score = 0;
    currentContent.quiz.questions.forEach((item) => {
      const correctOption = item.options.find((opt) => opt.is_correct);
      if (correctOption && userAnswers[item.id] === correctOption.id) {
        score++;
      }
    });
    const calculatedScore = Math.round(
      (score / currentContent.quiz.questions.length) * 100
    );
    setFinalScore(calculatedScore);
    setQuizFinished(true);

    const payload = {
      quiz_id: currentContent.quiz.id,
      score: calculatedScore,
      start_time: quizStartTime.toISOString().slice(0, 19).replace("T", " "),
      end_time: endTime.toISOString().slice(0, 19).replace("T", " "),
      passed: calculatedScore >= passingScore,
      answers: Object.keys(userAnswers).map((questionId) => ({
        question_id: parseInt(questionId),
        question_option_id: userAnswers[questionId],
      })),
    };

    try {
      const response = await createQuizAttempt(payload);
      if (response.status === "success") {
        await fetchCourseData();
      } else {
        alert(
          "Gagal menyimpan hasil kuis: " + (response.message || "Unknown error")
        );
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan hasil kuis.");
    }
  };

  const toggleContentCompletion = async () => {
    if (!courseData || !currentContent || currentContent.is_completed) {
      console.error("Missing courseData, currentContent, or content already completed.");
      alert("Terjadi kesalahan: Data tidak lengkap atau materi sudah diselesaikan.");
      return;
    }

    const hasQuiz = !!currentContent.quiz;
    const hasPassedQuiz = history.some(attempt => attempt.passed);

    if (hasQuiz && !hasPassedQuiz) {
        setInfoModal({ 
          isOpen: true, 
          title: 'Kuis Belum Lulus', 
          children: 'Anda harus lulus kuis terlebih dahulu untuk menyelesaikan materi ini.', 
          variant: 'danger' 
        });
        return;
    }

    try {
        const res = await markContentAsComplete(courseData.id, currentContent.id, courseData.active_batch_id);

        if (res.data?.message === "Content marked as complete") {
            setInfoModal({ 
              isOpen: true, 
              title: 'Berhasil', 
              children: 'Materi berhasil ditandai selesai!', 
              variant: 'success' 
            });
            
            const newCourseData = JSON.parse(JSON.stringify(courseData));
            for (const section of newCourseData.sections) {
                const contentIndex = section.contents.findIndex(c => c.id === currentContent.id);
                if (contentIndex !== -1) {
                    section.contents[contentIndex].is_completed = true;
                    break;
                }
            }
            setCourseData(newCourseData);
            setCurrentContent({ ...currentContent, is_completed: true });
        } else {
            alert("Gagal menandai selesai: " + (res.data?.message || "Error"));
        }
    } catch (error) {
        console.error("Error marking content as complete:", error);
        alert("Terjadi kesalahan saat menandai materi selesai.");
    }
  };

  const proceedToCreateCertificate = async () => {
    setCertificateConfirmModal({ isOpen: false }); // Close the modal first
    if (!courseData || !currentContent || !enrollmentData || isFinishing) {
      console.error("Missing critical data for finishing course (enrollmentData).");
      alert("Terjadi kesalahan: Data penting (seperti data pendaftaran) tidak ditemukan untuk menyelesaikan kursus.");
      return;
    }

    setIsFinishing(true);

    try {
      let progressId;

      if (!currentContent.is_completed) {
        const res = await markContentAsComplete(
          courseData.id,
          currentContent.id,
          courseData.active_batch_id
        );
        progressId = res.data?.course_progress_id || res.data?.id;
        if (!progressId) {
          throw new Error("Gagal mendapatkan ID progres kursus dari server setelah menyelesaikan materi. " + (res.data?.message || ""));
        }
      } else {
        progressId = enrollmentData.course_progress_id;
      }

      if (!progressId) {
        throw new Error("Tidak dapat menemukan ID progres kursus. Coba muat ulang halaman atau hubungi admin.");
      }

      const certificatePayload = {
        course_progress_id: progressId,
        course_batch_id: courseData.active_batch_id,
      };

      await createCertificate(certificatePayload);
      setInfoModal({
        isOpen: true,
        title: 'Selamat!',
        children: 'Anda telah menyelesaikan kursus ini. Sertifikat Anda sedang dibuat dan akan tersedia di halaman sertifikat.',
        variant: 'success',
        onConfirm: () => router.push('/certificates'),
        confirmText: 'Lihat Sertifikat',
        hideCancelButton: true,
      });

      // Optimistically update UI
      const newCourseData = JSON.parse(JSON.stringify(courseData));
      for (const section of newCourseData.sections) {
        const contentIndex = section.contents.findIndex((c) => c.id === currentContent.id);
        if (contentIndex !== -1) {
          section.contents[contentIndex].is_completed = true;
          break;
        }
      }
      setCourseData(newCourseData);
      setCurrentContent({ ...currentContent, is_completed: true });
    } catch (error) {
      console.error("Gagal menyelesaikan kursus atau membuat sertifikat:", error);
      const errorMessage = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join("\n") 
        : error.message || "Terjadi kesalahan. Silakan hubungi admin.";
      alert(error.response?.data?.errors ? `Gagal membuat sertifikat karena data tidak valid:\n${errorMessage}` : errorMessage);
    } finally {
      setIsFinishing(false);
    }
  };

  const handleFinishCourse = () => {
    setCertificateConfirmModal({
      isOpen: true,
      title: "Konfirmasi Pembuatan Sertifikat",
      children: "Nama yang tersimpan pada sertifikat adalah nama yang digunakan saat ini dan tidak bisa dirubah.",
      confirmText: "Lanjutkan",
      cancelText: "Ganti Nama",
      onConfirm: proceedToCreateCertificate,
      onClose: () => router.push('/settings'),
      variant: 'warning'
    });
  };


  const showHistoryDetail = (attemptId) => {
    const attempt = history.find((h) => h.id === attemptId);
    if (!attempt || !attempt.student_answers) return;

    const detailedData = {
      attempt_id: attempt.id,
      start_time: attempt.start_time,
      end_time: attempt.end_time,
      answers: attempt.student_answers
        .map((sa) => {
          const question = currentContent.quiz.questions.find(
            (q) => q.id === sa.question_id
          );
          if (!question) return null;
          const correctOption = question.options.find((o) => o.is_correct);
          return {
            question_id: sa.question_id,
            question_text: question.question_text,
            selected_option_id: sa.question_option_id,
            correct_option_id: correctOption ? correctOption.id : null,
          };
        })
        .filter(Boolean),
    };

    setModalContent(detailedData);
    setIsModalOpen(true);
  };

  const renderCurrentQuestion = () => {
    if (!currentContent?.quiz?.questions?.length) return null;
    const item = currentContent.quiz.questions[currentQuestionIndex];
    if (!item) return null;

    return (
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <label className="block mb-4 text-lg font-medium text-gray-800">
          {item.question_text}
        </label>
        <div className="space-y-3">
          {item.options.map((opt) => (
            <motion.label
              key={opt.id}
              className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-blue-50 cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400"
              whileHover={{ scale: 1.02, x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="radio"
                name={`q_${item.id}`}
                value={opt.id}
                className="w-4 h-4 mr-4 text-blue-600 focus:ring-blue-500"
                checked={userAnswers[item.id] === opt.id}
                onChange={(e) =>
                  setUserAnswers({
                    ...userAnswers,
                    [item.id]: parseInt(e.target.value),
                  })
                }
              />
              <span className="text-gray-700">{opt.option_text}</span>
            </motion.label>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderQuizResult = () => (
    <div className="flex flex-col items-center p-6 text-center rounded-lg">
      <FiAward
        className={`text-7xl mb-4 ${
          finalScore >= passingScore ? "text-green-500" : "text-red-500"
        }`}
      />
      <h4 className="text-2xl font-bold text-gray-800">Nilai Anda:</h4>
      <div
        className={`flex items-center justify-center text-6xl font-bold ${
          finalScore >= passingScore ? "text-green-600" : "text-red-600"
        } my-3`}
      >
        <CountUp to={finalScore} duration={2} />
      </div>
      <p className="mb-8 text-gray-600">
        {finalScore >= passingScore
          ? "Luar biasa! Anda berhasil menyelesaikan kuis ini."
          : "Jangan menyerah, coba lagi untuk hasil yang lebih baik."}
      </p>
      <motion.button
        onClick={initializeQuiz}
        className="px-8 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-lg"
        whileHover={{
          scale: 1.05,
          y: -2,
          boxShadow: "0px 10px 20px rgba(37, 99, 235, 0.3)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        Ulangi Kuis
      </motion.button>
    </div>
  );
  
  return (
    <ProtectedRoute>
      <ConfirmModal
        isOpen={infoModal.isOpen}
        title={infoModal.title}
        onConfirm={infoModal.onConfirm || (() => setInfoModal({ isOpen: false, title: '', children: '' }))}
        confirmText={infoModal.confirmText || "Tutup"}
        hideCancelButton={infoModal.hideCancelButton !== undefined ? infoModal.hideCancelButton : true}
        variant={infoModal.variant}
      >
        {infoModal.children}
      </ConfirmModal>

      <ConfirmModal
        isOpen={certificateConfirmModal.isOpen}
        title={certificateConfirmModal.title}
        onConfirm={certificateConfirmModal.onConfirm}
        confirmText={certificateConfirmModal.confirmText}
        onClose={certificateConfirmModal.onClose}
        cancelText={certificateConfirmModal.cancelText}
        variant={certificateConfirmModal.variant}
      >
        {certificateConfirmModal.children}
      </ConfirmModal>

      <ConfirmModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        onConfirm={() => router.push(`/detail-course/${slug}`)}
        confirmText="Beli Kelas Ini"
        onClose={() => router.push('/my-courses')}
        cancelText="Kelas Saya"
        variant="danger"
      >
        {errorModal.message}
      </ConfirmModal>

      <ConfirmModal
        isOpen={isLockedByStartDate}
        title="Kursus Belum Dimulai"
        onConfirm={() => router.push('/my-courses')}
        confirmText="Kembali ke Kursus Saya"
        showCancelButton={false}
        variant="info"
      >
        Kursus ini akan dimulai pada: <span className="font-bold">{batchStartDate ? new Date(batchStartDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</span>.
      </ConfirmModal>
      
      {isLockedByStartDate || errorModal.isOpen ? (
        <div className="flex items-center justify-center h-screen">
            {/* This will be shown when a modal is active, preventing skeleton flash */}
        </div>
        ) : (isAuthLoading || isLoading || !courseData || !currentContent) ? (
        <MateriSkeleton />
      ) : (
        (() => {
          const allContents = courseData.sections.flatMap((section) => section.contents);
          const lastContentOfCourse = allContents.length > 0 ? allContents[allContents.length - 1] : null;
          const isLastContent = currentContent.id === lastContentOfCourse?.id;

          return (
            <div className="text-gray-800 flex flex-col font-['Inter'] pt-24 h-screen">
              <div className="relative flex flex-1 overflow-hidden">
                <aside
                  ref={sidebarRef}
                  className={`fixed inset-y-0 left-0 z-50 w-10/12 max-w-sm bg-white/50 backdrop-blur-xl border-r border-white/20 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-1/3 flex-shrink-0 overflow-y-auto custom-scrollbar p-8 pt-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                  }`}
                >
                  <h2
                    className={`text-xl font-extrabold text-gray-900 mb-4 sticky top-0 bg-transparent pt-8 pb-4 transition-all duration-300 ${
                      sidebarScrolled
                        ? "-translate-y-full opacity-0 pointer-events-none"
                        : ""
                    }`}
                  >
                    Daftar Materi
                  </h2>
                  <div className="space-y-2">
                    {courseData.sections.map((section) => {
                        const sectionStartIndex = allContents.findIndex(
                          (c) => c.id === section.contents[0]?.id
                        );
                        if (sectionStartIndex > 0) {
                        }

                        return (
                          <div key={section.id}>
                            <button
                              onClick={() => toggleSection(section.id)}
                              className="flex items-center justify-between w-full px-3 py-2 font-semibold text-left text-gray-700 rounded-md hover:bg-blue-50"
                            >
                              <span>{section.name}</span>
                              <svg
                                className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${
                                  openSections[section.id] ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 9l-7 7-7-7"
                                ></path>
                              </svg>
                            </button>
                            {openSections[section.id] && (
                              <div className="pl-3 mt-1 space-y-1">
                                {section.contents.map((content) => {
                                  const contentIndex = allContents.findIndex(
                                    (c) => c.id === content.id
                                  );
                                  const isLocked = 
                                    contentIndex > 0 &&
                                    !allContents[contentIndex - 1].is_completed;

                                  const icon = isLocked ? (
                                    <FiLock className="flex-shrink-0 w-5 h-5 text-gray-400" />
                                  ) : content.is_completed ? (
                                    <FiCheckCircle className="flex-shrink-0 w-5 h-5 text-green-500" />
                                  ) : (
                                    <FiCircle className="flex-shrink-0 w-5 h-5 text-gray-400" />
                                  );

                                  return (
                                    <a
                                      key={content.id}
                                      onClick={() =>
                                        handleContentClick(content, isLocked)
                                      }
                                      className={`flex items-center p-3 space-x-3 text-sm rounded-lg ${
                                        isLocked
                                          ? "text-gray-400 cursor-not-allowed"
                                          : currentContentId === content.id
                                          ? "font-semibold text-blue-800 border-l-4 border-blue-500 bg-blue-50"
                                          : "text-gray-600 hover:bg-blue-50 cursor-pointer"
                                      }`}
                                    >
                                      {icon}
                                      <span>{content.name}</span>
                                    </a>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </aside>

                {sidebarOpen && (
                  <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                  ></div>
                )}

                <main
                  ref={mainContentRef}
                  id="main-content"
                  className="flex-1 w-full overflow-y-auto custom-scrollbar"
                >
                  <div className="sticky top-0 z-30 lg:hidden bg-white/80 backdrop-blur-lg">
                    <div className="px-4 py-4 border-b sm:px-6 border-gray-200">
                      <button
                        onClick={() => setSidebarOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 font-semibold text-blue-600 rounded-lg shadow-sm bg-white hover:bg-blue-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Buka Daftar Materi</span>
                      </button>
                    </div>
                  </div>

                  <div key={currentContent.id}>
                    <div className="px-4 pt-4 sm:px-6 md:px-8 lg:px-16 lg:pt-8">
                      <div className="flex items-center gap-4 py-2 mb-4">
                        <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                          {courseData.name}
                        </span>
                      </div>
                      <h1 className="mt-2 mb-2 text-3xl font-extrabold text-gray-900 md:text-4xl">
                        <SplitText text={currentContent.name} />
                      </h1>
                    </div>

                    {currentContent.video && currentContent.video.id_youtube && (
                      <div className="mb-6 aspect-video lg:rounded-2xl lg:overflow-hidden lg:mx-16 shadow-2xl shadow-blue-500/10">
                        {(() => {
                          const videoSrcRaw = currentContent.video.id_youtube;
                          if (!videoSrcRaw) return null;

                          let embedUrl = null;

                          try {
                            const url = new URL(videoSrcRaw);
                            let videoId = null;

                            if (url.hostname === "youtu.be") {
                              videoId = url.pathname.substring(1);
                            } else if (url.hostname === "www.youtube.com" || url.hostname === "youtube.com") {
                              if (url.searchParams.get("v")) {
                                videoId = url.searchParams.get("v");
                              } else if (url.pathname.startsWith("/live/")) {
                                videoId = url.pathname.split("/live/")[1];
                              }
                            }

                            if (videoId) {
                              const finalVideoId = videoId.split("?")[0];
                              embedUrl = `https://www.youtube.com/embed/${finalVideoId}`;
                            }
                          } catch (e) {
                            if (/^[a-zA-Z0-9_-]{11}$/.test(videoSrcRaw)) {
                              embedUrl = `https://www.youtube.com/embed/${videoSrcRaw}`;
                            } else {
                              console.error("Invalid YouTube URL or ID:", videoSrcRaw);
                            }
                          }

                          if (embedUrl) {
                            return (
                              <iframe
                                className="w-full h-full"
                                src={embedUrl}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            );
                          }

                          return null;
                        })()}
                      </div>
                    )}

                    <div className="px-4 sm:px-6 md:px-8 lg:px-16">
                      <div className="p-8 mt-8 bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl">
                        <div
                          className="leading-relaxed prose prose-slate text-gray-700 max-w-none"
                          dangerouslySetInnerHTML={{ __html: currentContent.content }}
                        ></div>
                      </div>

                      {currentContent.attachment && currentContent.attachment.file && (
                        <div className="mt-6 flex justify-start p-2 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm">
                          <a
                            href={currentContent.attachment.file}
                            download
                            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="font-medium">Unduh Dokumen</span>
                          </a>
                        </div>
                      )}

                      {currentContent.quiz && (
                        <>
                          <div
                            id="startQuizContainer"
                            className="p-8 mt-8 text-center bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl"
                          >
                            <h3 className="mb-2 text-xl font-bold text-gray-800">
                              Siap Menguji Pemahaman Anda?
                            </h3>
                            <p className="mb-6 text-gray-600">
                              Klik tombol di bawah ini untuk memulai kuis singkat.
                            </p>
                            <motion.button
                              id="startQuizBtn"
                              onClick={initializeQuiz}
                              className="px-8 py-3 text-lg font-semibold text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-blue-600 to-green-500"
                              whileHover={{
                                scale: 1.05,
                                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Mulai Kuis
                            </motion.button>
                          </div>

                          <div
                            className="hidden p-6 mt-8 bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl sm:p-8"
                            id="quiz-section"
                          >
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="text-xl font-bold text-gray-800">
                                Kuis Materi
                              </h3>
                              <div
                                id="quizCount"
                                className="font-medium text-gray-600"
                              >{`Soal ${currentQuestionIndex + 1} dari ${
                                currentContent.quiz.questions.length
                              }`}
                              </div>
                            </div>
                            <div id="quizQuestionContainer" className="min-h-[18rem]">
                              {quizFinished
                                ? renderQuizResult()
                                : renderCurrentQuestion()}
                            </div>
                            {!quizFinished && (
                              <div
                                id="quizNav"
                                className="flex flex-col items-center justify-between gap-4 mt-8 sm:flex-row sm:gap-2"
                              >
                                <motion.button
                                  onClick={() =>
                                    setCurrentQuestionIndex(currentQuestionIndex - 1)
                                  }
                                  className="w-full px-6 py-3 font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm sm:w-auto"
                                  disabled={currentQuestionIndex === 0}
                                  style={{
                                    opacity: currentQuestionIndex === 0 ? 0.5 : 1,
                                  }}
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Sebelumnya
                                </motion.button>
                                {currentQuestionIndex <
                                currentContent.quiz.questions.length - 1 ? (
                                  <motion.button
                                    onClick={() =>
                                      setCurrentQuestionIndex(currentQuestionIndex + 1)
                                    }
                                    className="w-full px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-lg sm:w-auto"
                                    whileHover={{
                                      scale: 1.05,
                                      y: -2,
                                      boxShadow: "0px 10px 20px rgba(37, 99, 235, 0.3)",
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Selanjutnya
                                  </motion.button>
                                ) : (
                                  <motion.button
                                    onClick={handleQuizSubmit}
                                    className="w-full px-6 py-3 font-semibold text-white rounded-lg shadow-lg bg-gradient-to-r from-emerald-500 to-green-600 sm:w-auto"
                                    whileHover={{
                                      scale: 1.05,
                                      y: -2,
                                      boxShadow:
                                        "0px 10px 20px rgba(16, 185, 129, 0.3)",
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Lihat Hasil
                                  </motion.button>
                                )}
                              </div>
                            )}
                          </div>

                          <div
                            id="quizHistoryContainer"
                            className="p-6 mt-8 bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl sm:p-8"
                          >
                            <h3 className="mb-6 text-xl font-bold text-gray-800">
                              Riwayat Pengerjaan Kuis
                            </h3>
                            <div id="quizHistoryList" className="space-y-4">
                              {history.length > 0 ? (
                                history.map((attempt) => {
                                  const date = new Date(attempt.created_at);
                                  const formattedDate = date.toLocaleDateString(
                                    "id-ID",
                                    {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  );
                                  const statusClass = attempt.passed
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800";
                                  const statusText = attempt.passed ? "Lulus" : "Gagal";
                                  return (
                                    <motion.div
                                      key={attempt.id}
                                      className="flex flex-col items-start justify-between gap-4 p-5 transition-shadow duration-300 border border-gray-200 rounded-xl sm:flex-row sm:items-center hover:shadow-md"
                                      whileHover={{
                                        y: -3,
                                        borderColor: "rgba(59, 130, 246, 0.5)",
                                      }}
                                    >
                                      <div>
                                        <p className="font-bold text-gray-800">
                                          Nilai:{" "}
                                          <span className="text-blue-600">
                                            {attempt.score}
                                          </span>
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {formattedDate}
                                        </p>
                                      </div>
                                      <div className="flex items-center w-full gap-4 sm:w-auto">
                                        <span
                                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusClass}`}
                                        >
                                          {statusText}
                                        </span>
                                        <button
                                          onClick={() => showHistoryDetail(attempt.id)}
                                          className="flex-grow px-4 py-2 text-sm text-center text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 sm:flex-grow-0"
                                        >
                                          Lihat Detail
                                        </button>
                                      </div>
                                    </motion.div>
                                  );
                                })
                              ) : (
                                <p className="italic text-gray-500">
                                  Anda belum memiliki riwayat pengerjaan untuk kuis ini.
                                </p>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      <div className="flex justify-end py-8 mt-6">
                        {isLastContent ? (
                          <motion.button
                            onClick={handleFinishCourse}
                            disabled={isFinishing || isContentCompleted}
                            className={`flex items-center px-6 py-3 space-x-2 font-semibold text-white rounded-lg shadow-lg ${
                              isContentCompleted
                                ? "bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed"
                                : "bg-gradient-to-r from-purple-500 to-indigo-600"
                            }`}
                            whileHover={!isContentCompleted ? {
                              scale: 1.05,
                              y: -2,
                              boxShadow: "0px 10px 20px rgba(139, 92, 246, 0.3)",
                            } : {}}
                            whileTap={!isContentCompleted ? { scale: 0.95 } : {}}
                          >
                            <FiAward className="w-5 h-5" />
                            <span>
                              {isFinishing
                                ? "Memproses..."
                                : isContentCompleted
                                ? "Kursus Selesai"
                                : "Selesaikan Kursus & Dapatkan Sertifikat"}
                            </span>
                          </motion.button>
                        ) : (
                          <motion.button
                            onClick={toggleContentCompletion}
                            disabled={isContentCompleted}
                            className={`flex items-center px-6 py-3 space-x-2 font-semibold text-white rounded-lg shadow-lg ${
                              isContentCompleted
                                ? "bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed"
                                : "bg-gradient-to-r from-green-400 to-blue-500"
                            }`}
                            whileHover={!isContentCompleted ? {
                              scale: 1.05,
                              y: -2,
                              boxShadow: "0px 10px 20px rgba(16, 185, 129, 0.3)",
                            }: {}}
                            whileTap={!isContentCompleted ? { scale: 0.95 } : {}}
                          >
                            {isContentCompleted ? (
                              <FiCheckCircle className="w-5 h-5" />
                            ) : (
                              <FiCircle className="w-5 h-5" />
                            )}
                            <span>
                              {isContentCompleted ? "Selesai" : "Tandai Selesai"}
                            </span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </main>
              </div>

              {isModalOpen && (
                <div
                  id="historyDetailModal"
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col"
                  >
                    <div className="flex items-center justify-between p-4 border-b">
                      <h3 className="text-lg font-bold text-gray-800">
                        Detail Pengerjaan Kuis
                      </h3>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-3xl text-gray-500 hover:text-gray-800"
                      >
                        &times;
                      </button>
                    </div>
                    <div
                      id="modalContent"
                      className="p-6 overflow-y-auto custom-scrollbar"
                    >
                      {modalContent && (
                        <div className="mb-6 pb-4 border-b border-gray-200">
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Waktu Mulai:</span>{" "}
                            {new Date(modalContent.start_time).toLocaleString("id-ID", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Waktu Selesai:</span>{" "}
                            {new Date(modalContent.end_time).toLocaleString("id-ID", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>
                      )}
                      {modalContent &&
                        modalContent.answers.map((ans, index) => {
                          const question = currentContent.quiz.questions.find(
                            (q) => q.id === ans.question_id
                          );
                          return (
                            <div
                              key={ans.question_id}
                              className="pb-6 mb-6 border-b last:border-b-0 border-gray-200"
                            >
                              <p className="mb-3 font-semibold text-gray-800">
                                {index + 1}. {ans.question_text}
                              </p>
                              <div className="space-y-2">
                                {question.options.map((opt) => {
                                  let indicatorClass =
                                    "border-gray-300 bg-gray-50 text-gray-700";
                                  if (opt.id === ans.correct_option_id) {
                                    indicatorClass =
                                      "border-green-500 bg-green-50 text-green-900 font-semibold";
                                  }
                                  if (
                                    opt.id === ans.selected_option_id &&
                                    opt.id !== ans.correct_option_id
                                  ) {
                                    indicatorClass =
                                      "border-red-500 bg-red-50 text-red-900 line-through";
                                  }
                                  return (
                                    <div
                                      key={opt.id}
                                      className={`p-3 rounded-lg border ${indicatorClass}`}
                                    >
                                      {opt.option_text}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          );
        })()
      )}
    </ProtectedRoute>
  );
}
