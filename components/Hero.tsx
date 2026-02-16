import React, { useState, useEffect } from 'react';
import { LiveMatch } from '../types';
import { PromoTile, promoTiles } from '../demoData';
import { PromoGridSkeleton } from './SkeletonLoader';

interface HeroProps {
  onNavigate: (target: 'featured' | 'promos' | 'all-sports' | 'in-play') => void;
  matches?: LiveMatch[];
}

const Hero: React.FC<HeroProps> = ({ onNavigate, matches = [] }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const liveCounts = matches
    .filter((m) => m.isLive)
    .reduce<Record<string, number>>((acc, m) => {
      acc[m.sport] = (acc[m.sport] || 0) + 1;
      return acc;
    }, {});

  if (loading) return <PromoGridSkeleton />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {promoTiles.map((tile) => (
        <TileCard
          key={tile.id}
          tile={tile}
          liveCounts={tile.hasLive ? liveCounts : undefined}
          onClick={() => onNavigate(tile.target)}
        />
      ))}
    </div>
  );
};

interface TileCardProps {
  tile: PromoTile;
  liveCounts?: Record<string, number>;
  onClick: () => void;
}

const TileCard: React.FC<TileCardProps> = ({ tile, liveCounts, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative w-full rounded-lg overflow-hidden h-48 sm:h-56 flex text-left group transition-all hover:scale-[1.01] active:scale-[0.99]"
    >
      {/* Background image */}
      <img
        src={tile.image}
        alt={tile.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* LIVE badge */}
      {tile.hasLive && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-red-600 text-white px-2.5 py-1 rounded flex items-center gap-1.5 text-xs font-bold shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            LIVE
          </div>

          {/* Live sport counts */}
          {liveCounts && Object.keys(liveCounts).length > 0 && (
            <div className="mt-1.5 space-y-1">
              {Object.entries(liveCounts)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 3)
                .map(([sport, count]) => (
                  <div
                    key={sport}
                    className="flex items-center justify-between gap-3 bg-black/60 backdrop-blur-sm rounded px-2.5 py-0.5 min-w-[110px]"
                  >
                    <span className="text-white text-xs">{sport}</span>
                    <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded min-w-[20px] text-center">
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-bet-yellow flex items-center justify-between px-4 py-2 z-10">
        <h3 className="text-gray-900 font-black text-base">{tile.title}</h3>
        <span className="text-gray-900 font-bold text-sm flex items-center gap-1">
          Play Now
        </span>
      </div>
    </button>
  );
};

export default Hero;
