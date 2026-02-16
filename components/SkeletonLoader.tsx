import React from 'react';

export const TileSkeleton: React.FC = () => (
  <div className="rounded-lg overflow-hidden h-48 sm:h-56 skeleton" />
);

export const CardSkeleton: React.FC = () => (
  <div className="rounded-lg overflow-hidden">
    <div className="aspect-[4/3] skeleton" />
    <div className="bg-gray-800 p-2 flex items-center justify-between">
      <div className="h-3 w-20 skeleton rounded" />
      <div className="h-5 w-16 skeleton rounded" />
    </div>
  </div>
);

export const PromoGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <TileSkeleton key={i} />
    ))}
  </div>
);

export const GamesGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
    {Array.from({ length: 8 }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);
