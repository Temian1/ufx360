import React, { useState } from 'react';
import { BetSelection, PlacedBet } from '../types';
import { useTranslation } from '../contexts/TranslationContext';

interface BetSlipProps {
  selections: BetSelection[];
  onRemove: (id: string) => void;
  onClose: () => void;
  onPlaceBet: (bet: Omit<PlacedBet, 'userId' | 'username'>) => void;
  isLoggedIn: boolean;
  onLoginRequired: () => void;
}

const BetSlip: React.FC<BetSlipProps> = ({ selections, onRemove, onClose, onPlaceBet, isLoggedIn, onLoginRequired }) => {
  const { t } = useTranslation();
  const [stake, setStake] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (selections.length === 0) return null;

  const hasInvalidOdds = selections.some((s) => !Number.isFinite(parseFloat(s.odds)));
  const totalOdds = hasInvalidOdds ? 0 : selections.reduce((acc, curr) => acc * parseFloat(curr.odds), 1);
  const potentialReturn = stake && !hasInvalidOdds ? (parseFloat(stake) * totalOdds).toFixed(2) : '0.00';

  const handlePlaceBet = () => {
    if (!isLoggedIn) {
        onLoginRequired();
        return;
    }

    if (hasInvalidOdds) {
        alert(t('betslip.invalid_odds_alert'));
        return;
    }

    if (!stake || parseFloat(stake) <= 0) return;

    const newBet: Omit<PlacedBet, 'userId' | 'username'> = {
        id: Date.now().toString(),
        selections: [...selections],
        stake,
        totalOdds: totalOdds.toFixed(2),
        potentialReturn,
        status: 'Open',
        date: new Date().toISOString()
    };

    onPlaceBet(newBet);
    setStake('');
  };

  return (
    <div className={`fixed z-[70] ${isFullScreen ? 'inset-0' : 'bottom-[56px] left-0 right-0 px-2 pb-2'}`}>
      {/* Header Bar */}
      <div className={`bg-gradient-to-r from-primary to-emerald-700 dark:from-dark-header dark:to-gray-900 text-white shadow-lg ${isFullScreen ? 'rounded-none' : 'rounded-t-2xl'}`}>
        <div className="flex justify-between items-center px-4 py-3">
            <div className="flex items-center gap-2.5">
                <div className="bg-bet-yellow text-black font-black w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-sm">
                    {selections.length}
                </div>
                <span className="font-bold text-sm tracking-wide">{t('betslip.title')}</span>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setIsFullScreen((v) => !v)}
                    className="w-7 h-7 rounded bg-white/10 flex items-center justify-center hover:bg-white/20"
                    title={isFullScreen ? 'Exit full screen' : 'Open full screen'}
                >
                    <span className="material-symbols-outlined text-sm">{isFullScreen ? 'close_fullscreen' : 'open_in_full'}</span>
                </button>
                <button
                    onClick={() => setIsExpanded((v) => !v)}
                    className="w-7 h-7 rounded bg-white/10 flex items-center justify-center hover:bg-white/20"
                    title={isExpanded ? 'Hide betslip' : 'Show betslip'}
                >
                    <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>expand_less</span>
                </button>
                <button
                    onClick={onClose}
                    className="w-7 h-7 rounded bg-white/10 flex items-center justify-center hover:bg-red-500/60"
                    title={t('betslip.clear')}
                >
                    <span className="material-symbols-outlined text-sm">close</span>
                </button>
            </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className={`bg-white dark:bg-surface-dark border-x border-b border-gray-100 dark:border-white/5 shadow-lg overflow-y-auto p-4 animate-in slide-in-from-bottom-5 duration-300 ${isFullScreen ? 'rounded-none h-[calc(100vh-56px)]' : 'rounded-b-2xl max-h-[60vh]'}`}>
            
            {/* Selections List */}
            <div className="space-y-3 mb-6">
                {selections.map((sel) => (
                    <div key={sel.id} className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl p-3 flex justify-between items-start relative group transition-all hover:bg-gray-100 dark:hover:bg-white/10">
                        <div className="pr-8">
                            <div className="font-bold text-sm text-gray-900 dark:text-white leading-tight mb-1">{sel.selectionName}</div>
                            <div className="text-xs font-medium text-primary dark:text-bet-yellow mb-0.5">{sel.marketName}</div>
                            <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">{sel.matchTitle}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="bg-white dark:bg-black/40 text-gray-900 dark:text-bet-yellow font-black px-2.5 py-1.5 rounded-lg text-sm shadow-sm border border-gray-100 dark:border-white/10 min-w-[3rem] text-center">
                                {sel.odds}
                            </span>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onRemove(sel.id); }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-red-500 hover:text-white transition shadow-sm opacity-0 group-hover:opacity-100"
                        >
                            <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                    </div>
                ))}
            </div>

            {hasInvalidOdds && (
                <div className="mb-4 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">warning</span>
                    {t('betslip.invalid_odds')}
                </div>
            )}

            {/* Stake Input */}
            <div className="bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 p-4 rounded-xl mb-6">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {selections.length > 1 ? `${selections.length}${t('betslip.acca')}` : t('betslip.single')}
                    </span>
                    <div className="flex items-center gap-1">
                         <span className="text-xs text-gray-400">{t('betslip.total_odds')}:</span>
                        <span className="text-sm text-primary dark:text-bet-yellow font-black bg-white dark:bg-white/10 px-2 py-0.5 rounded shadow-sm">
                            {totalOdds.toFixed(2)}
                        </span>
                    </div>
                </div>
                
                <div className="relative mb-2 group">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold group-focus-within:text-primary transition-colors">$</span>
                    <input
                        type="number"
                        value={stake}
                        onChange={(e) => setStake(e.target.value)}
                        placeholder={t('betslip.stake_placeholder')}
                        className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl py-3 pl-8 pr-4 text-base font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:font-normal placeholder:text-gray-400"
                    />
                </div>
                <div className="flex gap-1.5 mb-3">
                    {[5, 10, 25, 50, 100].map(amt => (
                        <button key={amt} onClick={() => setStake(amt.toString())} className="flex-1 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-primary/5 hover:border-primary/30 hover:text-primary dark:hover:text-bet-yellow transition-all active:scale-95">
                            ${amt}
                        </button>
                    ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-white/5">
                    <span className="text-xs font-bold text-gray-500 uppercase">{t('betslip.potential_returns')}</span>
                    <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight">${potentialReturn}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                  onClick={onClose}
                  className="col-span-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-bold uppercase text-xs py-3.5 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 active:scale-95 transition border border-transparent hover:border-gray-300 dark:hover:border-white/10"
              >
                  {t('betslip.clear')}
              </button>
              <button 
                  onClick={handlePlaceBet}
                  className="col-span-2 bg-gradient-to-r from-bet-yellow to-yellow-400 hover:from-yellow-300 hover:to-yellow-500 text-gray-900 font-black uppercase text-sm py-3.5 rounded-xl shadow-lg shadow-yellow-500/20 active:scale-95 transition-all flex justify-center items-center gap-2 group"
              >
                  {isLoggedIn ? t('betslip.place_bet') : t('betslip.login_to_bet')}
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default BetSlip;
