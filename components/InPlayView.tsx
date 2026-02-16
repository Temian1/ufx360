import React from 'react';
import { BetSelection, LiveMatch } from '../types';

interface InPlayViewProps {
  matches: LiveMatch[];
  onMatchSelect: (match: LiveMatch) => void;
  onAddBet: (selection: BetSelection) => void;
}

const InPlayView: React.FC<InPlayViewProps> = ({ matches, onMatchSelect, onAddBet }) => {
  const live = matches.filter((m) => m.isLive);

  return (
    <div className="p-3 space-y-3">
      <div className="bg-red-600 text-white rounded-md p-3 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg">In-Play Center</h2>
          <p className="text-xs text-red-100">{live.length} live events</p>
        </div>
        <span className="material-symbols-outlined animate-pulse">sensors</span>
      </div>

      {live.map((match) => (
        <div
          key={match.id}
          className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-md p-3"
        >
          <button className="w-full text-left" onClick={() => onMatchSelect(match)}>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{match.sport}</div>
                <div className="font-bold text-gray-800 dark:text-white">{match.team1} v {match.team2}</div>
              </div>
              <div className="text-xs font-bold text-green-600">{match.time}</div>
            </div>
          </button>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => onAddBet({ id: `${match.id}-live-home`, matchTitle: `${match.team1} v ${match.team2}`, marketName: 'Live Winner', selectionName: match.team1, odds: match.odds1 })}
              className="flex-1 bg-gray-100 dark:bg-gray-700 rounded p-2 text-xs"
            >
              {match.team1} <span className="font-bold">{match.odds1}</span>
            </button>
            <button
              onClick={() => onAddBet({ id: `${match.id}-live-away`, matchTitle: `${match.team1} v ${match.team2}`, marketName: 'Live Winner', selectionName: match.team2, odds: match.odds2 })}
              className="flex-1 bg-gray-100 dark:bg-gray-700 rounded p-2 text-xs"
            >
              {match.team2} <span className="font-bold">{match.odds2}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InPlayView;
