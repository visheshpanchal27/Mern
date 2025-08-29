// Reusable skeleton components
export const ProductCardSkeleton = ({ viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-[#1A1A1A] rounded-xl shadow-lg overflow-hidden flex flex-col sm:flex-row gap-4 p-4 animate-pulse">
        <div className="w-full sm:w-32 h-32 bg-gray-700 rounded-lg flex-shrink-0"></div>
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gray-700 rounded w-3/4"></div>
          <div className="h-5 bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          <div className="flex gap-3 mt-4">
            <div className="h-8 bg-gray-700 rounded flex-1"></div>
            <div className="h-8 w-8 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-700"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-5 bg-gray-700 rounded w-1/2"></div>
        <div className="h-3 bg-gray-700 rounded w-full"></div>
        <div className="flex justify-between items-center mt-4">
          <div className="h-8 bg-gray-700 rounded w-16"></div>
          <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export const SmallProductSkeleton = () => (
  <div className="w-[16rem] p-3 animate-pulse">
    <div className="bg-gray-700 rounded-xl p-2 h-36"></div>
    <div className="p-3 space-y-2">
      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);

export const ProductDetailsSkeleton = () => (
  <div className="p-4 xl:px-20 animate-pulse">
    <div className="h-10 bg-gray-700 rounded w-32 mb-8"></div>
    <div className="flex flex-col xl:flex-row gap-10">
      <div className="w-full xl:w-1/2 space-y-4">
        <div className="w-full h-96 bg-gray-700 rounded"></div>
        <div className="flex gap-2">
          {[1,2,3].map(i => (
            <div key={i} className="w-20 h-20 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
      <div className="w-full xl:w-1/2 space-y-6">
        <div className="h-8 bg-gray-700 rounded w-3/4"></div>
        <div className="h-6 bg-gray-700 rounded w-full"></div>
        <div className="h-10 bg-gray-700 rounded w-1/3"></div>
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-5 bg-gray-700 rounded"></div>
          ))}
        </div>
        <div className="flex gap-4">
          <div className="h-10 bg-gray-700 rounded w-20"></div>
          <div className="h-10 bg-gray-700 rounded flex-1"></div>
        </div>
      </div>
    </div>
  </div>
);

export const ImageGallerySkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="w-full h-96 bg-gray-700 rounded"></div>
    <div className="flex gap-2">
      {[1,2,3,4].map(i => (
        <div key={i} className="w-20 h-20 bg-gray-700 rounded"></div>
      ))}
    </div>
  </div>
);

export const ProductTabsSkeleton = () => (
  <div className="w-full px-6 mt-10 animate-pulse">
    <div className="flex gap-4 mb-6">
      {[1,2,3].map(i => (
        <div key={i} className="h-10 bg-gray-700 rounded-full w-32"></div>
      ))}
    </div>
    <div className="space-y-4">
      <div className="h-6 bg-gray-700 rounded w-1/4"></div>
      <div className="space-y-2">
        {[1,2,3].map(i => (
          <div key={i} className="h-4 bg-gray-700 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

export const MultiImageUploadSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-6 bg-gray-700 rounded w-1/3"></div>
    <div className="h-10 bg-gray-700 rounded"></div>
    <div className="grid grid-cols-4 gap-2">
      {[1,2,3,4].map(i => (
        <div key={i} className="h-20 bg-gray-700 rounded"></div>
      ))}
    </div>
  </div>
);

export const HomeSkeleton = () => (
  <div className="animate-pulse">
    {/* Header Skeleton */}
    <div className="h-16 bg-gray-800 mb-4"></div>
    
    {/* Hero Section Skeleton */}
    <div className="relative mt-16 px-4 md:px-20 py-12 mx-4 md:mx-8 mb-12">
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-3xl p-8">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-8 bg-yellow-400/30 rounded-full"></div>
            <div className="h-12 bg-gradient-to-r from-gray-600 to-gray-500 rounded-lg w-80"></div>
            <div className="w-8 h-8 bg-yellow-400/30 rounded-full"></div>
          </div>
          <div className="space-y-2 max-w-2xl mx-auto">
            <div className="h-4 bg-gray-600 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-600 rounded w-1/2 mx-auto"></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="h-12 bg-gradient-to-r from-pink-600/50 to-purple-600/50 rounded-full w-48"></div>
            <div className="h-12 bg-gray-700/50 rounded-full w-40"></div>
          </div>
        </div>
      </div>
    </div>

    {/* Products Grid Skeleton */}
    <div className="px-4 md:px-8 mb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-2xl overflow-hidden">
            <div className="h-72 bg-gray-600 relative">
              <div className="absolute top-4 right-4 w-8 h-8 bg-gray-500 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-12 bg-gray-500/50 rounded-full"></div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gray-600 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-600 rounded w-full"></div>
                <div className="h-3 bg-gray-600 rounded w-2/3"></div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="h-8 bg-pink-500/30 rounded w-20"></div>
                <div className="h-4 bg-yellow-400/30 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Stats Section Skeleton */}
    <div className="px-4 md:px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="h-12 bg-gray-600 rounded w-16 mx-auto"></div>
              <div className="h-4 bg-gray-600 rounded w-20 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* CTA Section Skeleton */}
    <div className="mt-16 mb-8 px-4">
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl p-8 mx-4 md:mx-8">
        <div className="text-center space-y-6">
          <div className="h-8 bg-gray-600 rounded w-80 mx-auto"></div>
          <div className="space-y-2 max-w-2xl mx-auto">
            <div className="h-4 bg-gray-600 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-600 rounded w-1/2 mx-auto"></div>
          </div>
          <div className="h-12 bg-gradient-to-r from-pink-600/50 to-purple-600/50 rounded-full w-48 mx-auto"></div>
        </div>
      </div>
    </div>
  </div>
);