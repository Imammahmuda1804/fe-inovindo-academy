'use client';
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import { useModal } from "@/context/ModalContext";
import ConfirmModal from "@/components/ConfirmModal";

export function AppBody({ children }) {
  const pathname = usePathname();
  const { modalState, closeModal } = useModal();

  useEffect(() => {
    if (modalState.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalState.isOpen]);

  const standalonePages = ["/payment-success", "/landing-page", "/login"];
  const isStandalone = standalonePages.includes(pathname);
  const noFooterPages = pathname.startsWith("/materi");

  const handleConfirm = async () => {
    if (modalState.onConfirm) {
      await modalState.onConfirm();
    }
  };

  if (isStandalone) {
    return (
      <>
        <main>{children}</main>
        <ConfirmModal {...modalState} onClose={closeModal} onConfirm={handleConfirm} />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      {!noFooterPages && <Footer />}
      <ConfirmModal {...modalState} onClose={closeModal} onConfirm={handleConfirm} />
    </>
  );
}
