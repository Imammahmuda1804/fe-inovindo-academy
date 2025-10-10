"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaLock, FaUser, FaCamera } from "react-icons/fa";

import "./login.css";

const formVariants = {
  hidden: (direction) => ({
    opacity: 0,
    x: direction > 0 ? "100%" : "-100%",
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction < 0 ? "100%" : "-100%",
    transition: { duration: 0.4, ease: "easeInOut" },
  }),
};

const LoginForm = ({ onSwitch }) => (
  <motion.div
    key="login"
    custom={1}
    variants={formVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="absolute login-form"
  >
    <h1 className="mb-6 text-4xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text">
      Sign In
    </h1>
    <form action="#">
      <div className="relative mb-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <FaEnvelope className="w-5 h-5 text-gray-400" />
        </span>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-4 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      <div className="relative mb-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <FaLock className="w-5 h-5 text-gray-400" />
        </span>
        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      <Link href="/reset-password">
        <span className="block mb-6 text-sm text-blue-600 cursor-pointer hover:underline">
          Forgot your password?
        </span>
      </Link>
      <button className="w-full p-3 font-semibold text-white transition-all transform rounded-lg bg-gradient-to-r from-blue-600 to-green-500 hover:opacity-90 hover:scale-105">
        Sign In
      </button>
      <p className="block mt-6 text-sm text-center text-gray-600">
        Belum punya akun?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="p-0 font-semibold text-blue-600 bg-transparent border-none cursor-pointer hover:underline"
        >
          Klik disini
        </button>
      </p>
    </form>
  </motion.div>
);

const SignupForm = ({ onSwitch }) => {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      key="signup"
      custom={-1}
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute login-form"
    >
      <h1 className="mb-6 text-4xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text">
        Sign Up
      </h1>
      <form action="#">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="flex items-center justify-center w-24 h-24 overflow-hidden bg-gray-100 border-2 border-dashed rounded-full">
              {imagePreview ? (
                <Image
                  id="image-preview"
                  src={imagePreview}
                  alt="Image Preview"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              ) : (
                <FaUser className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <label
              htmlFor="photo-input"
              className="absolute bottom-0 p-2 text-white transition-colors bg-blue-600 rounded-full cursor-pointer -right-1 hover:bg-blue-700"
            >
              <FaCamera className="w-4 h-4" />
            </label>
            <input
              type="file"
              id="photo-input"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div className="flex-grow">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaUser className="w-5 h-5 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Nama Lengkap"
                className="w-full p-4 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div className="relative mb-4">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FaEnvelope className="w-5 h-5 text-gray-400" />
          </span>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="relative mb-4">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FaLock className="w-5 h-5 text-gray-400" />
          </span>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <button className="w-full p-3 font-semibold text-white transition-all transform rounded-lg bg-gradient-to-r from-blue-600 to-green-500 hover:opacity-90 hover:scale-105">
          Sign Up
        </button>
        <p className="block mt-6 text-sm text-center text-gray-600">
          Sudah punya akun?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="p-0 font-semibold text-blue-600 bg-transparent border-none cursor-pointer hover:underline"
          >
            Klik disini
          </button>
        </p>
      </form>
    </motion.div>
  );
};

export default function LoginPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [direction, setDirection] = useState(1);

  const toggleView = () => {
    setDirection(isLoginView ? -1 : 1);
    setIsLoginView(!isLoginView);
  };

  return (
    <main className="flex items-center justify-center w-full min-h-screen overflow-hidden bg-white">
      <div className="container grid items-center gap-16 p-4 mx-auto md:grid-cols-2">
        <div className="relative hidden md:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "backOut" }}
          >
            <Image
              src="/assets/images/login.png"
              alt="Learning Illustration"
              width={500}
              height={500}
              className="w-full h-auto"
              priority
            />
          </motion.div>
        </div>
        <div className="form-container h-[550px]">
          <AnimatePresence initial={false} custom={direction}>
            {isLoginView ? (
              <LoginForm onSwitch={toggleView} />
            ) : (
              <SignupForm onSwitch={toggleView} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
