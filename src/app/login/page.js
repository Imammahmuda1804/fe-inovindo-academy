"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaEnvelope, FaLock, FaUser, FaGoogle } from "react-icons/fa";
import FloatingLabelInput from "@/components/FloatingLabelInput.jsx";

import "./login.css";

const SocialLoginButton = () => (
  <>
    <div className="relative flex py-5 items-center">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="flex-shrink mx-4 text-gray-500 text-sm">
        Atau lanjutkan dengan
      </span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
    <button className="w-full flex items-center justify-center p-3 font-semibold text-gray-700 transition-colors duration-300 border border-gray-300 rounded-lg hover:bg-gray-100">
      <FaGoogle className="w-5 h-5 mr-3 text-red-500" />
      Masuk dengan Google
    </button>
  </>
);

const AuthForm = ({ isLoginView, onSwitch }) => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full">
      <div className="w-full max-w-sm mx-auto">
        <div className="text-center mb-8">
          <Image
            src="/assets/images/logo.png"
            alt="Logo"
            width={64}
            height={64}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">
            {isLoginView ? "Selamat Datang!" : "Buat Akun Baru"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isLoginView
              ? "Silakan masuk untuk melanjutkan."
              : "Mulai perjalanan belajar Anda."}
          </p>
        </div>
        <form action="#">
          {!isLoginView && (
            <FloatingLabelInput
              type="text"
              label="Nama Lengkap"
              icon={FaUser}
              name="name"
              value={formState.name}
              onChange={handleChange}
            />
          )}
          <FloatingLabelInput
            type="email"
            label="Email"
            icon={FaEnvelope}
            name="email"
            value={formState.email}
            onChange={handleChange}
          />
          <FloatingLabelInput
            type="password"
            label="Password"
            icon={FaLock}
            name="password"
            value={formState.password}
            onChange={handleChange}
          />

          {isLoginView && (
            <Link href="/reset-password">
              <span className="block mb-4 text-sm text-right text-blue-600 cursor-pointer hover:underline">
                Lupa password?
              </span>
            </Link>
          )}

          <button
            className={`w-full p-3 font-bold text-white rounded-lg shadow-lg hover:shadow-blue-500/40 bg-gradient-to-r from-blue-600 to-green-500 ${
              isLoginView ? "mt-2" : "mt-6"
            }`}
          >
            {isLoginView ? "Masuk" : "Daftar"}
          </button>

          <SocialLoginButton />

          <p className="block mt-6 text-sm text-center text-gray-600">
            {isLoginView ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <button
              type="button"
              onClick={onSwitch}
              className="p-0 font-semibold text-blue-600 bg-transparent border-none cursor-pointer hover:underline"
            >
              {isLoginView ? "Daftar di sini" : "Masuk di sini"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default function LoginPage() {
  const [isLoginView, setIsLoginView] = useState(true);

  const illustrationComponent = (
    <div className="relative hidden md:flex items-center justify-center">
      <div className="relative">
        <div className="absolute -top-16 -left-16 w-72 h-72 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-16 -right-10 w-72 h-72 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>

        <Image
          src="/assets/images/login.png"
          alt="Learning Illustration"
          width={500}
          height={500}
          className="w-full h-auto relative z-10"
          priority
        />
      </div>
    </div>
  );

  const formComponent = (
    <div className="relative flex items-center justify-center w-full min-h-[650px] bg-white/20 backdrop-blur-lg border border-gray-200/50 shadow-2xl rounded-3xl p-8 sm:p-12 overflow-hidden">
      <AuthForm
        isLoginView={isLoginView}
        onSwitch={() => setIsLoginView(!isLoginView)}
      />
    </div>
  );

  return (
    <main className="flex items-center justify-center w-full h-screen overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <div className="container grid items-center gap-8 md:gap-16 p-4 mx-auto md:grid-cols-2">
        {isLoginView ? (
          <>
            {illustrationComponent}
            {formComponent}
          </>
        ) : (
          <>
            {formComponent}
            {illustrationComponent}
          </>
        )}
      </div>
    </main>
  );
}
