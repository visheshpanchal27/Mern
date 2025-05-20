import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="w-full h-screen flex items-center justify-center relative overflow-hidden font-poppins">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-glow z-0" />

      {/* Glass Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="z-10 backdrop-blur-lg bg-white/5 border border-pink-500/20 rounded-3xl px-10 py-16 text-center shadow-xl max-w-xl w-full"
      >
        <h1 className="text-6xl md:text-7xl font-bold text-pink-400 mb-4 soft-glow">
          404
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          The resource you're trying to reach no longer exists or has been moved beyond reach.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 text-lg font-semibold bg-[#d94fa3] hover:bg-[#c94696] text-white rounded-xl transition-all duration-300 shadow-md"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}
