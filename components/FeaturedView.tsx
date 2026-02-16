import React, { useMemo } from 'react';
import { BetSelection, LiveMatch } from '../types';

interface FeaturedViewProps {
  matches: LiveMatch[];
  onMatchSelect: (match: LiveMatch) => void;
  onAddBet: (selection: BetSelection) => void;
}

const sportIcons: Record<string, string> = {
  Soccer: 'sports_soccer',
  Tennis: 'sports_tennis',
  Basketball: 'sports_basketball',
  Cricket: 'sports_cricket',
  'American Football': 'sports_football',
  Esports: 'sports_esports',
  Baseball: 'sports_baseball',
  Hockey: 'sports_hockey',
};

const FeaturedView: React.FC<FeaturedViewProps> = ({ matches, onMatchSelect, onAddBet }) => {
  const featured = matches.slice(0, 16);

  const grouped = useMemo(() => {
    const map: Record<string, Record<string, LiveMatch[]>> = {};
    featured.forEach((m) => {
      if (!map[m.sport]) map[m.sport] = {};
      const league = m.league || 'Other';
      if (!map[m.sport][league]) map[m.sport][league] = [];
      map[m.sport][league].push(m);
    });
    return map;
  }, [featured]);

  const formatScore = (score?: number) => (typeof score === 'number' ? score.toString() : '-');

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="bg-white dark:bg-dark-header p-3 sticky top-14 z-40 border-b border-gray-200 dark:border-gray-700/50">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-bet-yellow" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          <span className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-tight">Featured Bets</span>
          <span className="text-[10px] bg-bet-yellow/20 text-bet-yellow px-2 py-0.5 rounded-full font-bold border border-bet-yellow/30">
            {featured.length} picks
          </span>
        </div>
      </div>

      <div className="p-3 space-y-2">
        {Object.entries(grouped).map(([sport, leagues]) => (
          <div key={sport} className="space-y-2">
            {Object.entries(leagues).map(([league, leagueMatches]) => (
              <div key={`${sport}-${league}`} className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
                {/* League Header */}
                <div className="flex items-center justify-between px-3 py-1.5 bg-gray-50 dark:bg-black/20 border-b border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-gray-400">{sportIcons[sport] || 'sports'}</span>
                    <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400">{league}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{leagueMatches.length}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-12 text-center text-[9px] font-bold text-gray-400 uppercase">1</span>
                    {leagueMatches[0]?.oddsX !== '-' && (
                      <span className="w-12 text-center text-[9px] font-bold text-gray-400 uppercase">X</span>
                    )}
                    <span className="w-12 text-center text-[9px] font-bold text-gray-400 uppercase">2</span>
                  </div>
                </div>

                <div className="divide-y divide-gray-50 dark:divide-white/5">
                  {leagueMatches.map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/2 transition-colors cursor-pointer"
                      onClick={() => onMatchSelect(match)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate flex-1">{match.team1}</span>
                          {match.score1 != null && (
                            <span className="text-xs font-black text-gray-900 dark:text-white tabular-nums w-5 text-right">{formatScore(match.score1)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate flex-1">{match.team2}</span>
                          {match.score2 != null && (
                            <span className="text-xs font-black text-gray-900 dark:text-white tabular-nums w-5 text-right">{formatScore(match.score2)}</span>
                          )}
                        </div>
                        {match.isLive && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-bold text-red-500 tabular-nums">{match.time}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onAddBet({ id: `${match.id}-featured-1`, matchTitle: `${match.team1} v ${match.team2}`, marketName: 'Featured Winner', selectionName: match.team1, odds: match.odds1 })}
                          className="w-12 h-9 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-primary dark:hover:border-bet-yellow text-xs font-black text-primary dark:text-bet-yellow transition-colors active:scale-95"
                        >
                          {match.odds1}
                        </button>
                        {match.oddsX !== '-' && (
                          <button
                            onClick={() => onAddBet({ id: `${match.id}-featured-x`, matchTitle: `${match.team1} v ${match.team2}`, marketName: 'Featured Winner', selectionName: 'Draw', odds: match.oddsX })}
                            className="w-12 h-9 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-primary dark:hover:border-bet-yellow text-xs font-black text-primary dark:text-bet-yellow transition-colors active:scale-95"
                          >
                            {match.oddsX}
                          </button>
                        )}
                        <button
                          onClick={() => onAddBet({ id: `${match.id}-featured-2`, matchTitle: `${match.team1} v ${match.team2}`, marketName: 'Featured Winner', selectionName: match.team2, odds: match.odds2 })}
                          className="w-12 h-9 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-primary dark:hover:border-bet-yellow text-xs font-black text-primary dark:text-bet-yellow transition-colors active:scale-95"
                        >
                          {match.odds2}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedView;
