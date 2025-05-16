import { motion } from "framer-motion";
import React from "react";

export default function Avatar({ speaking }) {
  return (
    <motion.div
      className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg"
      animate={speaking ? { scale: [1, 1.1, 1] } : { scale: 1 }}
      transition={{ duration: 0.8, repeat: Infinity }}
    >
      🚀
    </motion.div>
  );
}