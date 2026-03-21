const ProductSkeleton = () => (
  <div className="bg-card rounded-lg border border-border overflow-hidden animate-pulse">
    <div className="bg-secondary h-40" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-secondary rounded w-3/4" />
      <div className="h-3 bg-secondary rounded w-1/2" />
      <div className="h-5 bg-secondary rounded w-1/3" />
    </div>
  </div>
);

export const ProductSkeletonGrid = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => <ProductSkeleton key={i} />)}
  </div>
);

export default ProductSkeleton;
