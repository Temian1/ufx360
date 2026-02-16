import React from 'react';
import { BetSelection, LiveMatch } from '../types';

interface FeaturedViewProps {
  matches: LiveMatch[];
  onMatchSelect: (match: LiveMatch) => void;
  onAddBet: (selection: BetSelection) => void;
}

const FeaturedView: React.FC<FeaturedViewProps> = ({ matches, onMatchSelect, onAddBet }) => {
  const featured = matches.slice(0, 12);

  return (
    <div className="p-3 space-y-3">
      <div className="bg-primary dark:bg-dark-header text-white rounded-md p-3">
        <h2 className="font-bold text-lg">Featured Bets</h2>
        <p className="text-xs text-green-100">Boosted and popular demo selections.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {featured.map((match) => (
          <div key={match.id} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <button onClick={() => onMatchSelect(match)} className="w-full text-left p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{match.sport}</div>
                  <div className="font-bold text-gray-800 dark:text-white">{match.team1} v {match.team2}</div>
                </div>
                <div className="text-xs text-green-600 font-bold">{match.time}</div>
              </div>
            </button>
            <div className={`grid gap-2 p-3 ${match.oddsX === '-' ? 'grid-cols-2' : 'grid-cols-3'}`}>
              <button
                onClick={() => onAddBet({ id: `${match.id}-featured-1`, matchTitle: `${match.team1} v ${match.team2}`, marketName: 'Featured Winner', selectionName: match.team1, odds: match.odds1 })}
                className="bg-gray-100 dark:bg-gray-700 rounded p-2 text-xs"
              >
                <div>{match.team1}</div>
                <div className="font-bold">{match.odds1}</div>
              </button>
              {match.oddsX !== '-' && (
                <button
                  onClick={() => onAddBet({ id: `${match.id}-featured-x`, matchTitle: `${match.team1} v ${match.team2}`, marketName: 'Featured Winner', selectionName: 'Draw', odds: match.oddsX })}
                  className="bg-gray-100 dark:bg-gray-700 rounded p-2 text-xs"
                >
                  <div>Draw</div>
                  <div className="font-bold">{match.oddsX}</div>
                </button>
              )}
              <button
                onClick={() => onAddBet({ id: `${match.id}-featured-2`, matchTitle: `${match.team1} v ${match.team2}`, marketName: 'Featured Winner', selectionName: match.team2, odds: match.odds2 })}
                className="bg-gray-100 dark:bg-gray-700 rounded p-2 text-xs"
              >
                <div>{match.team2}</div>
                <div className="font-bold">{match.odds2}</div>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedView;
