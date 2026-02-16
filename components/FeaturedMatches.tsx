import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { BetSelection } from '../types';

interface FeaturedMatchesProps {
  onViewAll?: () => void;
  onOpenMoreLegs?: () => void;
  onAddBet?: (selection: BetSelection) => void;
}

const FeaturedMatches: React.FC<FeaturedMatchesProps> = ({ onViewAll, onOpenMoreLegs, onAddBet }) => {
  const { t, formatCurrency } = useTranslation();

  const handleOddsClick = (matchTitle: string, selectionName: string, odds: string) => {
    if (!onAddBet) return;
    onAddBet({
      id: `featured-hot-${matchTitle}-${selectionName}-${Date.now()}`,
      matchTitle,
      marketName: 'Featured Hot Bet',
      selectionName,
      odds,
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-bet-yellow text-xl">local_fire_department</span>
          <h2 className="text-sm font-black text-gray-800 dark:text-white uppercase italic tracking-tighter">{t('featured.title')} <span className="text-primary dark:text-bet-yellow">{t('featured.hot_bets')}</span></h2>
        </div>
        <button
          onClick={onViewAll}
          className="text-[10px] font-bold px-3 py-1 border border-gray-300 dark:border-white/20 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition uppercase tracking-wide"
        >
          {t('featured.view_all')}
        </button>
      </div>

      <div className="flex overflow-x-auto gap-2.5 no-scrollbar pb-1">
        {/* Card 1: Acca Boost */}
        <div className="min-w-[260px] bg-white dark:bg-surface-dark rounded-xl overflow-hidden border border-gray-100 dark:border-white/5 flex flex-col">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-1.5 flex justify-between items-center text-white">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="text-[10px] font-black tracking-widest uppercase">{t('featured.acca_boost')} +7.5%</span>
            </div>
            <div className="flex items-center gap-1 text-white/80 text-[10px] font-bold bg-black/20 px-1.5 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-xs">group</span>
              <span>6.5k</span>
            </div>
          </div>
          <div className="p-2.5 flex-1">
            <p className="text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">{t('featured.full_time_result')}</p>
            <div className="space-y-1.5">
              {[
                { name: 'Leeds (v Birmingham)', color: 'text-gray-400' },
                { name: 'Wolves (v Grimsby)', color: 'text-bet-yellow' },
                { name: 'Sunderland (v Oxford)', color: 'text-red-500' },
                { name: 'Fulham (v Stoke)', color: 'text-gray-200' },
              ].map((match, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className={`material-symbols-outlined text-sm ${match.color}`}>checkroom</span>
                  <span className="text-gray-800 dark:text-gray-200 font-bold truncate">{match.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-black/30 px-2.5 py-2 flex justify-between items-center border-t border-gray-100 dark:border-white/5 mt-auto">
            <div className="text-[10px] text-gray-500 font-medium">{formatCurrency(10)} {t('featured.returns')} <span className="text-green-600 dark:text-green-400 font-bold">{formatCurrency(92.23)}</span></div>
            <button
              onClick={() => handleOddsClick('Acca Boost 4-Fold', 'Acca Boost', '8.65')}
              className="bg-gray-200 dark:bg-white/10 hover:bg-primary hover:text-white dark:hover:bg-bet-yellow dark:hover:text-black transition-colors px-3 py-1.5 rounded-lg font-black text-sm active:scale-95"
            >
              8.65
            </button>
          </div>
        </div>

        {/* Card 2: Bet Boost */}
        <div className="min-w-[260px] bg-white dark:bg-surface-dark rounded-xl overflow-hidden border border-gray-100 dark:border-white/5 flex flex-col">
          <div className="bg-gradient-to-r from-primary to-blue-700 px-3 py-1.5 flex justify-between items-center text-white">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">bolt</span>
              <span className="text-[10px] font-black tracking-widest uppercase">{t('featured.bet_boost')}</span>
            </div>
            <div className="flex items-center gap-1 text-white/80 text-[10px] font-bold bg-black/20 px-1.5 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-xs">local_fire_department</span>
              <span>1.8k</span>
            </div>
          </div>
          <div className="p-2.5 flex-1">
            <p className="text-[10px] font-bold text-gray-400 mb-1.5 uppercase truncate">Rayo Vallecano v Atletico Madrid</p>
            <div className="space-y-1.5">
              {[
                'Both Teams to Score - Yes',
                'Over 1 Corners in 1st Half',
                'Over 1 Corners in 2nd Half',
              ].map((leg, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary dark:bg-bet-yellow shrink-0"></div>
                  <span className="font-medium">{leg}</span>
                </div>
              ))}
              <button onClick={onOpenMoreLegs} className="flex items-center gap-1 text-[10px] text-primary dark:text-bet-yellow cursor-pointer hover:underline font-bold">
                <span className="material-symbols-outlined text-xs">add_circle</span>
                <span>{t('featured.view_more_legs')}</span>
              </button>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-black/30 px-2.5 py-2 flex justify-between items-center border-t border-gray-100 dark:border-white/5 mt-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-xs line-through text-gray-400 font-bold decoration-red-500">8.00</span>
              <span className="text-[9px] text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">{t('featured.boosted')}</span>
            </div>
            <button
              onClick={() => handleOddsClick('Rayo Vallecano v Atletico Madrid', 'Bet Boost 3-Fold', '9.00')}
              className="bg-gray-200 dark:bg-white/10 hover:bg-primary hover:text-white dark:hover:bg-bet-yellow dark:hover:text-black transition-colors px-3 py-1.5 rounded-lg font-black text-sm active:scale-95"
            >
              9.00
            </button>
          </div>
        </div>

        {/* Card 3: Bet Boost */}
        <div className="min-w-[260px] bg-white dark:bg-surface-dark rounded-xl overflow-hidden border border-gray-100 dark:border-white/5 flex flex-col">
          <div className="bg-gradient-to-r from-primary to-blue-700 px-3 py-1.5 flex justify-between items-center text-white">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">bolt</span>
              <span className="text-[10px] font-black tracking-widest uppercase">{t('featured.bet_boost')}</span>
            </div>
            <div className="flex items-center gap-1 text-white/80 text-[10px] font-bold bg-black/20 px-1.5 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-xs">local_fire_department</span>
              <span>641</span>
            </div>
          </div>
          <div className="p-2.5 flex-1">
            <p className="text-[10px] font-bold text-gray-400 mb-1.5 uppercase">Arsenal v Wigan</p>
            <div className="space-y-1.5">
              {[
                'Both Teams to Score',
                'Over 1.5 Shots on Target 1st Half',
                'Over 1.5 Shots on Target 2nd Half',
              ].map((leg, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary dark:bg-bet-yellow shrink-0"></div>
                  <span className="font-medium">{leg}</span>
                </div>
              ))}
              <button onClick={onOpenMoreLegs} className="flex items-center gap-1 text-[10px] text-primary dark:text-bet-yellow cursor-pointer hover:underline font-bold">
                <span className="material-symbols-outlined text-xs">add_circle</span>
                <span>{t('featured.view_more_legs')}</span>
              </button>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-black/30 px-2.5 py-2 flex justify-between items-center border-t border-gray-100 dark:border-white/5 mt-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-xs line-through text-gray-400 font-bold decoration-red-500">86.00</span>
              <span className="text-[9px] text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">{t('featured.boosted')}</span>
            </div>
            <button
              onClick={() => handleOddsClick('Arsenal v Wigan', 'Bet Boost 3-Fold', '126.00')}
              className="bg-gray-200 dark:bg-white/10 hover:bg-primary hover:text-white dark:hover:bg-bet-yellow dark:hover:text-black transition-colors px-3 py-1.5 rounded-lg font-black text-sm active:scale-95"
            >
              126.00
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedMatches;
