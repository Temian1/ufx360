import React from 'react';
import { LiveMatch } from '../types';

interface HomeExtraListsProps {
  matches: LiveMatch[];
  onMatchSelect: (match: LiveMatch) => void;
}

const HomeExtraLists: React.FC<HomeExtraListsProps> = ({ matches, onMatchSelect }) => {
  const topLeagues = ['Premier League', 'LaLiga', 'Serie A', 'NBA', 'ATP Tour', 'NFL', 'IPL'];
  const spotlight = matches.slice(0, 8);

  return (
    <div className="space-y-3">
      <div className="bg-white dark:bg-surface-dark rounded-md border border-gray-200 dark:border-gray-700 p-3">
        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-2">Top Leagues</h3>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {topLeagues.map((league) => (
            <span key={league} className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 whitespace-nowrap">
              {league}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-md border border-gray-200 dark:border-gray-700 p-3">
        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-2">Spotlight Live</h3>
        <div className="space-y-2">
          {spotlight.map((match) => (
            <button
              key={match.id}
              onClick={() => onMatchSelect(match)}
              className="w-full text-left p-2 rounded bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-white/10 transition"
            >
              <div className="flex justify-between items-center">
                <div className="text-xs font-bold text-gray-700 dark:text-gray-200">{match.team1} v {match.team2}</div>
                <div className="text-xxs text-green-600 font-bold">{match.time}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeExtraLists;
