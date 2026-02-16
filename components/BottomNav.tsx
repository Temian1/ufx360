import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';

interface BottomNavProps {
  currentView: 'home' | 'history' | 'match' | 'all-sports' | 'in-play' | 'featured' | 'account' | 'wallet' | 'promos';
  onChangeView: (view: 'home' | 'history' | 'all-sports' | 'in-play' | 'account') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView }) => {
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md border-t border-gray-200 dark:border-white/5 flex justify-around pb-safe pt-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <button 
        onClick={() => onChangeView('home')}
        className={`flex flex-col items-center gap-1 w-full p-2 transition-all duration-300 relative group ${currentView === 'home' || currentView === 'match' ? 'text-primary dark:text-bet-yellow' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
      >
        <span className={`material-symbols-outlined text-[26px] transition-transform duration-300 ${currentView === 'home' || currentView === 'match' ? 'scale-110 font-filled' : 'group-hover:scale-105'}`}>home</span>
        <span className="text-[10px] font-medium tracking-wide">{t('nav.home')}</span>
        {(currentView === 'home' || currentView === 'match') && (
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary dark:bg-bet-yellow rounded-b-full shadow-[0_0_10px_rgba(255,223,27,0.5)]"></span>
        )}
      </button>

      <button
        onClick={() => onChangeView('all-sports')}
        className={`flex flex-col items-center gap-1 w-full p-2 transition-all duration-300 relative group ${currentView === 'all-sports' ? 'text-primary dark:text-bet-yellow' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
      >
        <span className={`material-symbols-outlined text-[26px] transition-transform duration-300 ${currentView === 'all-sports' ? 'scale-110' : 'group-hover:scale-105'}`}>grid_view</span>
        <span className="text-[10px] font-medium tracking-wide">{t('nav.sports')}</span>
        {currentView === 'all-sports' && (
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary dark:bg-bet-yellow rounded-b-full shadow-[0_0_10px_rgba(255,223,27,0.5)]"></span>
        )}
      </button>

      <button
        onClick={() => onChangeView('in-play')}
        className={`flex flex-col items-center gap-1 w-full p-2 transition-all duration-300 relative group ${currentView === 'in-play' ? 'text-primary dark:text-bet-yellow' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
      >
        <div className="relative">
          <span className={`material-symbols-outlined text-[26px] transition-transform duration-300 ${currentView === 'in-play' ? 'scale-110' : 'group-hover:scale-105'}`}>sensors</span>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white dark:border-[#1a1a1a]"></span>
        </div>
        <span className="text-[10px] font-medium tracking-wide">{t('nav.live')}</span>
        {currentView === 'in-play' && (
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary dark:bg-bet-yellow rounded-b-full shadow-[0_0_10px_rgba(255,223,27,0.5)]"></span>
        )}
      </button>

      <button 
        onClick={() => onChangeView('history')}
        className={`flex flex-col items-center gap-1 w-full p-2 transition-all duration-300 relative group ${currentView === 'history' ? 'text-primary dark:text-bet-yellow' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
      >
        <span className={`material-symbols-outlined text-[26px] transition-transform duration-300 ${currentView === 'history' ? 'scale-110' : 'group-hover:scale-105'}`}>receipt_long</span>
        <span className="text-[10px] font-medium tracking-wide">{t('nav.my_bets')}</span>
        {currentView === 'history' && (
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary dark:bg-bet-yellow rounded-b-full shadow-[0_0_10px_rgba(255,223,27,0.5)]"></span>
        )}
      </button>

      <button
        onClick={() => onChangeView('account')}
        className={`flex flex-col items-center gap-1 w-full p-2 transition-all duration-300 relative group ${currentView === 'account' || currentView === 'wallet' || currentView === 'promos' ? 'text-primary dark:text-bet-yellow' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
      >
        <span className={`material-symbols-outlined text-[26px] transition-transform duration-300 ${currentView === 'account' || currentView === 'wallet' || currentView === 'promos' ? 'scale-110 font-filled' : 'group-hover:scale-105'}`}>person</span>
        <span className="text-[10px] font-medium tracking-wide">{t('nav.account')}</span>
        {(currentView === 'account' || currentView === 'wallet' || currentView === 'promos') && (
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary dark:bg-bet-yellow rounded-b-full shadow-[0_0_10px_rgba(255,223,27,0.5)]"></span>
        )}
      </button>
    </nav>
  );
};

export default BottomNav;
