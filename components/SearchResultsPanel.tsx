import React, { useRef, useEffect } from 'react';
import { LiveMatch } from '../types';
import { useTranslation } from '../contexts/TranslationContext';

interface SearchModalProps {
  isOpen: boolean;
  term: string;
  loading: boolean;
  results: LiveMatch[];
  onSearch: (term: string) => void;
  onMatchSelect: (match: LiveMatch) => void;
  onClose: () => void;
}

const sportIcons: Record<string, string> = {
  Soccer: 'sports_soccer',
  Tennis: 'sports_tennis',
  Basketball: 'sports_basketball',
  Cricket: 'sports_cricket',
  'American Football': 'sports_football',
  Baseball: 'sports_baseball',
  Hockey: 'sports_hockey',
  Esports: 'sports_esports',
};

const popularSearches = ['Arsenal', 'Liverpool', 'Lakers', 'Tennis', 'Cricket', 'NBA'];

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, term, loading, results, onSearch, onMatchSelect, onClose }) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const groupedResults: Record<string, LiveMatch[]> = {};
  results.forEach((match) => {
    if (!groupedResults[match.sport]) groupedResults[match.sport] = [];
    groupedResults[match.sport].push(match);
  });

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-[#0a0a0a] animate-in fade-in duration-200">
      {/* Search Header */}
      <div className="sticky top-0 bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-white/5 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex-shrink-0"
            >
              <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">arrow_back</span>
            </button>
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
              <input
                ref={inputRef}
                value={term}
                onChange={(e) => onSearch(e.target.value)}
                type="text"
                placeholder="Search matches, teams, or sports..."
                className="w-full bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl py-3 pl-11 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 border border-gray-200 dark:border-white/10 placeholder-gray-400"
              />
              {term && (
                <button
                  onClick={() => onSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-white/20 transition"
                >
                  <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-sm">close</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4">
          {/* No search term - show suggestions */}
          {!term.trim() && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-3 px-1">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => onSearch(s)}
                      className="px-4 py-2 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-primary/5 hover:border-primary/30 hover:text-primary dark:hover:text-bet-yellow transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-3 px-1">Browse by Sport</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(sportIcons).map(([sport, icon]) => (
                    <button
                      key={sport}
                      onClick={() => onSearch(sport)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:bg-primary/5 hover:border-primary/20 transition-all group"
                    >
                      <span className="material-symbols-outlined text-gray-400 group-hover:text-primary dark:group-hover:text-bet-yellow transition-colors">{icon}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-bet-yellow transition-colors">{sport}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading */}
          {term.trim() && loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-400">Searching...</span>
            </div>
          )}

          {/* Results */}
          {term.trim() && !loading && results.length > 0 && (
            <div className="space-y-5">
              <p className="text-xs text-gray-400 px-1">{results.length} result{results.length !== 1 ? 's' : ''} for "<span className="font-bold text-gray-600 dark:text-gray-300">{term}</span>"</p>
              {Object.entries(groupedResults).map(([sport, matches]) => (
                <div key={sport}>
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span className="material-symbols-outlined text-sm text-gray-400">{sportIcons[sport] || 'sports'}</span>
                    <h4 className="text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider">{sport}</h4>
                    <span className="text-[10px] bg-gray-100 dark:bg-white/5 text-gray-500 px-1.5 py-0.5 rounded-full font-bold">{matches.length}</span>
                  </div>
                  <div className="space-y-1">
                    {matches.map((match) => (
                      <button
                        key={match.id}
                        onClick={() => { onMatchSelect(match); onClose(); }}
                        className="w-full text-left p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] hover:bg-gray-100 dark:hover:bg-white/[0.06] border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all group"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-gray-800 dark:text-gray-200 truncate">{match.team1}</span>
                              <span className="text-xs text-gray-400">vs</span>
                              <span className="font-bold text-sm text-gray-800 dark:text-gray-200 truncate">{match.team2}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                            {match.isLive && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full">
                                <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></span>
                                {match.time}
                              </span>
                            )}
                            <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-lg group-hover:text-primary dark:group-hover:text-bet-yellow transition-colors">chevron_right</span>
                          </div>
                        </div>
                        {match.score1 != null && match.score2 != null && (
                          <div className="mt-1 text-xs text-gray-500 font-medium">
                            Score: {match.score1} - {match.score2}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {term.trim() && !loading && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-gray-300 dark:text-gray-600">search_off</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">No matches found</p>
                <p className="text-xs text-gray-400">Try searching for a different team, league, or sport</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
