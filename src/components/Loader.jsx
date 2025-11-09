"use client";
import { motion } from "framer-motion";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm">
      <motion.div
        style={{
          width: 50,
          height: 50,
          border: "4px solid #e2e8f0", // gray-200
          borderTop: "4px solid #3b82f6", // blue-500
          borderRadius: "50%",
        }}
        animate={{ rotate: 360 }}
        transition={{ loop: Infinity, duration: 3, ease: "linear" }}
      />
      <p className="mt-4 text-lg font-semibold text-gray-700">{text}</p>
    </div>
  );
}
