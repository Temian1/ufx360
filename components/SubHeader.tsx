import React from 'react';

interface SubHeaderProps {
  onSearchOpen?: () => void;
  activeSport?: string;
  onSportSelect?: (sport: string) => void;
}

const sports = [
  { name: 'Soccer', icon: 'sports_soccer', value: 'Soccer' },
  { name: 'Tennis', icon: 'sports_tennis', value: 'Tennis' },
  { name: 'Basket', icon: 'sports_basketball', value: 'Basketball' },
  { name: 'Cricket', icon: 'sports_cricket', value: 'Cricket' },
  { name: 'NFL', icon: 'sports_football', value: 'American Football' },
  { name: 'Esports', icon: 'sports_esports', value: 'Esports' },
  { name: 'Baseball', icon: 'sports_baseball', value: 'Baseball' },
  { name: 'Hockey', icon: 'sports_hockey', value: 'Hockey' },
  { name: 'All', icon: 'apps', value: 'All' },
];

const SubHeader: React.FC<SubHeaderProps> = ({ onSearchOpen, onSportSelect, activeSport = 'All' }) => {
  return (
    <div className="bg-white dark:bg-dark-header p-3 sticky top-[56px] z-40 border-b border-gray-200 dark:border-gray-700/50">
      <button
        onClick={onSearchOpen}
        className="w-full flex items-center gap-2 bg-gray-50 dark:bg-white/5 rounded-xl py-2.5 px-4 mb-3 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-colors group"
      >
        <span className="material-symbols-outlined text-gray-400 group-hover:text-primary dark:group-hover:text-bet-yellow transition-colors text-xl">search</span>
        <span className="text-sm text-gray-400 font-medium">Search teams, leagues or sports...</span>
      </button>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {sports.map((sport) => (
          <button
            key={sport.name}
            onClick={() => onSportSelect?.(sport.value)}
            className="flex flex-col items-center min-w-[60px] cursor-pointer group"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition duration-300 ${activeSport === sport.value ? 'bg-primary' : 'bg-gray-200 dark:bg-white/10 group-hover:bg-primary'}`}>
              <span className={`material-symbols-outlined text-xl transition ${activeSport === sport.value ? 'text-white' : 'text-gray-600 dark:text-gray-300 group-hover:text-white'}`}>
                {sport.icon}
              </span>
            </div>
            <span className={`text-xs text-center leading-tight transition ${activeSport === sport.value ? 'text-primary dark:text-white font-bold' : 'text-gray-600 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-white'}`}>
              {sport.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubHeader;
