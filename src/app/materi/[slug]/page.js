"use client";

import { useState, useEffect, useRef, useCallback } from "react"; // Remove useContext
import { motion } from "framer-motion";
import { FiAward } from "react-icons/fi";
import { useParams, useRouter } from "next/navigation";
import "./materi.css";
import AnimatedContent from "@/components/animatedcontent.jsx";
import SplitText from "@/components/splittext.jsx";
import CountUp from "@/components/countup.jsx";
import MateriSkeleton from "@/components/MateriSkeleton.jsx";
import api, { getMateriBySlug, createQuizAttempt, getQuizAttemptsByContent } from "@/lib/apiService"; // Add createQuizAttempt, getQuizAttemptsByContent
import { useAuth } from "@/context/AuthContext"; // Import useAuth hook

const passingScore = 70;

export default function MateriPage() {
  const { user } = useAuth(); // Use useAuth hook
  const userId = user?.id || 123; // Use user.id if available, otherwise fallback to 123
  const params = useParams();
  const router = useRouter();
  const { slug } = params;

  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarScrolled, setSidebarScrolled] = useState(false);
  const [openSections, setOpenSections] = useState({}); // Changed to empty object

  const [courseData, setCourseData] = useState(null);
  const [currentContent, setCurrentContent] = useState(null);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [currentContentId, setCurrentContentId] = useState(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const [history, setHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const mainContentRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!slug) return;
      console.log("Fetching course data for slug:", slug);
      setIsLoading(true);
      try {
        const response = await getMateriBySlug(slug);
        if (response && response.status === "success") {
          setCourseData(response.data);
          // Set initial content
          if (response.data.sections && response.data.sections.length > 0) {
            const firstSection = response.data.sections[0];
            setCurrentSectionId(firstSection.id);
            setOpenSections((prev) => ({ ...prev, [firstSection.id]: true })); // Open the first section
            if (firstSection.contents && firstSection.contents.length > 0) {
              setCurrentContent(firstSection.contents[0]);
              setCurrentContentId(firstSection.contents[0].id);
            }
          }
        } else {
          console.error("Failed to fetch course data:", response.message);
          // Optionally, redirect to an error page or show a user-friendly message
          router.push("/courses"); // Example: redirect to courses page
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        router.push("/courses"); // Example: redirect to courses page
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseData();
  }, [slug, router]); // Add router to dependency array

  const handleSidebarScroll = useCallback(() => {
    if (sidebarRef.current) {
      setSidebarScrolled(sidebarRef.current.scrollTop > 10);
    }
  }, []);

  useEffect(() => {
    if (isLoading || !courseData) return; // Depend on courseData being loaded
    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener("scroll", handleSidebarScroll);
      return () => {
        sidebar.removeEventListener("scroll", handleSidebarScroll);
      };
    }
  }, [isLoading, courseData, handleSidebarScroll]); // Add courseData to dependency array

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const handleContentClick = (content) => {
    setCurrentContent(content);
    setCurrentContentId(content.id);
    setSidebarOpen(false); // Close sidebar on mobile after selection
    // Reset quiz state when content changes
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizStartTime(null);
    setFinalScore(0);
  };

  const initializeQuiz = () => {
    if (!currentContent || !currentContent.quiz) return; // Only initialize if quiz data exists
    setQuizStartTime(new Date());
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizFinished(false);
    setFinalScore(0);
    document.getElementById("startQuizContainer").classList.add("hidden");
    document.getElementById("quiz-section").classList.remove("hidden");
  };

  const handleQuizSubmit = async () => { // Make it async
    if (!currentContent || !currentContent.quiz) return;
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
      user_id: userId, // This should come from AuthContext
      quiz_id: currentContent.quiz.id,
      start_time: quizStartTime.toISOString(),
      end_time: endTime.toISOString(),
      score: calculatedScore,
      passed: calculatedScore >= passingScore,
      // answers: Object.keys(userAnswers).map((questionId) => ({
      //   question_id: parseInt(questionId),
      //   question_option_id: userAnswers[questionId],
      // })),
    };
    console.log("Mengirim data ke backend:", payload);
    try {
      const response = await createQuizAttempt(payload);
      if (response.status === 'success') {
        console.log("Quiz attempt saved successfully:", response.data);
        loadQuizHistory(); // Refresh history after successful submission
      } else {
        console.error("Failed to save quiz attempt:", response.message);
        alert("Gagal menyimpan hasil kuis: " + (response.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving quiz attempt:", error);
      alert("Terjadi kesalahan saat menyimpan hasil kuis.");
    }
  };

  const loadQuizHistory = useCallback(async () => {
    console.log("Attempting to load quiz history...");
    console.log("Dependencies:", { userId, quizId: currentContent?.quiz?.id, currentSectionId, currentContentId });

    if (!userId || !currentContent?.quiz?.id || !currentSectionId || !currentContentId) {
      console.log("Skipping quiz history load due to missing dependencies.");
      setHistory([]); // Ensure history is cleared if dependencies are missing
      return;
    }
    try {
      const response = await getQuizAttemptsByContent(currentSectionId, currentContentId);
      console.log("Quiz attempts API response (raw):", response); // Log raw response
      // Check for HTTP status 200 and API's internal 'status: "success"'
      if (response && response.status === 200 && response.data && response.data.status === 'success') {
        console.log("Setting history with:", response.data.data); // Log what's being set
        setHistory(response.data.data); // Access the nested 'data' array
      } else {
        console.error("Failed to fetch quiz attempts:", response?.data?.message || "Unknown error", response); // Log full response object
        setHistory([]);
      }
    } catch (error) {
      console.error("Error fetching quiz attempts (caught):", error); // Log caught error
      setHistory([]);
    }
  }, [userId, currentContent?.quiz?.id, currentSectionId, currentContentId]);

  const showHistoryDetail = async (attemptId) => {
    console.log(`Fetching details for attempt ID: ${attemptId}`);
    const attempt = history.find((h) => h.id === attemptId);
    if (!attempt) return;

    const detailedData = {
      attempt_id: attempt.id,
      answers: attempt.studentAnswers
        .map((sa) => {
          const question = currentContent.quiz.questions.find(
            (q) => q.id === sa.question_id
          );
          if (!question) {
            console.error(`Question with ID ${sa.question_id} not found.`);
            return null;
          }
          const correctOption = question.options.find((o) => o.is_correct);
          return {
            question_id: sa.question_id,
            question_text: question.question_text,
            selected_option_id: sa.question_option_id,
            correct_option_id: correctOption ? correctOption.id : null,
          };
        })
        .filter(Boolean), // Remove null entries if a question wasn't found
    };

    setModalContent(detailedData);
    setIsModalOpen(true);
  };

  useEffect(() => {
    console.log("Quiz history useEffect triggered.");
    console.log("useEffect dependencies:", { currentContent, loadQuizHistory, currentSectionId, currentContentId });
    if (currentContent && currentContent.quiz && currentSectionId && currentContentId) {
      loadQuizHistory();
    }
  }, [currentContent, loadQuizHistory, currentSectionId, currentContentId]);

  const markContentAsComplete = async () => {
    if (!courseData || !currentContent) {
      alert("Course data or current content is not available.");
      return;
    }
    try {
      const res = await api.post(
        `/courses/${courseData.id}/contents/${currentContent.id}/complete`
      );
      if (res?.data?.message === "Content marked as complete") {
        alert("Konten berhasil ditandai selesai!");
        // Optionally, refresh course data or update UI to reflect completion
        // For example, refetch course data to update completion status in sidebar
        // fetchCourseData(); // This would require moving fetchCourseData outside useEffect or passing it down
      } else {
        alert(
          "Gagal menandai konten selesai: " +
            (res?.data?.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error marking content as complete:", error);
      alert("Terjadi kesalahan saat menandai konten selesai.");
    }
  };

  const renderCurrentQuestion = () => {
    if (
      !currentContent ||
      !currentContent.quiz ||
      !currentContent.quiz.questions ||
      currentContent.quiz.questions.length === 0
    ) {
      return null;
    }
    const item = currentContent.quiz.questions[currentQuestionIndex];

    if (!item) {
      return null;
    }

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

  if (isLoading || !courseData || !currentContent) {
    return <MateriSkeleton />;
  }

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
            {courseData &&
              courseData.sections.map((section) => (
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
                      {section.contents.map((content) => (
                        <a
                          key={content.id}
                          onClick={() => handleContentClick(content)}
                          className={`flex items-center p-3 space-x-3 text-sm rounded-lg cursor-pointer ${
                            currentContentId === content.id
                              ? "font-semibold text-blue-800 border-l-4 border-blue-500 bg-blue-50"
                              : "text-gray-600 hover:bg-blue-50"
                          }`}
                        >
                          <svg
                            className={`flex-shrink-0 w-5 h-5 ${
                              currentContentId === content.id
                                ? "animate-pulse"
                                : "text-gray-400"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.523 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <span>{content.name}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
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
                  console.log("Raw video src from API:", videoSrcRaw);
                  if (!videoSrcRaw) return null;

                  let videoSrc = videoSrcRaw;
                  try {
                    const url = new URL(videoSrcRaw);
                    let videoId = null;

                    if (
                      (url.hostname === "www.youtube.com" ||
                        url.hostname === "youtube.com") &&
                      url.pathname === "/watch"
                    ) {
                      videoId = url.searchParams.get("v");
                    } else if (url.hostname === "youtu.be") {
                      videoId = url.pathname.slice(1);
                    }

                    console.log("Extracted video ID:", videoId);

                    if (videoId) {
                      videoSrc = `https://www.youtube.com/embed/${videoId}`;
                    }
                  } catch (error) {
                    console.error(
                      "Could not parse video URL:",
                      videoSrcRaw,
                      error
                    );
                  }

                  console.log("Final iframe src:", videoSrc);

                  return (
                    <iframe
                      className="w-full h-full"
                      src={videoSrc}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  );
                })()}
              </div>
            )}

            <div className="px-4 sm:px-6 md:px-8 lg:px-16">
              <div className="p-8 mt-8 bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl">
                <div
                  className="leading-relaxed prose prose-slate text-gray-700 max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: currentContent.content,
                  }}
                ></div>
              </div>

              {currentContent.attachment && currentContent.attachment.file && (
                <div className="mt-6 flex justify-start p-2 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm"> {/* Reduced padding for smaller box */}
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
                      }`}</div>
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
                      {console.log("History array content:", history)}
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
                <motion.button
                  onClick={markContentAsComplete}
                  className="flex items-center px-6 py-3 space-x-2 font-semibold text-white rounded-lg shadow-lg bg-gradient-to-r from-green-400 to-blue-500"
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                    boxShadow: "0px 10px 20px rgba(16, 185, 129, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>Tandai Selesai</span>
                </motion.button>
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
}
