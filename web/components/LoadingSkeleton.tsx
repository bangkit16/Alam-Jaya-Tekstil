export const LoadingSkeleton = () => (
  <div className="flex flex-col gap-3 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="border border-gray-200 rounded-2xl p-4 flex justify-between items-center bg-gray-50/50"
      >
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-12 ml-4"></div>
      </div>
    ))}
  </div>
);
