import React, { useState, useEffect } from 'react';
import { gameTiles, GameTile } from '../demoData';
import { GamesGridSkeleton } from './SkeletonLoader';

const GamesGrid: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-black text-gray-900 dark:text-white">Games / Providers</h2>
        <button className="text-primary dark:text-bet-yellow text-xs font-bold hover:underline">
          View All
        </button>
      </div>

      {loading ? (
        <GamesGridSkeleton />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {gameTiles.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
};

const GameCard: React.FC<{ game: GameTile }> = ({ game }) => {
  return (
    <div className="rounded-lg overflow-hidden group cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]">
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={game.image}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Provider badge */}
        <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
          {game.provider}
        </span>
      </div>

      {/* Bottom bar */}
      <div className="bg-bet-yellow flex items-center justify-between px-3 py-2">
        <span className="text-gray-900 font-bold text-xs truncate">{game.title}</span>
        <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shrink-0 ml-2">
          Play Now
        </span>
      </div>
    </div>
  );
};

export default GamesGrid;
