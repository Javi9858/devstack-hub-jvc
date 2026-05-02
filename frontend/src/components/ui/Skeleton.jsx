import React from 'react';

const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-surface/50 rounded-xl ${className}`}></div>
  );
};

export const ResourceCardSkeleton = () => {
  return (
    <div className="glass p-6 rounded-2xl flex flex-col h-full">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-6" />
      <div className="mt-auto flex justify-between items-center">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
};

export default Skeleton;
