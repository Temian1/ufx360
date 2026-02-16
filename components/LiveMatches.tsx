import React, { useState, useEffect } from 'react';
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

// Flashing Odds Button Component
const OddsButton: React.FC<{ 
    label: string, 
    odds: string, 
    onClick: (e: React.MouseEvent) => void 
}> = ({ label, odds, onClick }) => {
    const [prevOdds, setPrevOdds] = useState(odds);
    const [flashClass, setFlashClass] = useState('');

    useEffect(() => {
        if (odds !== prevOdds) {
            const isUp = parseFloat(odds) > parseFloat(prevOdds);
            setFlashClass(isUp ? 'bg-green-500 text-white shadow-green-500/50' : 'bg-red-500 text-white shadow-red-500/50');
            
            const timer = setTimeout(() => {
                setFlashClass('');
            }, 1000); 

            setPrevOdds(odds);
            return () => clearTimeout(timer);
        }
    }, [odds, prevOdds]);

    if (odds === '-') return <div className="w-14 h-10"></div>;

    return (
        <button 
            className={`flex flex-col items-center justify-center w-14 h-11 rounded-lg text-xs font-bold transition-all duration-300 shadow-sm border border-transparent ${
                flashClass 
                ? flashClass 
                : 'bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 border-gray-100 dark:border-white/5 hover:border-primary dark:hover:border-bet-yellow'
            } active:scale-95`}
            onClick={onClick}
        >
            <span className="opacity-70 text-[10px] uppercase tracking-wider">{label}</span>
            <span className={`font-black text-sm ${flashClass ? 'text-white' : 'text-primary dark:text-bet-yellow'}`}>{odds}</span>
        </button>
    );
};

const LiveMatches: React.FC<LiveMatchesProps> = ({ matches, onMatchesUpdate, onMatchSelect, onAddBet, searchTerm, sportFilter = 'All' }) => {
  const { t } = useTranslation();

  // Filter matches
  const filteredMatches = matches.filter(m => {
    const matchesSport = sportFilter === 'All' ? true : m.sport === sportFilter;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return matchesSport && (m.team1.toLowerCase().includes(term) || m.team2.toLowerCase().includes(term) || m.sport.toLowerCase().includes(term));
  }).filter((m) => (sportFilter === 'All' ? true : m.sport === sportFilter));

  // Simulate Odds Changes
  useEffect(() => {
    const interval = setInterval(() => {
      const updated = matches.map((m) => {
        if (Math.random() > 0.8) {
          const change = (Math.random() - 0.5) * 0.1;
          return {
            ...m,
            odds1: (parseFloat(m.odds1) + change).toFixed(2),
          };
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
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </div>
        <h3 className="text-lg font-black text-gray-800 dark:text-white uppercase tracking-tight italic">{t('live.title')}</h3>
      </div>

      {filteredMatches.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm italic bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
              {t('live.no_matches')}
          </div>
      ) : (
          <div className="space-y-4">
              {filteredMatches.map((match) => (
                <div 
                    key={match.id} 
                    className="group bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-white/5"
                >
                    {/* Header */}
                    <div className="bg-gray-50 dark:bg-black/20 px-4 py-2 flex justify-between items-center border-b border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-gray-400">sports_soccer</span>
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{match.sport}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-red-500 font-bold text-xs bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full border border-red-100 dark:border-red-500/20">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                            <span className="tabular-nums">{match.time}</span>
                        </div>
                    </div>

                    <div 
                        className="p-4 cursor-pointer relative"
                        onClick={() => onMatchSelect(match)}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex-1 space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 shadow-inner">
                                            {match.team1.charAt(0)}
                                        </div>
                                        <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{match.team1}</span>
                                    </div>
                                    <span className="font-black text-lg text-gray-800 dark:text-white tabular-nums">1</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 shadow-inner">
                                            {match.team2.charAt(0)}
                                        </div>
                                        <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{match.team2}</span>
                                    </div>
                                    <span className="font-black text-lg text-gray-800 dark:text-white tabular-nums">0</span>
                                </div>
                            </div>
                            
                            {/* Visual Divider or Stats could go here */}
                            <div className="mx-4 h-12 w-px bg-gray-100 dark:bg-white/10 hidden sm:block"></div>

                             <div className="flex gap-2">
                                <OddsButton 
                                    label="1" 
                                    odds={match.odds1} 
                                    onClick={(e) => handleOddsClick(e, match, match.team1, match.odds1)} 
                                />
                                <OddsButton 
                                    label="X" 
                                    odds={match.oddsX} 
                                    onClick={(e) => handleOddsClick(e, match, t('live.draw'), match.oddsX)} 
                                />
                                <OddsButton 
                                    label="2" 
                                    odds={match.odds2} 
                                    onClick={(e) => handleOddsClick(e, match, match.team2, match.odds2)} 
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 dark:border-white/5 pt-3 mt-1">
                            <div className="flex gap-3">
                                <span className="flex items-center gap-1 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">bar_chart</span>
                                    {t('live.stats')}
                                </span>
                                <span className="flex items-center gap-1 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">videocam</span>
                                    {t('live.stream')}
                                </span>
                            </div>
                            <span className="text-primary dark:text-bet-yellow font-bold group-hover:underline flex items-center gap-1">
                                +{Math.floor(Math.random() * 50) + 12} {t('live.markets')}
                                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                            </span>
                        </div>
                    </div>
                </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default LiveMatches;
