import React, { useState } from 'react';

interface SubHeaderProps {
  onSearchOpen?: () => void;
  activeSport?: string;
  onSportSelect?: (sport: string) => void;
  activeCategory?: string;
  onCategorySelect?: (category: string) => void;
  liveCounts?: Record<string, number>;
}

const mobileCategories = [
  { name: 'Home', icon: 'home', value: 'home' },
  { name: 'Sports', icon: 'sports_soccer', value: 'sports' },
  { name: 'Casino', icon: 'casino', value: 'casino' },
  { name: 'Slot', icon: 'sports_esports', value: 'slot' },
  { name: 'Table', icon: 'table_restaurant', value: 'table' },
  { name: 'Fishing', icon: 'phishing', value: 'fishing' },
  { name: 'Lottery', icon: 'confirmation_number', value: 'lottery' },
  { name: 'Arcade', icon: 'stadia_controller', value: 'arcade' },
];

const desktopTabs = [
  { name: 'Home', value: 'home', badge: 0 },
  { name: 'In-Play', value: 'in-play', badge: 6 },
  { name: 'Multi Markets', value: 'multi', badge: 1 },
  { name: 'Cricket', value: 'cricket', badge: 9 },
  { name: 'Soccer', value: 'soccer', badge: 0 },
  { name: 'Tennis', value: 'tennis', badge: 0 },
];

const SubHeader: React.FC<SubHeaderProps> = ({ activeCategory = 'home', onCategorySelect, liveCounts }) => {
  const [oneClickBet, setOneClickBet] = useState(false);

  // Merge live counts into desktop tab badges
  const tabsWithCounts = desktopTabs.map((tab) => {
    if (tab.value === 'cricket' && liveCounts?.Cricket) return { ...tab, badge: liveCounts.Cricket };
    if (tab.value === 'soccer' && liveCounts?.Soccer) return { ...tab, badge: liveCounts.Soccer };
    if (tab.value === 'tennis' && liveCounts?.Tennis) return { ...tab, badge: liveCounts.Tennis };
    if (tab.value === 'in-play') {
      const total = liveCounts ? (Object.values(liveCounts) as number[]).reduce((a, b) => a + b, 0) : 6;
      return { ...tab, badge: total };
    }
    return tab;
  });

  return (
    <>
      {/* ========== DESKTOP NAV BAR ========== */}
      <div className="hidden lg:block bg-bet-yellow sticky top-[48px] z-40">
        <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between">
          {/* Left: Nav Tabs */}
          <div className="flex items-center">
            {tabsWithCounts.map((tab) => {
              const isActive = activeCategory === tab.value || (activeCategory === 'home' && tab.value === 'home');
              return (
                <button
                  key={tab.value}
                  onClick={() => onCategorySelect?.(tab.value)}
                  className={`relative px-4 py-2.5 text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-900 hover:bg-black/10'
                  }`}
                >
                  {tab.name}
                  {tab.badge > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-4 text-gray-900 text-xs font-medium">
            <span>Time Zone : <strong>GMT+5:30</strong></span>

            {/* One Click Bet Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOneClickBet(!oneClickBet)}
                className={`relative w-9 h-5 rounded-full transition-colors ${
                  oneClickBet ? 'bg-primary' : 'bg-gray-400'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    oneClickBet ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </button>
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded">One Click Bet</span>
            </div>

            <button className="flex items-center gap-1 hover:text-gray-600 transition">
              Setting
              <span className="material-symbols-outlined text-base">settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========== MOBILE CATEGORY ICONS ========== */}
      <div className="lg:hidden bg-white dark:bg-dark-header sticky top-[56px] z-40 border-b border-gray-200 dark:border-gray-700/50">
        <div className="flex overflow-x-auto no-scrollbar">
          {mobileCategories.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onCategorySelect?.(cat.value)}
                className={`flex flex-col items-center min-w-[72px] py-2.5 px-2 transition-all relative group ${
                  isActive ? '' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center mb-1 transition-all duration-300 ${
                    isActive
                      ? 'bg-bet-yellow shadow-lg shadow-bet-yellow/30'
                      : 'bg-gray-100 dark:bg-white/10 group-hover:bg-bet-yellow/20'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-xl transition ${
                      isActive
                        ? 'text-gray-900'
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-bet-yellow'
                    }`}
                  >
                    {cat.icon}
                  </span>
                </div>
                <span
                  className={`text-[10px] text-center leading-tight font-semibold transition ${
                    isActive
                      ? 'text-primary dark:text-bet-yellow font-bold'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {cat.name}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-primary dark:bg-bet-yellow rounded-t-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SubHeader;
