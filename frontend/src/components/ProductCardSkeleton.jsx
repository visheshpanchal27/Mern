import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-[#1f1f1f] rounded-xl p-3 shadow animate-pulse"
        >
          <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-md mb-3" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2" />
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-2" />
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
        </div>
      ))}
    </div>
  );
};

export default ProductCardSkeleton;
