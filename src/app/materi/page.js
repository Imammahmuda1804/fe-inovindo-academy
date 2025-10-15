/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiAward } from "react-icons/fi";
import "./materi.css";
import AnimatedContent from "@/components/animatedcontent.jsx";
import SplitText from "@/components/splittext.jsx";
import CountUp from "@/components/countup.jsx";
import MateriSkeleton from "@/components/MateriSkeleton.jsx";

const quizId = 1;
const userId = 123;
const passingScore = 70;

const quizData = [
  {
    id: 101,
    question: "Apa prinsip utama dalam desain grafis?",
    options: [
      { id: 201, text: "Keseimbangan, Kontras, Hierarki, ..." },
      { id: 202, text: "Warna, Font, Gambar" },
      { id: 203, text: "Ukuran, Bentuk, Tekstur" },
    ],
    answer_option_id: 201,
  },
  {
    id: 102,
    question: "Fungsi utama pengulangan dalam desain adalah?",
    options: [
      { id: 204, text: "Membuat desain lebih ramai" },
      { id: 205, text: "Menciptakan kesatuan visual" },
      { id: 206, text: "Menambah warna" },
    ],
    answer_option_id: 205,
  },
  {
    id: 103,
    question: "Apa itu hierarki dalam desain?",
    options: [
      { id: 207, text: "Pengelompokan elemen berdasarkan warna" },
      { id: 208, text: "Pengaturan elemen berdasarkan tingkat kepentingan" },
      { id: 209, text: "Penggunaan font yang berbeda" },
    ],
    answer_option_id: 208,
  },
];

export default function MateriPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarScrolled, setSidebarScrolled] = useState(false);
  const [openSections, setOpenSections] = useState({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false,
    11: false,
    12: false,
  });

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
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSidebarScroll = () => {
    if (sidebarRef.current) {
      setSidebarScrolled(sidebarRef.current.scrollTop > 0);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener("scroll", handleSidebarScroll);
      return () => {
        sidebar.removeEventListener("scroll", handleSidebarScroll);
      };
    }
  }, [isLoading]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const initializeQuiz = () => {
    setQuizStartTime(new Date());
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizFinished(false);
    setFinalScore(0);
    document.getElementById("startQuizContainer").classList.add("hidden");
    document.getElementById("quiz-section").classList.remove("hidden");
  };

  const handleQuizSubmit = () => {
    const endTime = new Date();
    let score = 0;
    quizData.forEach((item) => {
      if (userAnswers[item.id] === item.answer_option_id) score++;
    });
    const calculatedScore = Math.round((score / quizData.length) * 100);
    setFinalScore(calculatedScore);
    setQuizFinished(true);

    const payload = {
      user_id: userId,
      quiz_id: quizId,
      start_time: quizStartTime.toISOString(),
      end_time: endTime.toISOString(),
      score: calculatedScore,
      passed: calculatedScore >= passingScore,
      answers: Object.keys(userAnswers).map((questionId) => ({
        question_id: parseInt(questionId),
        question_option_id: userAnswers[questionId],
      })),
    };
    console.log("Mengirim data ke backend:", payload);

    loadQuizHistory();
  };

  const loadQuizHistory = async () => {
    const dummyHistoryData = [
      { id: 1, score: 80, passed: true, created_at: "2025-09-15T10:30:00Z" },
      { id: 2, score: 66, passed: false, created_at: "2025-09-16T14:00:00Z" },
    ];
    setHistory(dummyHistoryData);
  };

  const showHistoryDetail = async (attemptId) => {
    console.log(`Fetching details for attempt ID: ${attemptId}`);
    const dummyDetailedData = {
      attempt_id: 1,
      answers: [
        {
          question_id: 101,
          question_text: "Apa prinsip utama dalam desain grafis?",
          selected_option_id: 201,
          correct_option_id: 201,
        },
        {
          question_id: 102,
          question_text: "Fungsi utama pengulangan dalam desain adalah?",
          selected_option_id: 204,
          correct_option_id: 205,
        },
        {
          question_id: 103,
          question_text: "Apa itu hierarki dalam desain?",
          selected_option_id: 208,
          correct_option_id: 208,
        },
      ],
    };
    setModalContent(dummyDetailedData);
    setIsModalOpen(true);
  };

  useEffect(() => {
    loadQuizHistory();
  }, []);

  const renderCurrentQuestion = () => {
    const item = quizData[currentQuestionIndex];
    return (
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <label className="block mb-4 text-lg font-medium text-gray-800">
          {item.question}
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
              <span className="text-gray-700">{opt.text}</span>
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

  if (isLoading) {
    return <MateriSkeleton />;
  }

  return (
    <div className="text-gray-800 flex flex-col font-['Inter'] pt-24 h-screen">
      <div className="relative flex flex-1 overflow-hidden">
        <aside
          ref={sidebarRef}
          className={`fixed inset-y-0 left-0 z-50 w-10/12 max-w-sm bg-white/50 backdrop-blur-xl border-r border-white/20 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-1/3 flex-shrink-0 overflow-y-auto custom-scrollbar p-8 pt-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <h2
            className={`text-xl font-extrabold text-gray-900 mb-4 sticky top-0 bg-transparent pt-8 pb-4 transition-all duration-300 ${sidebarScrolled ? "-translate-y-full opacity-0 pointer-events-none" : ""}`}>
            Daftar Materi
          </h2>

          <div className="space-y-2">
            <div>
              <button
                onClick={() => toggleSection(1)}
                className="flex items-center justify-between w-full px-3 py-2 font-semibold text-left text-gray-700 rounded-md hover:bg-blue-50"
              >
                <span>Pendahuluan Desain Grafis</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openSections[1] ? "rotate-180" : ""}`}
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
              {openSections[1] && (
                <div className="pl-3 mt-1 space-y-1">
                  <a
                    href="#"
                    className="flex items-center p-3 space-x-3 text-sm border-l-4 rounded-lg bg-emerald-50 text-emerald-800 border-emerald-500"
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span>1. Sejarah dan Perkembangan Desain</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center p-3 space-x-3 text-sm font-semibold text-blue-800 border-l-4 border-blue-500 rounded-lg bg-blue-50"
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 animate-pulse"
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
                    <span>2. Prinsip Dasar Desain Grafis</span>
                  </a>
                </div>
              )}
            </div>
            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={() => toggleSection(2)}
                className="flex items-center justify-between w-full px-3 py-2 font-semibold text-left text-gray-700 rounded-md hover:bg-blue-50"
              >
                <span>Software Desain</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openSections[2] ? "rotate-180" : ""}`}
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
              {openSections[2] && (
                <div className="pl-3 mt-1 space-y-1">
                  <a
                    href="#"
                    className="flex items-center p-3 space-x-3 text-sm text-gray-600 rounded-lg hover:bg-blue-50"
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>3. Pengenalan Adobe Photoshop</span>
                  </a>
                </div>
              )}
            </div>
            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={() => toggleSection(3)}
                className="flex items-center justify-between w-full px-3 py-2 font-semibold text-left text-gray-700 rounded-md hover:bg-blue-50"
              >
                <span>Tipografi & Layout</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openSections[3] ? "rotate-180" : ""}`}
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
              {openSections[3] && (
                <div className="pl-3 mt-1 space-y-1">
                  <a
                    href="#"
                    className="flex items-center p-3 space-x-3 text-sm text-gray-600 rounded-lg hover:bg-blue-50"
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>4. Anatomi Tipografi</span>
                  </a>
                </div>
              )}
            </div>
            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={() => toggleSection(4)}
                className="flex items-center justify-between w-full px-3 py-2 font-semibold text-left text-gray-700 rounded-md hover:bg-blue-50"
              >
                <span>Proyek Desain Akhir</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openSections[4] ? "rotate-180" : ""}`}
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
              {openSections[4] && (
                <div className="pl-3 mt-1 space-y-1">
                  <a
                    href="#"
                    className="flex items-center p-3 space-x-3 text-sm text-gray-600 rounded-lg hover:bg-blue-50"
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>5. Brainstorming Ide Proyek</span>
                  </a>
                </div>
              )}
            </div>
            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={() => toggleSection(5)}
                className="flex items-center justify-between w-full px-3 py-2 font-semibold text-left text-gray-700 rounded-md hover:bg-blue-50"
              >
                <span>Materi Tambahan 1</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openSections[5] ? "rotate-180" : ""}`}
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
              {openSections[5] && (
                <div className="pl-3 mt-1 space-y-1">
                  <a
                    href="#"
                    className="flex items-center p-3 space-x-3 text-sm text-gray-600 rounded-lg hover:bg-blue-50"
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>6. Materi Tambahan</span>
                  </a>
                </div>
              )}
            </div>
            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={() => toggleSection(6)}
                className="flex items-center justify-between w-full px-3 py-2 font-semibold text-left text-gray-700 rounded-md hover:bg-blue-50"
              >
                <span>Materi Tambahan 2</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openSections[6] ? "rotate-180" : ""}`}
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
              {openSections[6] && (
                <div className="pl-3 mt-1 space-y-1">
                  <a
                    href="#"
                    className="flex items-center p-3 space-x-3 text-sm text-gray-600 rounded-lg hover:bg-blue-50"
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>7. Materi Tambahan</span>
                  </a>
                </div>
              )}
            </div>
            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={() => toggleSection(7)}
                className="flex items-center justify-between w-full px-3 py-2 font-semibold text-left text-gray-700 rounded-md hover:bg-blue-50"
              >
                <span>Materi Tambahan 3</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openSections[7] ? "rotate-180" : ""}`}
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
              {openSections[7] && (
                <div className="pl-3 mt-1 space-y-1">
                  <a
                    href="#"
                    className="flex items-center p-3 space-x-3 text-sm text-gray-600 rounded-lg hover:bg-blue-50"
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>8. Materi Tambahan</span>
                  </a>
                </div>
              )}
            </div>
            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={() => toggleSection(8)}
                className="flex items-center justify-between w-full px-3 py-2 font-semibold text-left text-gray-700 rounded-md hover:bg-blue-50"
              >
                <span>Materi Tambahan 4</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openSections[8] ? "rotate-180" : ""}`}
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
              {openSections[8] && (
                <div className="pl-3 mt-1 space-y-1">
                  <a
                    href="#"
                    className="flex items-center p-3 space-x-3 text-sm text-gray-600 rounded-lg hover:bg-blue-50"
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>9. Materi Tambahan</span>
                  </a>
                </div>
              )}
            </div>
            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={() => toggleSection(9)}
                className="flex items-center justify-between w-full px-3 py-2 font-semibold text-left text-gray-700 rounded-md hover:bg-blue-50"
              >
                <span>Materi Tambahan 5</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openSections[9] ? "rotate-180" : ""}`}
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
              {openSections[9] && (
                <div className="pl-3 mt-1 space-y-1">
                  <a
                    href="#"
                    className="flex items-center p-3 space-x-3 text-sm text-gray-600 rounded-lg hover:bg-blue-50"
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>10. Materi Tambahan</span>
                  </a>
                </div>
              )}
            </div>
            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={() => toggleSection(10)}
                className="flex items-center justify-between w-full px-3 py-2 font-semibold text-left text-gray-700 rounded-md hover:bg-blue-50"
              >
                <span>Materi Tambahan 6</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openSections[10] ? "rotate-180" : ""}`}
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
              {openSections[10] && (
                <div className="pl-3 mt-1 space-y-1">
                  <a
                    href="#"
                    className="flex items-center p-3 space-x-3 text-sm text-gray-600 rounded-lg hover:bg-blue-50"
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>11. Materi Tambahan</span>
                  </a>
                </div>
              )}
            </div>
            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={() => toggleSection(11)}
                className="flex items-center justify-between w-full px-3 py-2 font-semibold text-left text-gray-700 rounded-md hover:bg-blue-50"
              >
                <span>Materi Tambahan 7</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openSections[11] ? "rotate-180" : ""}`}
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
              {openSections[11] && (
                <div className="pl-3 mt-1 space-y-1">
                  <a
                    href="#"
                    className="flex items-center p-3 space-x-3 text-sm text-gray-600 rounded-lg hover:bg-blue-50"
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>12. Materi Tambahan</span>
                  </a>
                </div>
              )}
            </div>
            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={() => toggleSection(12)}
                className="flex items-center justify-between w-full px-3 py-2 font-semibold text-left text-gray-700 rounded-md hover:bg-blue-50"
              >
                <span>Materi Tambahan 8</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openSections[12] ? "rotate-180" : ""}`}
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
              {openSections[12] && (
                <div className="pl-3 mt-1 space-y-1">
                  <a
                    href="#"
                    className="flex items-center p-3 space-x-3 text-sm text-gray-600 rounded-lg hover:bg-blue-50"
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>13. Materi Tambahan</span>
                  </a>
                </div>
              )}
            </div>
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

          <div>
            <div className="px-4 pt-4 sm:px-6 md:px-8 lg:px-16 lg:pt-8">
              <div className="flex items-center gap-4 py-2 mb-4">
                <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                  Pendahuluan Desain Grafis
                </span>
              </div>
              <h1 className="mt-2 mb-2 text-3xl font-extrabold text-gray-900 md:text-4xl">
                <SplitText text="Prinsip Dasar Desain Grafis" />
              </h1>
            </div>

            <div className="mb-6 aspect-video lg:rounded-2xl lg:overflow-hidden lg:mx-16 shadow-2xl shadow-blue-500/10">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/gzfQXUEGs34"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="px-4 sm:px-6 md:px-8 lg:px-16">
              <div className="p-8 mt-8 bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl">
                <div className="leading-relaxed prose prose-slate text-gray-700 max-w-none">
                  <p>
                    Dalam video ini, kita akan menyelami inti dari desain grafis
                    dengan mempelajari prinsip-prinsip fundamental yang menjadi
                    dasar dari setiap karya visual yang hebat. Memahami
                    konsep-konsep ini akan memungkinkan Anda untuk membuat
                    desain yang tidak hanya estetis, tetapi juga efektif dalam
                    menyampaikan pesan.
                  </p>
                  <h4 className="mt-6 mb-3 font-semibold text-gray-800">
                    Poin-poin utama yang akan dibahas:
                  </h4>
                  <ul className="space-y-2">
                    <li>
                      <b>Keseimbangan (Balance):</b> Distribusi visual elemen
                      dalam sebuah komposisi.
                    </li>
                    <li>
                      <b>Kontras (Contrast):</b> Penekanan perbedaan antara
                      elemen untuk menonjolkan bagian tertentu.
                    </li>
                    <li>
                      <b>Hierarki (Hierarchy):</b> Pengaturan elemen untuk
                      menunjukkan urutan kepentingannya.
                    </li>
                    <li>
                      <b>Pengulangan (Repetition):</b> Penggunaan kembali elemen
                      untuk menciptakan konsistensi.
                    </li>
                    <li>
                      <b>Kedekatan (Proximity):</b> Pengelompokan elemen yang
                      terkait untuk menciptakan hubungan visual.
                    </li>
                    <li>
                      <b>White Space (Ruang Negatif):</b> Ruang kosong di
                      sekitar elemen untuk keterbacaan.
                    </li>
                    <li>
                      <b>Kesatuan (Unity):</b> Bagaimana semua elemen bekerja
                      sama untuk menciptakan keseluruhan yang harmonis.
                    </li>
                  </ul>
                </div>
              </div>

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
                    quizData.length
                  }`}</div>
                </div>
                <div id="quizQuestionContainer" className="min-h-[18rem]">
                  {quizFinished ? renderQuizResult() : renderCurrentQuestion()}
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
                      style={{ opacity: currentQuestionIndex === 0 ? 0.5 : 1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Sebelumnya
                    </motion.button>

                    {currentQuestionIndex < quizData.length - 1 ? (
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
                          boxShadow: "0px 10px 20px rgba(16, 185, 129, 0.3)",
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
                      const formattedDate = date.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });
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

              <div className="flex justify-end py-8 mt-6">
                <motion.button
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
                  const question = quizData.find(
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
                              {opt.text}
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
