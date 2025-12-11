"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const bounceTransition = {
  y: {
    duration: 0.5,
    yoyo: Infinity,
    ease: "easeOut",
  },
};

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-[9999]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="/assets/images/pesawat.png"
          alt="Loading Illustration"
          width={200}
          height={200}
          className="w-48 h-auto mb-8"
        />
      </motion.div>
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.span
          className="w-4 h-4 bg-blue-600 rounded-full"
          transition={bounceTransition}
          animate={{ y: ["-10px", "10px"] }}
        />
        <motion.span
          className="w-4 h-4 bg-green-500 rounded-full"
          transition={{ ...bounceTransition, delay: 0.2 }}
          animate={{ y: ["-10px", "10px"] }}
        />
        <motion.span
          className="w-4 h-4 bg-blue-600 rounded-full"
          transition={{ ...bounceTransition, delay: 0.4 }}
          animate={{ y: ["-10px", "10px"] }}
        />
      </motion.div>
      <p className="mt-6 text-lg font-semibold text-gray-700">Mempersiapkan Halaman...</p>
    </div>
  );
};

export default FullScreenLoader;