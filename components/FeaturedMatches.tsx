import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';

interface FeaturedMatchesProps {
  onViewAll?: () => void;
  onOpenMoreLegs?: () => void;
}

const FeaturedMatches: React.FC<FeaturedMatchesProps> = ({ onViewAll, onOpenMoreLegs }) => {
  const { t, formatCurrency } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-bet-yellow text-3xl drop-shadow-md">local_fire_department</span>
          <h2 className="text-xl font-black text-gray-800 dark:text-white uppercase italic tracking-tighter">{t('featured.title')} <span className="text-primary dark:text-bet-yellow">{t('featured.hot_bets')}</span></h2>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-bold px-4 py-1.5 border border-gray-300 dark:border-white/20 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition uppercase tracking-wide"
        >
          {t('featured.view_all')}
        </button>
      </div>

      <div className="flex overflow-x-auto gap-4 no-scrollbar pb-4">
        {/* Card 1: Acca Boost */}
        <div className="min-w-[300px] bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 flex flex-col group hover:shadow-md transition-all duration-300">
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-3 flex justify-between items-center text-white relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="flex items-center gap-2 relative z-10">
              <span className="material-symbols-outlined text-lg">trending_up</span>
              <span className="text-xs font-black tracking-widest uppercase">{t('featured.acca_boost')} +7.5%</span>
            </div>
            <div className="flex items-center gap-1 text-white/90 text-xs font-bold relative z-10 bg-black/20 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-sm">group</span>
              <span>6.5k</span>
            </div>
          </div>
          <div className="p-4 flex-1">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wider">{t('featured.full_time_result')}</p>
            <div className="space-y-3">
              {[
                { name: 'Leeds (v Birmingham)', color: 'text-gray-400' },
                { name: 'Wolves (v Grimsby)', color: 'text-bet-yellow' },
                { name: 'Sunderland (v Oxford)', color: 'text-red-500' },
                { name: 'Fulham (v Stoke)', color: 'text-gray-200' },
              ].map((match, i) => (
                <div key={i} className="flex justify-between items-center text-sm group/item">
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined text-lg ${match.color}`}>checkroom</span>
                    <span className="text-gray-800 dark:text-gray-200 font-bold group-hover/item:text-primary dark:group-hover/item:text-bet-yellow transition-colors">{match.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-black/40 p-4 flex justify-between items-center border-t border-gray-100 dark:border-white/5 mt-auto">
            <div className="text-xs text-gray-500 font-medium">{formatCurrency(10)} {t('featured.returns')} <span className="text-green-600 dark:text-green-400 font-bold">{formatCurrency(92.23)}</span></div>
            <button className="bg-gray-200 dark:bg-white/10 hover:bg-primary hover:text-white dark:hover:bg-bet-yellow dark:hover:text-black transition-colors px-4 py-2 rounded-lg font-black text-lg shadow-sm">
                8.65
            </button>
          </div>
        </div>

        {/* Card 2: Bet Boost */}
        <div className="min-w-[300px] bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 flex flex-col group hover:shadow-md transition-all duration-300">
          <div className="bg-gradient-to-r from-primary to-blue-700 p-3 flex justify-between items-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="flex items-center gap-2 relative z-10">
              <span className="material-symbols-outlined text-lg">bolt</span>
              <span className="text-xs font-black tracking-widest uppercase">{t('featured.bet_boost')}</span>
            </div>
            <div className="flex items-center gap-1 text-white/90 text-xs font-bold relative z-10 bg-black/20 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-sm">local_fire_department</span>
              <span>1.8k</span>
            </div>
          </div>
          <div className="p-4 flex-1">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-3 uppercase truncate">Rayo Vallecano v Atletico Madrid</p>
            <div className="space-y-3">
              {[
                'Both Teams to Score - Yes',
                'Over 1 Corners in 1st Half',
                'Over 1 Corners in 2nd Half',
              ].map((leg, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary dark:bg-bet-yellow shadow-[0_0_5px_currentColor]"></div>
                  <span className="font-medium">{leg}</span>
                </div>
              ))}
              <button onClick={onOpenMoreLegs} className="flex items-center gap-1 text-xs text-primary dark:text-bet-yellow mt-2 cursor-pointer hover:underline font-bold">
                <span className="material-symbols-outlined text-sm">add_circle</span>
                <span>{t('featured.view_more_legs')}</span>
              </button>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-black/40 p-4 flex justify-between items-center border-t border-gray-100 dark:border-white/5 mt-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm line-through text-gray-400 font-bold decoration-red-500">8.00</span>
              <span className="text-xs text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded">{t('featured.boosted')}</span>
            </div>
             <button className="bg-gray-200 dark:bg-white/10 hover:bg-primary hover:text-white dark:hover:bg-bet-yellow dark:hover:text-black transition-colors px-4 py-2 rounded-lg font-black text-lg shadow-sm">
                9.00
            </button>
          </div>
        </div>

        {/* Card 3: Bet Boost */}
        <div className="min-w-[300px] bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 flex flex-col group hover:shadow-md transition-all duration-300">
           <div className="bg-gradient-to-r from-primary to-blue-700 p-3 flex justify-between items-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="flex items-center gap-2 relative z-10">
              <span className="material-symbols-outlined text-lg">bolt</span>
              <span className="text-xs font-black tracking-widest uppercase">{t('featured.bet_boost')}</span>
            </div>
            <div className="flex items-center gap-1 text-white/90 text-xs font-bold relative z-10 bg-black/20 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-sm">local_fire_department</span>
              <span>641</span>
            </div>
          </div>
          <div className="p-4 flex-1">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-3 uppercase">Arsenal v Wigan</p>
            <div className="space-y-3">
               {[
                'Both Teams to Score',
                'Over 1.5 Shots on Target 1st Half',
                'Over 1.5 Shots on Target 2nd Half',
              ].map((leg, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                   <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary dark:bg-bet-yellow shadow-[0_0_5px_currentColor]"></div>
                  <span className="font-medium">{leg}</span>
                </div>
              ))}
              <button onClick={onOpenMoreLegs} className="flex items-center gap-1 text-xs text-primary dark:text-bet-yellow mt-2 cursor-pointer hover:underline font-bold">
                <span className="material-symbols-outlined text-sm">add_circle</span>
                <span>{t('featured.view_more_legs')}</span>
              </button>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-black/40 p-4 flex justify-between items-center border-t border-gray-100 dark:border-white/5 mt-auto">
             <div className="flex items-center gap-2">
              <span className="text-sm line-through text-gray-400 font-bold decoration-red-500">86.00</span>
              <span className="text-xs text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded">{t('featured.boosted')}</span>
            </div>
            <button className="bg-gray-200 dark:bg-white/10 hover:bg-primary hover:text-white dark:hover:bg-bet-yellow dark:hover:text-black transition-colors px-4 py-2 rounded-lg font-black text-lg shadow-sm">
                126.00
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedMatches;
