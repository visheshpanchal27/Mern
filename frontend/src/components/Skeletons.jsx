// Reusable skeleton components
export const ProductCardSkeleton = ({ viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] rounded-xl shadow-lg overflow-hidden flex flex-col sm:flex-row gap-4 p-4 border border-gray-800">
        <div className="w-full sm:w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg flex-shrink-0 relative animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse"></div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-3 h-3 bg-yellow-400/30 rounded-sm animate-pulse"></div>
              ))}
            </div>
            <div className="h-4 bg-gray-700 rounded w-8 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3 animate-pulse"></div>
          <div className="flex gap-3 mt-4">
            <div className="h-8 bg-gradient-to-r from-pink-600/30 to-purple-600/30 rounded flex-1 animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] rounded-2xl shadow-xl overflow-hidden border border-gray-800 hover:border-pink-500/20 transition-all duration-300">
      {/* Image Skeleton */}
      <div className="relative w-full h-72 bg-gradient-to-br from-gray-700 to-gray-600 animate-pulse">
        {/* Badges */}
        <div className="absolute top-3 left-3 space-y-1">
          <div className="h-6 bg-orange-500/30 rounded-full w-16 animate-pulse"></div>
        </div>
        
        {/* Heart Icon */}
        <div className="absolute top-3 right-3">
          <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
        </div>
        
        {/* Loading Spinner */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-500/30 border-t-pink-500/50 rounded-full animate-spin"></div>
        </div>
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
      </div>
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
        
        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-3 h-3 bg-yellow-400/30 rounded-sm animate-pulse"></div>
              ))}
            </div>
            <div className="h-3 bg-gray-700 rounded w-8 animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-4 bg-green-400/30 rounded w-12 animate-pulse"></div>
            <div className="h-4 bg-blue-400/30 rounded w-8 animate-pulse"></div>
          </div>
        </div>
        
        {/* Price Section */}
        <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-700/50">
          <div className="space-y-1">
            <div className="h-6 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded w-16 animate-pulse"></div>
            <div className="h-3 bg-green-400/30 rounded w-20 animate-pulse"></div>
          </div>
          <div className="flex gap-1">
            <div className="h-8 bg-gradient-to-r from-pink-600/30 to-purple-600/30 rounded-lg w-12 animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
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

export const HomeSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Header Skeleton */}
      <div className="h-16 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-b border-gray-700/30 animate-pulse">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="h-8 bg-gray-600 rounded w-32"></div>
          <div className="flex gap-4">
            <div className="h-8 w-8 bg-gray-600 rounded-full"></div>
            <div className="h-8 w-8 bg-gray-600 rounded-full"></div>
            <div className="h-8 w-8 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Hero Section Skeleton */}
      <div className="relative mt-16 px-4 md:px-20 py-16 mx-4 md:mx-8 mb-12">
        <div className="bg-gradient-to-br from-pink-900/20 via-purple-900/20 to-blue-900/20 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/30 rounded-3xl"></div>
          <div className="relative z-10">
            {/* Hero Title Skeleton */}
            <div className="text-center space-y-6 animate-pulse">
              <div className="space-y-4">
                <div className="h-16 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-2xl w-full max-w-4xl mx-auto"></div>
                <div className="h-8 bg-gray-300/20 rounded-xl w-3/4 mx-auto"></div>
              </div>
              
              {/* Search Bar Skeleton */}
              <div className="max-w-lg mx-auto">
                <div className="h-14 bg-[#1A1A1A]/60 border border-pink-600/20 rounded-full relative">
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-pink-600/50 to-purple-600/50 rounded-full"></div>
                </div>
              </div>
              
              {/* Special Products Title */}
              <div className="space-y-4 mt-12">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 bg-yellow-400/30 rounded-full animate-pulse"></div>
                  <div className="h-10 bg-gradient-to-r from-pink-400/30 to-blue-400/30 rounded-xl w-80"></div>
                  <div className="w-6 h-6 bg-yellow-400/30 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-2 max-w-2xl mx-auto">
                  <div className="h-4 bg-gray-300/20 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-300/20 rounded w-1/2 mx-auto"></div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
                  <div className="h-12 bg-gradient-to-r from-pink-600/40 to-purple-600/40 rounded-full w-52 animate-pulse"></div>
                  <div className="h-12 bg-gray-700/40 rounded-full w-40 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="px-4 md:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="group">
              <div className="bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800 shadow-xl">
                {/* Image Skeleton */}
                <div className="relative h-72 bg-gradient-to-br from-gray-700 to-gray-600 animate-pulse">
                  {/* Badges */}
                  <div className="absolute top-3 left-3 space-y-1">
                    <div className="h-6 bg-orange-500/30 rounded-full w-16"></div>
                    {i % 3 === 0 && <div className="h-6 bg-green-500/30 rounded-full w-12"></div>}
                  </div>
                  
                  {/* Heart Icon */}
                  <div className="absolute top-3 right-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                  </div>
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {[1,2,3].map(dot => (
                      <div key={dot} className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                    ))}
                  </div>
                  
                  {/* Center Loading Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-gray-500/30 border-t-pink-500/50 rounded-full animate-spin"></div>
                  </div>
                </div>
                
                {/* Product Info Skeleton */}
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-600 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-600 rounded w-full animate-pulse"></div>
                  
                  {/* Rating & Features */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(star => (
                          <div key={star} className="w-3 h-3 bg-yellow-400/30 rounded-sm"></div>
                        ))}
                      </div>
                      <div className="h-3 bg-gray-600 rounded w-8"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-4 bg-green-400/30 rounded w-12"></div>
                      <div className="h-4 bg-blue-400/30 rounded w-8"></div>
                    </div>
                  </div>
                  
                  {/* Alert Box */}
                  {i % 4 === 0 && (
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2">
                      <div className="h-4 bg-orange-400/30 rounded w-24 mx-auto"></div>
                    </div>
                  )}
                  
                  {/* Price Section */}
                  <div className="flex items-end justify-between pt-2 border-t border-gray-700/50">
                    <div className="space-y-1">
                      <div className="h-6 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded w-16"></div>
                      <div className="h-3 bg-green-400/30 rounded w-20"></div>
                    </div>
                    <div className="flex gap-1">
                      <div className="h-8 bg-gradient-to-r from-pink-600/30 to-purple-600/30 rounded-lg w-12"></div>
                      <div className="h-8 w-8 bg-gray-700/50 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Show More Button Skeleton */}
        <div className="text-center mt-12">
          <div className="h-12 bg-gradient-to-r from-pink-600/30 to-purple-600/30 rounded-full w-32 mx-auto animate-pulse"></div>
        </div>
      </div>

      {/* Stats Section Skeleton */}
      <div className="px-4 md:px-8 py-16 bg-gradient-to-r from-gray-900/20 to-gray-800/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-600 rounded w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-600 rounded w-64 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center space-y-3 p-6 bg-[#1A1A1A]/50 rounded-xl border border-gray-700/30">
                <div className="h-12 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-xl w-16 mx-auto animate-pulse"></div>
                <div className="h-6 bg-gray-600 rounded w-20 mx-auto animate-pulse"></div>
                <div className="h-4 bg-gray-600 rounded w-16 mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section Skeleton */}
      <div className="mt-16 mb-8 px-4">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-gray-700/50 rounded-2xl p-8 mx-4 md:mx-8">
          <div className="text-center space-y-6">
            <div className="h-8 bg-gray-600 rounded w-96 mx-auto animate-pulse"></div>
            <div className="space-y-2 max-w-2xl mx-auto">
              <div className="h-4 bg-gray-600 rounded w-3/4 mx-auto animate-pulse"></div>
              <div className="h-4 bg-gray-600 rounded w-1/2 mx-auto animate-pulse"></div>
            </div>
            <div className="h-12 bg-gradient-to-r from-pink-600/40 to-purple-600/40 rounded-full w-48 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};