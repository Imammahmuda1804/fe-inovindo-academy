"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";
import Loader from "@/components/Loader";

function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refetchUser } = useAuth();
  const { openModal } = useModal();

  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refresh_token");
    const error = searchParams.get("error");

    if (token) {
      localStorage.setItem("access_token", token);
      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      }
      refetchUser().then(() => {
        router.push("/home");
      }).catch((err) => {
        console.error("Error refetching user after Google login:", err);
        openModal({
          title: "Login Gagal",
          children: "Terjadi kesalahan saat memuat data pengguna. Silakan coba login ulang.",
          confirmText: "Oke",
          hideCancelButton: true,
          onConfirm: () => router.push("/login"),
          variant: "danger",
        });
      });
    } else if (error) {
      console.error("Google login error:", error);
      let errorMessage = "Login dengan Google gagal. Silakan coba lagi.";
      if (error === "socialite_error") {
        errorMessage = "Terjadi kesalahan saat otentikasi dengan Google. Pastikan Anda memberikan izin yang diperlukan.";
      }
      openModal({
        title: "Login Gagal",
        children: errorMessage,
        confirmText: "Coba Lagi",
        hideCancelButton: true,
        onConfirm: () => router.push("/login"),
        variant: "danger",
      });
    } else {
      // If no token or error, something unexpected happened
      openModal({
        title: "Kesalahan Otentikasi",
        children: "Terjadi kesalahan yang tidak terduga selama proses otentikasi. Silakan coba lagi.",
        confirmText: "Oke",
        hideCancelButton: true,
        onConfirm: () => router.push("/login"),
        variant: "danger",
      });
    }
  }, [searchParams, router, refetchUser, openModal]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-ray-100">
      <Loader />
      <p className="ml-4 text-gray-700">Memproses login Anda...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Loader />}>
      <AuthCallback />
    </Suspense>
  );
}