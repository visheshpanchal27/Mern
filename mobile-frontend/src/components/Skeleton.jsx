const Skeleton = ({ className = '', width = 'w-full', height = 'h-4' }) => (
  <div className={`skeleton rounded ${width} ${height} ${className}`} />
)

export const ProductCardSkeleton = () => (
  <div className="card">
    <Skeleton height="h-40" className="mb-3 rounded-lg" />
    <Skeleton width="w-3/4" className="mb-2" />
    <Skeleton width="w-1/2" height="h-6" className="mb-2" />
    <div className="flex justify-between items-center">
      <Skeleton width="w-16" height="h-4" />
      <Skeleton width="w-8" height="h-8" className="rounded-lg" />
    </div>
  </div>
)

export const CategorySkeleton = () => (
  <div className="flex space-x-3 overflow-x-auto pb-2">
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} width="w-20" height="h-8" className="rounded-full flex-shrink-0" />
    ))}
  </div>
)

export const HomeSkeleton = () => (
  <div className="safe-area-top bg-gray-900 min-h-screen">
    {/* Header Skeleton */}
    <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="flex items-center mb-6">
        <Skeleton width="w-8" height="h-8" className="rounded-full mr-2" />
        <div className="space-y-1">
          <Skeleton width="w-16" height="h-3" />
          <Skeleton width="w-12" height="h-2" />
        </div>
      </div>
      <div className="text-center space-y-3">
        <Skeleton width="w-64" height="h-8" className="mx-auto" />
        <Skeleton width="w-48" height="h-4" className="mx-auto" />
      </div>
    </div>
    
    {/* Products Section Skeleton */}
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Skeleton width="w-32" height="h-5" />
        <Skeleton width="w-16" height="h-4" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
    
    {/* Button Skeleton */}
    <div className="p-4">
      <Skeleton height="h-12" className="rounded-xl" />
    </div>
  </div>
)

export const CartSkeleton = () => (
  <div className="safe-area-top">
    {/* Header Skeleton */}
    <div className="p-4 bg-dark-light border-b border-gray-800">
      <Skeleton width="w-32" height="h-6" className="mb-2" />
      <Skeleton width="w-16" height="h-4" />
    </div>
    
    {/* Cart Items Skeleton */}
    <div className="flex-1">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 border-b border-gray-800">
          <div className="flex space-x-3">
            <Skeleton width="w-20" height="h-20" className="rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton width="w-3/4" height="h-4" />
              <Skeleton width="w-16" height="h-5" />
              <Skeleton width="w-20" height="h-4" />
              <Skeleton width="w-24" height="h-8" className="rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
    
    {/* Checkout Section Skeleton */}
    <div className="p-4 bg-dark-light border-t border-gray-800">
      <div className="space-y-2 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton width="w-16" height="h-4" />
            <Skeleton width="w-12" height="h-4" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <Skeleton height="h-12" className="rounded-xl" />
        <Skeleton height="h-12" className="rounded-xl" />
      </div>
    </div>
  </div>
)

export default Skeleton