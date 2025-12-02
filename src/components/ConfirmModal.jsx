"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal = {
  hidden: { y: "-50px", opacity: 0 },
  visible: {
    y: "0",
    opacity: 1,
    transition: { delay: 0.1, type: "spring", stiffness: 120 },
  },
};

const variants = {
  danger: {
    icon: FaExclamationTriangle,
    iconBgClass: "bg-red-100",
    iconColorClass: "text-red-600",
    buttonBgClass: "bg-red-600",
    buttonHoverBgClass: "hover:bg-red-700",
    buttonFocusRingClass: "focus:ring-red-500",
  },
  success: {
    icon: FaCheckCircle,
    iconBgClass: "bg-blue-100",
    iconColorClass: "text-blue-600",
    buttonBgClass: "bg-blue-600",
    buttonHoverBgClass: "hover:bg-blue-700",
    buttonFocusRingClass: "focus:ring-blue-500",
  },
};

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  children, 
  isLoading, 
  confirmText = "Konfirmasi", 
  cancelText = "Batal",
  hideCancelButton = false,
  variant = 'danger'
}) {
  const selectedVariant = variants[variant] || variants.danger;
  const {
    icon: Icon,
    iconBgClass,
    iconColorClass,
    buttonBgClass,
    buttonHoverBgClass,
    buttonFocusRingClass,
  } = selectedVariant;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            variants={modal}
            className="relative w-full max-w-md p-6 mx-4 bg-white rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start">
              <div className={`flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto ${iconBgClass} rounded-full sm:mx-0 sm:h-10 sm:w-10`}>
                <Icon className={`w-6 h-6 ${iconColorClass}`} />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-bold leading-6 text-gray-900">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    {children}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                disabled={isLoading}
                className={`inline-flex justify-center w-full px-4 py-2 text-base font-semibold text-white ${buttonBgClass} ${buttonHoverBgClass} border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonFocusRingClass} sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={onConfirm}
              >
                {isLoading ? 'Memproses...' : confirmText}
              </button>
              {!hideCancelButton && (
                <button
                  type="button"
                  disabled={isLoading}
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-semibold text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:cursor-not-allowed"
                  onClick={onClose}
                >
                  {cancelText}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
