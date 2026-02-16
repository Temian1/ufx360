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

// SVG Icons
const ExpandIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
  </svg>
);

const ShrinkIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/>
  </svg>
);

const ChevronUpIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
);

const MinimizeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const WarningIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const SlipIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);

const BetSlip: React.FC<BetSlipProps> = ({ selections, onRemove, onClose, onPlaceBet, isLoggedIn, onLoginRequired }) => {
  const { t } = useTranslation();
  const [stake, setStake] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

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
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsFullScreen(false);
    setIsExpanded(true);
  };

  // Floating minimized icon
  if (isMinimized) {
    return (
      <div className="fixed bottom-[136px] right-4 z-[70]">
        <button
          onClick={() => setIsMinimized(false)}
          className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary to-emerald-700 dark:from-gray-800 dark:to-gray-900 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all active:scale-95 border-2 border-white/20 dark:border-bet-yellow/30"
          title="Open Bet Slip"
        >
          <SlipIcon />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-bet-yellow text-black text-[10px] font-black rounded-full flex items-center justify-center border border-white dark:border-gray-900">
            {selections.length}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed z-[70] ${isFullScreen ? 'inset-0' : 'bottom-[56px] left-0 right-0 px-2 pb-2'}`}>
      {/* Header */}
      <div className={`bg-white dark:bg-dark-header border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white ${isFullScreen ? 'rounded-none' : 'rounded-t-xl'}`}>
        <div className="flex justify-between items-center px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-bet-yellow text-black font-black flex items-center justify-center text-[10px]">
              {selections.length}
            </div>
            <span className="font-black text-xs uppercase tracking-tight">{t('betslip.title')}</span>
            <span className="text-[10px] text-gray-400 font-medium tabular-nums">
              {totalOdds.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsFullScreen((v) => !v)}
              className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors text-gray-500 dark:text-gray-400"
            >
              {isFullScreen ? <ShrinkIcon /> : <ExpandIcon />}
            </button>
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors text-gray-500 dark:text-gray-400"
            >
              <ChevronUpIcon className={`transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`} />
            </button>
            <button
              onClick={handleMinimize}
              className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors text-gray-500 dark:text-gray-400"
            >
              <MinimizeIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className={`bg-white dark:bg-surface-dark border-x border-b border-gray-200 dark:border-white/10 overflow-y-auto p-3 ${isFullScreen ? 'rounded-none h-[calc(100vh-44px)]' : 'rounded-b-xl max-h-[55vh]'}`}>

          {/* Selections */}
          <div className="space-y-2 mb-3">
            {selections.map((sel) => (
              <div key={sel.id} className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-lg p-2.5 flex items-center justify-between gap-2 relative group">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-gray-900 dark:text-white truncate">{sel.selectionName}</div>
                  <div className="text-[10px] text-primary dark:text-bet-yellow font-medium truncate">{sel.marketName}</div>
                  <div className="text-[9px] text-gray-400 uppercase tracking-wide truncate">{sel.matchTitle}</div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="bg-white dark:bg-black/30 text-gray-900 dark:text-bet-yellow font-black px-2 py-1 rounded-lg text-xs border border-gray-100 dark:border-white/10 tabular-nums">
                    {sel.odds}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemove(sel.id); }}
                    className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-red-500 hover:text-white transition opacity-0 group-hover:opacity-100"
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {hasInvalidOdds && (
            <div className="mb-3 text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-2 flex items-center gap-1.5">
              <WarningIcon />
              {t('betslip.invalid_odds')}
            </div>
          )}

          {/* Stake */}
          <div className="bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 p-3 rounded-lg mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {selections.length > 1 ? `${selections.length}${t('betslip.acca')}` : t('betslip.single')}
              </span>
              <span className="text-xs text-primary dark:text-bet-yellow font-black tabular-nums">
                @ {totalOdds.toFixed(2)}
              </span>
            </div>

            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
              <input
                type="number"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                placeholder={t('betslip.stake_placeholder')}
                className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-lg py-2.5 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:font-normal placeholder:text-gray-400"
              />
            </div>
            <div className="flex gap-1 mb-2">
              {[5, 10, 25, 50, 100].map(amt => (
                <button
                  key={amt}
                  onClick={() => setStake(amt.toString())}
                  className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-all active:scale-95 ${
                    stake === amt.toString()
                      ? 'bg-primary text-white'
                      : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-primary/30'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-white/5">
              <span className="text-[10px] font-bold text-gray-400 uppercase">{t('betslip.potential_returns')}</span>
              <span className="text-lg font-black text-gray-900 dark:text-white tabular-nums">${potentialReturn}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={onClose}
              className="col-span-1 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] py-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 active:scale-95 transition border border-gray-200 dark:border-white/10"
            >
              {t('betslip.clear')}
            </button>
            <button
              onClick={handlePlaceBet}
              className="col-span-2 bg-bet-yellow hover:bg-yellow-400 text-gray-900 font-black uppercase text-xs py-2.5 rounded-lg active:scale-95 transition-all flex justify-center items-center gap-1.5 group"
            >
              {isLoggedIn ? t('betslip.place_bet') : t('betslip.login_to_bet')}
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BetSlip;
