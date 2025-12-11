"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaEnvelope, FaLock, FaUser, FaGoogle, FaCheckCircle } from "react-icons/fa";
import FloatingLabelInput from "@/components/FloatingLabelInput.jsx";
import { useRouter } from "next/navigation";
import { loginUser, registerUser, getGoogleAuthRedirectUrl } from "@/lib/apiService";
import "./login.css";

const SocialLoginButton = ({ onGoogleLogin, isLoading }) => (
  <>
    <div className="relative flex py-5 items-center">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="flex-shrink mx-4 text-gray-500 text-sm">
        Atau lanjutkan dengan
      </span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
    <button
      onClick={onGoogleLogin}
      disabled={isLoading}
      className="w-full flex items-center justify-center p-3 font-semibold text-gray-700 transition-colors duration-300 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed"
    >
      <FaGoogle className="w-5 h-5 mr-3 text-red-500" />
      Masuk dengan Google
    </button>
  </>
);

import { useModal } from "@/context/ModalContext";

import { useAuth } from "@/context/AuthContext";

const AuthForm = ({ isLoginView, onSwitch }) => {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const { refetchUser } = useAuth(); // Use AuthContext

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error for this field on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors at the start of submission
    setIsLoading(true);

    if (isLoginView) {
      try {
        const data = await loginUser({
          email: formState.email,
          password: formState.password,
        });
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          await refetchUser(); // Fetch user data and update context
          router.push("/home");
        }
      } catch (err) {
        if (err.response?.data?.errors) {
          setErrors(err.response.data.errors); // Set field-specific errors
        } else {
          setErrors({ general: err.response?.data?.message || "Login failed. Please check your credentials." });
        }
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Register logic
      if (formState.password !== formState.password_confirmation) {
        setErrors(prev => ({ ...prev, password_confirmation: "Password dan konfirmasi password tidak cocok." }));
        setIsLoading(false);
        return;
      }
      try {
        await registerUser({
          name: formState.name,
          email: formState.email,
          password: formState.password,
          password_confirmation: formState.password_confirmation,
        });
        // On successful registration, show a success modal
        openModal({
          title: "Registrasi Berhasil",
          children: "Akun Anda telah berhasil dibuat. Silakan login untuk melanjutkan.",
          confirmText: "Lanjutkan",
          hideCancelButton: true,
          onConfirm: () => {
            closeModal();
            onSwitch();
          },
          variant: 'success',
        });
      } catch (err) {
        if (err.response?.data?.errors) {
          setErrors(err.response.data.errors); // Set field-specific errors
        } else {
          setErrors({ general: err.response?.data?.message || "Registration failed. Please check your data." });
        }
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

        const handleGoogleLogin = async () => {

          setIsLoading(true);

          try {

            const response = await getGoogleAuthRedirectUrl();

            if (response && response.url) {

              window.location.href = response.url;

            } else {

              setErrors({ general: "Failed to get Google authentication URL." });

            }

          } catch (err) {

            setErrors({ general: "Error initiating Google login." });

            console.error("Error initiating Google login:", err);

          } finally {

            setIsLoading(false);

          }

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

          <form onSubmit={handleSubmit}>

            {!isLoginView && (
              <FloatingLabelInput
                type="text"
                label="Nama Lengkap"
                icon={FaUser}
                name="name"
                value={formState.name}
                onChange={handleChange}
                errorMessage={errors.name} // Pass specific error
              />
            )}
            <FloatingLabelInput
              type="email"
              label="Email"
              icon={FaEnvelope}
              name="email"
              value={formState.email}
              onChange={handleChange}
              errorMessage={errors.email} // Pass specific error
            />
            <FloatingLabelInput
              type="password"
              label="Password"
              icon={FaLock}
              name="password"
              value={formState.password}
              onChange={handleChange}
              errorMessage={errors.password} // Pass specific error
            />
            {!isLoginView && (
              <FloatingLabelInput
                type="password"
                label="Konfirmasi Password"
                icon={FaLock}
                name="password_confirmation"
                value={formState.password_confirmation}
                onChange={handleChange}
                errorMessage={errors.password_confirmation} // Pass specific error
              />
            )}
  
            {isLoginView && (
              <Link href="/reset-password">
                <span className="block mb-4 text-sm text-right text-blue-600 cursor-pointer hover:underline">
                  Lupa password?
                </span>
              </Link>
            )}
  
            {errors.general && <p className="text-red-500 text-sm mb-4">{errors.general}</p>}

  

                        <button

  

                          type="submit"

  

                          disabled={isLoading}

  

                          className={`w-full p-3 font-bold text-white rounded-lg shadow-lg hover:shadow-blue-500/40 bg-gradient-to-r from-blue-600 to-green-500 transition-colors flex items-center justify-center ${isLoginView ? "mt-2" : "mt-6"} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>

  

                          {isLoading ? (

  

                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">

  

                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>

  

                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>

  

                            </svg>

  

                          ) : (isLoginView ? "Masuk" : "Daftar")}

  

                        </button>

  

            <SocialLoginButton onGoogleLogin={handleGoogleLogin} isLoading={isLoading} />

  

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
