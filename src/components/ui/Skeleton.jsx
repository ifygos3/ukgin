const Skeleton = ({ className = '', variant = 'rect', ...props }) => {
  const base = 'animate-pulse bg-gray-800';
  const shapes = {
    rect: 'rounded-xl',
    circle: 'rounded-full',
    text: 'rounded-lg h-4 w-full',
  };
  return <div className={`${base} ${shapes[variant] || shapes.rect} ${className}`} {...props} />;
};

const CardSkeleton = ({ lines = 3 }) => (
  <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
    <Skeleton className="w-full h-48 rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton variant="text" className="w-3/4" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="text" className={`${i === lines - 1 ? 'w-1/2' : 'w-full'}`} />
      ))}
    </div>
  </div>
);

const StatCardSkeleton = () => (
  <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
    <Skeleton variant="text" className="w-20 mb-2" />
    <Skeleton variant="text" className="w-12 h-6" />
  </div>
);

export { Skeleton, CardSkeleton, StatCardSkeleton };
