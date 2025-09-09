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

export default Skeleton