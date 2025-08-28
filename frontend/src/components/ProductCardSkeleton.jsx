import React from "react";
import { motion } from "framer-motion";

// Add shimmer animation styles
const shimmerStyles = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = shimmerStyles;
  document.head.appendChild(styleSheet);
}

const ProductCardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]">
      {/* Hero Skeleton */}
      <div className="mt-16 px-4 md:px-20 py-12 mx-4 md:mx-8 mb-12">
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-3xl p-12 animate-pulse">
          <div className="text-center">
            <div className="h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-700 rounded-lg w-2/3 mx-auto mb-8"></div>
            <div className="flex gap-4 justify-center">
              <div className="h-12 bg-gradient-to-r from-pink-800/50 to-purple-800/50 rounded-full w-48"></div>
              <div className="h-12 bg-gray-800/50 rounded-full w-40"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] rounded-2xl p-4 shadow-2xl border border-gray-800/50 animate-pulse"
            >
              {/* Image Skeleton */}
              <div className="relative mb-4">
                <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl mb-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/20 to-transparent animate-shimmer"></div>
                </div>
              </div>
              
              {/* Content Skeleton */}
              <div className="space-y-3">
                <div className="h-6 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                
                {/* Price and Rating */}
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-gradient-to-r from-pink-800/50 to-purple-800/50 rounded-lg w-20"></div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-gray-700 rounded-sm"></div>
                    ))}
                  </div>
                </div>
                
                {/* Button Skeleton */}
                <div className="h-10 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl w-full mt-4"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Section Skeleton */}
      <div className="mt-16 px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="text-center animate-pulse">
              <div className="h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl w-16 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-20 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section Skeleton */}
      <div className="mt-16 mb-8 px-4">
        <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-2xl p-8 mx-4 md:mx-8 border border-gray-700 animate-pulse">
          <div className="text-center">
            <div className="h-8 bg-gray-700 rounded-lg w-96 mx-auto mb-4"></div>
            <div className="h-5 bg-gray-700 rounded w-2/3 mx-auto mb-6"></div>
            <div className="h-12 bg-gradient-to-r from-pink-800/50 to-purple-800/50 rounded-full w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
