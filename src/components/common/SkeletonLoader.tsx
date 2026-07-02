interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton = ({ className = '', variant = 'rectangular', width, height }: SkeletonProps) => {
  const baseClasses = 'relative overflow-hidden bg-[#14141a] rounded';
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
    </div>
  );
};

export const MovieCardSkeleton = () => (
  <div className="flex-shrink-0 w-[200px] md:w-[250px]">
    <Skeleton className="w-full aspect-video rounded-lg mb-2" />
    <Skeleton className="w-3/4 h-4 mb-1" variant="text" />
    <Skeleton className="w-1/2 h-3" variant="text" />
  </div>
);

export const HeroSkeleton = () => (
  <div className="relative h-[80vh] w-full">
    <Skeleton className="w-full h-full" />
    <div className="absolute bottom-20 left-12 space-y-4 w-1/3">
      <Skeleton className="w-full h-12" />
      <Skeleton className="w-3/4 h-4" />
      <Skeleton className="w-1/2 h-4" />
      <div className="flex gap-3 mt-4">
        <Skeleton className="w-32 h-10 rounded-lg" />
        <Skeleton className="w-32 h-10 rounded-lg" />
      </div>
    </div>
  </div>
);
