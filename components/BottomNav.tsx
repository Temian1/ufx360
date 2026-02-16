import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';

interface BottomNavProps {
  currentView: 'home' | 'history' | 'match' | 'all-sports' | 'in-play' | 'featured' | 'account' | 'wallet' | 'promos';
  onChangeView: (view: 'home' | 'history' | 'all-sports' | 'in-play' | 'account') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView }) => {
  const { t } = useTranslation();

  const navItems = [
    {
      id: 'all-sports' as const,
      icon: 'sports_soccer',
      label: t('nav.sports'),
      views: ['all-sports'] as string[],
    },
    {
      id: 'in-play' as const,
      icon: 'sensors',
      label: 'In-Play',
      views: ['in-play'] as string[],
      hasLiveDot: true,
    },
    {
      id: 'home' as const,
      icon: 'home',
      label: t('nav.home'),
      views: ['home', 'match', 'featured'] as string[],
      isCenter: true,
    },
    {
      id: 'history' as const,
      icon: 'library_books',
      label: 'Multi',
      views: ['history'] as string[],
    },
    {
      id: 'account' as const,
      icon: 'person',
      label: t('nav.account'),
      views: ['account', 'wallet', 'promos'] as string[],
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md border-t border-gray-200 dark:border-white/5 flex items-end justify-around pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      {navItems.map((item) => {
        const isActive = item.views.includes(currentView);

        if (item.isCenter) {
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className="flex flex-col items-center relative -mt-4"
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-primary dark:bg-bet-yellow scale-110'
                    : 'bg-primary/80 dark:bg-bet-yellow/80 hover:scale-105'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[28px] ${
                    isActive
                      ? 'text-white dark:text-gray-900 font-filled'
                      : 'text-white/80 dark:text-gray-900/80'
                  }`}
                >
                  {item.icon}
                </span>
              </div>
              <span
                className={`text-[10px] font-semibold mt-0.5 transition ${
                  isActive
                    ? 'text-primary dark:text-bet-yellow font-bold'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`flex flex-col items-center gap-0.5 w-full py-2 transition-all duration-300 relative group ${
              isActive
                ? 'text-primary dark:text-bet-yellow'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <div className="relative">
              <span
                className={`material-symbols-outlined text-[24px] transition-transform duration-300 ${
                  isActive ? 'scale-110 font-filled' : 'group-hover:scale-105'
                }`}
              >
                {item.icon}
              </span>
              {item.hasLiveDot && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white dark:border-[#1a1a1a]"></span>
              )}
            </div>
            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-primary dark:bg-bet-yellow rounded-b-full"></span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
