const ProductSkeleton = ({ viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-[#1A1A1A] rounded-xl p-4 animate-pulse">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-32 h-32 bg-gray-700 rounded-lg"></div>
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-700 rounded w-3/4"></div>
            <div className="h-5 bg-gray-700 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
            <div className="flex gap-3 mt-4">
              <div className="h-8 bg-gray-700 rounded flex-1"></div>
              <div className="h-8 w-8 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] rounded-xl overflow-hidden animate-pulse">
      <div className="h-40 sm:h-48 md:h-52 lg:h-56 bg-gray-700"></div>
      <div className="p-3 sm:p-4 space-y-3">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-700 rounded"></div>
          <div className="h-3 bg-gray-700 rounded w-5/6"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-700 rounded w-16"></div>
          <div className="h-6 w-6 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;