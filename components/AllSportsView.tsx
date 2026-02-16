import React, { useMemo, useState } from 'react';
import { BetSelection, LiveMatch } from '../types';

interface AllSportsViewProps {
  matches: LiveMatch[];
  selectedSport?: string;
  onSportChange?: (sport: string) => void;
  onMatchSelect: (match: LiveMatch) => void;
  onAddBet: (selection: BetSelection) => void;
}

const AllSportsView: React.FC<AllSportsViewProps> = ({ matches, selectedSport = 'All', onSportChange, onMatchSelect, onAddBet }) => {
  const [sportFilter, setSportFilter] = useState<string>(selectedSport);

  React.useEffect(() => {
    setSportFilter(selectedSport);
  }, [selectedSport]);

  const filtered = useMemo(() => {
    if (sportFilter === 'All') return matches;
    return matches.filter((m) => m.sport === sportFilter);
  }, [matches, sportFilter]);

  const sportOptions = useMemo(() => ['All', ...Array.from(new Set(matches.map((m) => m.sport)))], [matches]);

  return (
    <div className="p-3 space-y-3">
      <div className="bg-primary dark:bg-dark-header text-white rounded-md p-3">
        <h2 className="font-bold text-lg">All Sports</h2>
        <p className="text-xs text-green-100">Browse demo markets across sports.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {sportOptions.map((sport) => (
          <button
            key={sport}
            onClick={() => {
              setSportFilter(sport);
              onSportChange?.(sport);
            }}
            className={`px-3 py-1.5 text-xs rounded-full border transition ${
              sportFilter === sport
                ? 'bg-primary text-white border-primary'
                : 'bg-white dark:bg-surface-dark text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
            }`}
          >
            {sport}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-md p-4 text-sm text-gray-500">
            No live matches available in this sport right now.
          </div>
        )}
        {filtered.map((match) => (
          <div
            key={match.id}
            className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-md p-3"
          >
            <button className="w-full text-left" onClick={() => onMatchSelect(match)}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{match.sport}</div>
                  <div className="font-bold text-gray-800 dark:text-white text-sm">{match.team1} v {match.team2}</div>
                </div>
                <div className="text-xs text-green-600 font-bold">{match.time}</div>
              </div>
            </button>
            <div className={`grid gap-2 mt-3 ${match.oddsX === '-' ? 'grid-cols-2' : 'grid-cols-3'}`}>
              <button
                onClick={() => onAddBet({ id: `${match.id}-1`, matchTitle: `${match.team1} v ${match.team2}`, marketName: 'Match Winner', selectionName: match.team1, odds: match.odds1 })}
                className="bg-gray-100 dark:bg-gray-700 rounded p-2 text-xs"
              >
                <div>{match.team1}</div>
                <div className="font-bold">{match.odds1}</div>
              </button>
              {match.oddsX !== '-' && (
                <button
                  onClick={() => onAddBet({ id: `${match.id}-x`, matchTitle: `${match.team1} v ${match.team2}`, marketName: 'Match Winner', selectionName: 'Draw', odds: match.oddsX })}
                  className="bg-gray-100 dark:bg-gray-700 rounded p-2 text-xs"
                >
                  <div>Draw</div>
                  <div className="font-bold">{match.oddsX}</div>
                </button>
              )}
              <button
                onClick={() => onAddBet({ id: `${match.id}-2`, matchTitle: `${match.team1} v ${match.team2}`, marketName: 'Match Winner', selectionName: match.team2, odds: match.odds2 })}
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

export default AllSportsView;
