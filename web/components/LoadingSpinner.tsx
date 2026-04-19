export const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-20 w-full">
    <div className="relative flex items-center justify-center">
      {/* Outer Ring */}
      <div className="w-12 h-12 border-4 border-orange-100 rounded-full"></div>
      {/* Spinning Ring */}
      <div className="absolute w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <p className="mt-4 text-sm font-medium text-gray-500 animate-pulse">
      Sedang mengambil data...
    </p>
  </div>
);
