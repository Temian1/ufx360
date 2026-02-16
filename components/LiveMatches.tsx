import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { LiveMatch, BetSelection } from '../types';

interface LiveMatchesProps {
  matches: LiveMatch[];
  onMatchesUpdate?: (matches: LiveMatch[]) => void;
  onMatchSelect: (match: LiveMatch) => void;
  onAddBet: (selection: BetSelection) => void;
  searchTerm?: string;
  sportFilter?: string;
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

// Flashing Odds Button
const OddsButton: React.FC<{
  odds: string;
  onClick: (e: React.MouseEvent) => void;
}> = ({ odds, onClick }) => {
  const [prevOdds, setPrevOdds] = useState(odds);
  const [flashClass, setFlashClass] = useState('');

  useEffect(() => {
    if (odds !== prevOdds) {
      const isUp = parseFloat(odds) > parseFloat(prevOdds);
      setFlashClass(isUp ? 'bg-green-500 text-white' : 'bg-red-500 text-white');
      const timer = setTimeout(() => setFlashClass(''), 1000);
      setPrevOdds(odds);
      return () => clearTimeout(timer);
    }
  }, [odds, prevOdds]);

  if (odds === '-') return null;

  return (
    <button
      className={`w-12 h-9 rounded-lg text-xs font-black transition-all duration-300 border active:scale-95 ${
        flashClass
          ? flashClass
          : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-primary dark:hover:border-bet-yellow text-primary dark:text-bet-yellow'
      }`}
      onClick={onClick}
    >
      {odds}
    </button>
  );
};

const LiveMatches: React.FC<LiveMatchesProps> = ({ matches, onMatchesUpdate, onMatchSelect, onAddBet, searchTerm, sportFilter = 'All' }) => {
  const { t } = useTranslation();
  const formatScore = (score?: number) => (typeof score === 'number' ? score.toString() : '-');

  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      const matchesSport = sportFilter === 'All' || m.sport === sportFilter;
      if (!searchTerm) return matchesSport;
      const term = searchTerm.toLowerCase();
      return matchesSport && (m.team1.toLowerCase().includes(term) || m.team2.toLowerCase().includes(term) || m.sport.toLowerCase().includes(term));
    });
  }, [matches, sportFilter, searchTerm]);

  // Group by sport > league
  const grouped = useMemo(() => {
    const map: Record<string, Record<string, LiveMatch[]>> = {};
    filteredMatches.forEach((m) => {
      if (!map[m.sport]) map[m.sport] = {};
      const league = m.league || 'Other';
      if (!map[m.sport][league]) map[m.sport][league] = [];
      map[m.sport][league].push(m);
    });
    return map;
  }, [filteredMatches]);

  // Simulate Odds Changes
  useEffect(() => {
    const interval = setInterval(() => {
      const updated = matches.map((m) => {
        if (Math.random() > 0.8) {
          const change = (Math.random() - 0.5) * 0.1;
          return { ...m, odds1: (parseFloat(m.odds1) + change).toFixed(2) };
        }
        return m;
      });
      onMatchesUpdate?.(updated);
    }, 2000);
    return () => clearInterval(interval);
  }, [matches, onMatchesUpdate]);

  const handleOddsClick = (e: React.MouseEvent, match: LiveMatch, selectionName: string, odds: string) => {
    e.stopPropagation();
    onAddBet({
      id: `${match.id}-${selectionName}`,
      matchTitle: `${match.team1} v ${match.team2}`,
      marketName: t('live.match_winner'),
      selectionName,
      odds
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </div>
        <h3 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-tight">{t('live.title')}</h3>
        <span className="text-[10px] bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-bold border border-red-200 dark:border-red-500/20">
          {filteredMatches.length} live
        </span>
      </div>

      {filteredMatches.length === 0 ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
          {t('live.no_matches')}
        </div>
      ) : (
        <div className="space-y-2">
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

                  {/* Matches */}
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
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-bold text-red-500 tabular-nums">{match.time}</span>
                          </div>
                        </div>

                        <div className="flex gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <OddsButton odds={match.odds1} onClick={(e) => handleOddsClick(e, match, match.team1, match.odds1)} />
                          {match.oddsX !== '-' && (
                            <OddsButton odds={match.oddsX} onClick={(e) => handleOddsClick(e, match, t('live.draw'), match.oddsX)} />
                          )}
                          <OddsButton odds={match.odds2} onClick={(e) => handleOddsClick(e, match, match.team2, match.odds2)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveMatches;
