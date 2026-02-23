const ConfessionSkeleton = () => (
  <div className="glass-panel p-6 mb-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="h-3 bg-gray-700 rounded w-24"></div>
      <div className="h-6 bg-gray-700 rounded-full w-6"></div>
    </div>
    <div className="space-y-3 mb-8 mt-4">
      <div className="h-4 bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
    </div>
    <div className="border-t border-gray-700/50 pt-4 mt-auto flex gap-3">
      <div className="h-8 bg-gray-700 rounded-full w-16"></div>
      <div className="h-8 bg-gray-700 rounded-full w-16"></div>
      <div className="h-8 bg-gray-700 rounded-full w-16"></div>
    </div>
  </div>
);

export default ConfessionSkeleton;