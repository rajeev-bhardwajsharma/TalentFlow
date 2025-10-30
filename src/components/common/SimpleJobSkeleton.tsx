import React from "react";

const SimpleJobSkeleton = () => {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Search Skeleton */}
      <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
        <div className="skeleton h-12 w-full"></div>
        <div className="flex gap-3">
          <div className="skeleton h-10 w-32"></div>
          <div className="skeleton h-10 w-40"></div>
          <div className="skeleton h-10 w-36"></div>
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="skeleton h-14 w-14 rounded-2xl"></div>
              <div className="flex-grow space-y-2">
                <div className="skeleton h-6 w-3/4"></div>
                <div className="skeleton h-4 w-1/2"></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-4/5"></div>

              <div className="flex gap-2 pt-2">
                <div className="skeleton h-6 w-20 rounded-full"></div>
                <div className="skeleton h-6 w-24 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleJobSkeleton;