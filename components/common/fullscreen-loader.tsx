"use client";
import { Image } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";

export default function FullscreenLoader() {
  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
      >
        {/* Logo */}
        <motion.div
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          initial={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            alt="Loading..."
            className="w-56 object-contain" // 调整大小
            src="/m/logo.png" // 换成你的 logo
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
