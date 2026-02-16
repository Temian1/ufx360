import React from 'react';
import { LiveMatch } from '../types';

interface HomeExtraListsProps {
  matches: LiveMatch[];
  onMatchSelect: (match: LiveMatch) => void;
}

// SVG Icons
const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);

const FlameIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

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

const leagueIcons: Record<string, string> = {
  'Premier League': 'sports_soccer',
  'La Liga': 'sports_soccer',
  'Serie A': 'sports_soccer',
  'Bundesliga': 'sports_soccer',
  'Ligue 1': 'sports_soccer',
  'NBA': 'sports_basketball',
  'ATP Tour': 'sports_tennis',
  'WTA Tour': 'sports_tennis',
  'NFL': 'sports_football',
  'IPL': 'sports_cricket',
  'ICC World Cup': 'sports_cricket',
  'NHL': 'sports_hockey',
  'MLB': 'sports_baseball',
};

const HomeExtraLists: React.FC<HomeExtraListsProps> = ({ matches, onMatchSelect }) => {
  // Get unique leagues from actual matches
  const topLeagues = React.useMemo(() => {
    const leagues = new Map<string, number>();
    matches.forEach(m => {
      if (m.league) {
        leagues.set(m.league, (leagues.get(m.league) || 0) + 1);
      }
    });
    return Array.from(leagues.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));
  }, [matches]);

  const spotlight = matches.filter(m => m.isLive).slice(0, 6);

  const formatScore = (score?: number) => (typeof score === 'number' ? score.toString() : '-');

  return (
    <div className="space-y-3">
      {/* Top Leagues */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-black/20 border-b border-gray-100 dark:border-white/5">
          <span className="text-bet-yellow"><TrophyIcon /></span>
          <span className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-tight">Top Leagues</span>
          <span className="text-[10px] bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full font-bold">{topLeagues.length}</span>
        </div>
        <div className="p-2.5 flex gap-2 overflow-x-auto no-scrollbar">
          {topLeagues.map((league) => (
            <button
              key={league.name}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-primary dark:hover:border-bet-yellow text-xs font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-sm text-gray-400">{leagueIcons[league.name] || 'sports'}</span>
              {league.name}
              <span className="text-[9px] bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400 px-1 py-0.5 rounded font-bold">{league.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Spotlight Live */}
      {spotlight.length > 0 && (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-black/20 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-red-500"><FlameIcon /></span>
              <span className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-tight">Spotlight Live</span>
              <span className="text-[10px] bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full font-bold border border-red-200 dark:border-red-500/20">
                {spotlight.length} live
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-white/5">
            {spotlight.map((match) => (
              <button
                key={match.id}
                onClick={() => onMatchSelect(match)}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors text-left"
              >
                <span className="material-symbols-outlined text-sm text-gray-400">{sportIcons[match.sport] || 'sports'}</span>
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
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-bold text-red-500 tabular-nums">{match.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeExtraLists;
