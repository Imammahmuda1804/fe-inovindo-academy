'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ toast, setToast }) => {
  const { show, message, type } = toast;

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, toast, setToast]);

  const icon = type === 'success' 
    ? <FaCheckCircle className="text-green-500" /> 
    : <FaExclamationCircle className="text-red-500" />;

  const baseClasses = "fixed bottom-5 right-5 z-50 flex items-center px-4 py-3 rounded-lg shadow-2xl text-white max-w-sm";
  const typeClasses = type === 'success' ? "bg-gray-800" : "bg-red-800";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.5 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`${baseClasses} ${typeClasses}`}
        >
          <div className="text-xl mr-3">{icon}</div>
          <p className="flex-grow text-sm font-medium">{message}</p>
          <button onClick={() => setToast({ ...toast, show: false })} className="ml-4 text-xl p-1 rounded-full hover:bg-white/20 transition-colors">
            <FaTimes />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
