'use client';
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import { useModal } from "@/context/ModalContext";
import ConfirmModal from "@/components/ConfirmModal";
import FullScreenLoader from "@/components/FullScreenLoader"; // Import FullScreenLoader
import { useLoading } from "@/context/LoadingContext"; // Import useLoading

export function AppBody({ children }) {
  const pathname = usePathname();
  const { modalState, closeModal } = useModal();
  const { isPageLoading, setIsPageLoading } = useLoading(); // Use loading context

  useEffect(() => {
    // On any route change, the pathname will update, and this effect will run.
    // We set loading to false, assuming the page has finished loading.
    if (isPageLoading) {
      setIsPageLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    // Also, handle the modal overflow logic
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
  const isStandalone = standalonePages.some(page => pathname.startsWith(page));
  const noFooterPages = pathname.startsWith("/materi");

  const handleConfirm = async () => {
    if (modalState.onConfirm) {
      await modalState.onConfirm();
    }
  };
  
  return (
    <>
      {isPageLoading && <FullScreenLoader />}
      {!isStandalone && <Header />}
      <main>{children}</main>
      {!isStandalone && !noFooterPages && <Footer />}
      {modalState.isOpen && <ConfirmModal {...modalState} onClose={closeModal} onConfirm={handleConfirm} />}
    </>
  );
}
