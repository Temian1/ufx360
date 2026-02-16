import React, { useMemo, useState } from 'react';
import { BetSelection, LiveMatch } from '../types';

interface AllSportsViewProps {
  matches: LiveMatch[];
  selectedSport?: string;
  onSportChange?: (sport: string) => void;
  onMatchSelect: (match: LiveMatch) => void;
  onAddBet: (selection: BetSelection) => void;
}

const sportsList = [
  { name: 'All', icon: 'apps', value: 'All' },
  { name: 'Football', icon: 'sports_soccer', value: 'Soccer' },
  { name: 'Tennis', icon: 'sports_tennis', value: 'Tennis' },
  { name: 'Cricket', icon: 'sports_cricket', value: 'Cricket' },
];

const sportIcons: Record<string, string> = {
  Soccer: 'sports_soccer',
  Tennis: 'sports_tennis',
  Cricket: 'sports_cricket',
};

const AllSportsView: React.FC<AllSportsViewProps> = ({ matches, selectedSport = 'All', onSportChange, onMatchSelect, onAddBet }) => {
  const [sportFilter, setSportFilter] = useState<string>(selectedSport);
  const [expandedLeagues, setExpandedLeagues] = useState<Set<string>>(new Set(['all']));

  React.useEffect(() => {
    setSportFilter(selectedSport);
  }, [selectedSport]);

  const filtered = useMemo(() => {
    if (sportFilter === 'All') return matches;
    return matches.filter((m) => m.sport === sportFilter);
  }, [matches, sportFilter]);

  // Group by sport, then by league
  const grouped = useMemo(() => {
    const map: Record<string, Record<string, LiveMatch[]>> = {};
    filtered.forEach((m) => {
      if (!map[m.sport]) map[m.sport] = {};
      const league = m.league || 'Other';
      if (!map[m.sport][league]) map[m.sport][league] = [];
      map[m.sport][league].push(m);
    });
    return map;
  }, [filtered]);

  const sportOptions = useMemo(() => {
    const available = new Set(matches.map((m) => m.sport));
    return sportsList.filter((s) => s.value === 'All' || available.has(s.value));
  }, [matches]);


  const handleSport = (value: string) => {
    setSportFilter(value);
    onSportChange?.(value);
    // Expand all leagues when switching sport
    setExpandedLeagues(new Set(['all']));
  };

  const formatScore = (score?: number) => (typeof score === 'number' ? score.toString() : '-');

  return (
    <div className="space-y-0">
      {/* Sport Categories - matching home SubHeader style */}
      <div className="bg-white dark:bg-dark-header p-3 sticky top-[56px] z-40 border-b border-gray-200 dark:border-gray-700/50">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {sportOptions.map((sport) => (
            <button
              key={sport.name}
              onClick={() => handleSport(sport.value)}
              className="flex flex-col items-center min-w-[60px] cursor-pointer group"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition duration-300 ${sportFilter === sport.value ? 'bg-primary' : 'bg-gray-200 dark:bg-white/10 group-hover:bg-primary'}`}>
                <span className={`material-symbols-outlined text-xl transition ${sportFilter === sport.value ? 'text-white' : 'text-gray-600 dark:text-gray-300 group-hover:text-white'}`}>
                  {sport.icon}
                </span>
              </div>
              <span className={`text-xs text-center leading-tight transition ${sportFilter === sport.value ? 'text-primary dark:text-white font-bold' : 'text-gray-600 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-white'}`}>
                {sport.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Results Count */}
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-tight">
            {sportFilter === 'All' ? 'All Sports' : sportFilter}
          </h2>
          <span className="text-[11px] text-gray-400 font-medium">{filtered.length} matches</span>
        </div>

        {filtered.length === 0 && (
          <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-8 text-center border border-dashed border-gray-200 dark:border-gray-700">
            <span className="material-symbols-outlined text-3xl text-gray-300 dark:text-gray-600 mb-2">search_off</span>
            <p className="text-sm text-gray-500">No matches available in this sport right now.</p>
          </div>
        )}

        {/* Grouped by sport > league */}
        {Object.entries(grouped).map(([sport, leagues]) => (
          <div key={sport} className="space-y-2">
            {/* Sport Header (only show when viewing All) */}
            {sportFilter === 'All' && (
              <div className="flex items-center gap-2 px-1 pt-2">
                <span className="material-symbols-outlined text-sm text-gray-400">{sportIcons[sport] || 'sports'}</span>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{sport}</span>
                <span className="text-[10px] bg-gray-100 dark:bg-white/5 text-gray-500 px-1.5 py-0.5 rounded-full font-bold">
                  {Object.values(leagues).reduce((sum, arr) => sum + arr.length, 0)}
                </span>
              </div>
            )}

            {Object.entries(leagues).map(([league, leagueMatches]) => {
              const leagueKey = `${sport}-${league}`;
              const isExpanded = expandedLeagues.has('all') || expandedLeagues.has(leagueKey);

              return (
                <div key={leagueKey} className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
                  {/* League Header */}
                  <button
                    onClick={() => {
                      // Remove 'all' and toggle specific league
                      setExpandedLeagues((prev) => {
                        const next = new Set(prev);
                        next.delete('all');
                        if (next.has(leagueKey)) next.delete(leagueKey);
                        else next.add(leagueKey);
                        return next;
                      });
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-black/20 border-b border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-black/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {sportFilter !== 'All' && (
                        <span className="material-symbols-outlined text-sm text-gray-400">{sportIcons[sport] || 'sports'}</span>
                      )}
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{league}</span>
                      <span className="text-[10px] text-gray-400 font-medium">{leagueMatches.length}</span>
                    </div>
                    <span className={`material-symbols-outlined text-sm text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>

                  {/* Matches */}
                  {isExpanded && (
                    <div className="divide-y divide-gray-50 dark:divide-white/5">
                      {/* Odds Header */}
                      <div className="flex items-center justify-end gap-1.5 px-3 py-1 bg-gray-50/50 dark:bg-black/10">
                        <span className="w-12 text-center text-[10px] font-bold text-gray-400 uppercase">1</span>
                        {leagueMatches[0]?.oddsX !== '-' && (
                          <span className="w-12 text-center text-[10px] font-bold text-gray-400 uppercase">X</span>
                        )}
                        <span className="w-12 text-center text-[10px] font-bold text-gray-400 uppercase">2</span>
                      </div>

                      {leagueMatches.map((match) => (
                        <div
                          key={match.id}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                          onClick={() => onMatchSelect(match)}
                        >
                          {/* Match Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{match.team1}</span>
                              </div>
                              {match.isLive && match.score1 != null && (
                                <span className="text-xs font-black text-gray-900 dark:text-white tabular-nums w-5 text-right">{formatScore(match.score1)}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{match.team2}</span>
                              </div>
                              {match.isLive && match.score2 != null && (
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

                          {/* Odds Buttons */}
                          <div className="flex gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => onAddBet({ id: `${match.id}-1`, matchTitle: `${match.team1} v ${match.team2}`, marketName: 'Match Winner', selectionName: match.team1, odds: match.odds1 })}
                              className="w-12 h-9 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-primary dark:hover:border-bet-yellow text-xs font-black text-primary dark:text-bet-yellow transition-colors active:scale-95"
                            >
                              {match.odds1}
                            </button>
                            {match.oddsX !== '-' && (
                              <button
                                onClick={() => onAddBet({ id: `${match.id}-x`, matchTitle: `${match.team1} v ${match.team2}`, marketName: 'Match Winner', selectionName: 'Draw', odds: match.oddsX })}
                                className="w-12 h-9 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-primary dark:hover:border-bet-yellow text-xs font-black text-primary dark:text-bet-yellow transition-colors active:scale-95"
                              >
                                {match.oddsX}
                              </button>
                            )}
                            <button
                              onClick={() => onAddBet({ id: `${match.id}-2`, matchTitle: `${match.team1} v ${match.team2}`, marketName: 'Match Winner', selectionName: match.team2, odds: match.odds2 })}
                              className="w-12 h-9 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-primary dark:hover:border-bet-yellow text-xs font-black text-primary dark:text-bet-yellow transition-colors active:scale-95"
                            >
                              {match.odds2}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllSportsView;
