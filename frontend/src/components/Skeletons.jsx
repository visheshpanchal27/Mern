// Reusable skeleton components
export const ProductCardSkeleton = ({ viewMode = 'grid' }) => {
  return (
    <div className="flex items-center justify-center h-40">
      <div className="flex gap-1">
        {[1,2,3].map(i => (
          <div 
            key={i}
            className="w-1 h-6 bg-gray-600 rounded-full animate-wave"
            style={{ animationDelay: `${i * 0.15}s` }}
          ></div>
        ))}
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
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
      <div className="flex gap-2">
        {[1,2,3,4,5].map(i => (
          <div 
            key={i}
            className="w-2 h-8 bg-gray-600 rounded-full animate-wave"
            style={{ animationDelay: `${i * 0.1}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
};