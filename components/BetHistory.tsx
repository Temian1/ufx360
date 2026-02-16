import React, { useState } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { PlacedBet } from '../types';

interface BetHistoryProps {
  bets: PlacedBet[];
  onCashOut?: (betId: string, amount: number) => void;
  onBrowse?: () => void;
}

const BetHistory: React.FC<BetHistoryProps> = ({ bets, onCashOut, onBrowse }) => {
  const { t, formatCurrency } = useTranslation();
  const [activeTab, setActiveTab] = useState<'open' | 'settled'>('open');

  const filteredBets = bets.filter(bet => {
      if (activeTab === 'open') return bet.status === 'Open';
      return bet.status !== 'Open';
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-gray-100 dark:bg-dark-bg min-h-screen pb-20">
      <div className="bg-primary dark:bg-dark-header p-4 sticky top-[56px] z-40 shadow-md">
        <h1 className="text-white font-bold text-lg">{t('bet_history.title')}</h1>
      </div>

      <div className="bg-white dark:bg-surface-dark shadow-sm">
        <div className="flex">
            <button 
                onClick={() => setActiveTab('open')}
                className={`flex-1 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'open' ? 'border-primary text-primary dark:border-bet-yellow dark:text-bet-yellow' : 'border-transparent text-gray-500'}`}
            >
                {t('bet_history.open')} ({bets.filter(b => b.status === 'Open').length})
            </button>
            <button 
                onClick={() => setActiveTab('settled')}
                className={`flex-1 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'settled' ? 'border-primary text-primary dark:border-bet-yellow dark:text-bet-yellow' : 'border-transparent text-gray-500'}`}
            >
                {t('bet_history.settled')} ({bets.filter(b => b.status !== 'Open').length})
            </button>
        </div>
      </div>

      <div className="p-3 space-y-3 max-w-3xl mx-auto">
        {filteredBets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-6 animate-in fade-in zoom-in-95">
                <div className="w-24 h-24 bg-gray-200 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <span className="material-symbols-outlined text-5xl text-gray-400 dark:text-gray-500 opacity-80">
                        {activeTab === 'open' ? 'receipt_long' : 'history_edu'}
                    </span>
                </div>
                <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2">
                    {activeTab === 'open' ? t('bet_history.no_open_bets') : t('bet_history.no_settled_bets')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto mb-8 leading-relaxed">
                    {activeTab === 'open' 
                        ? t('bet_history.no_open_desc')
                        : t('bet_history.no_settled_desc')}
                </p>
                <button 
                    onClick={onBrowse}
                    className="bg-bet-yellow text-black font-bold py-3 px-8 rounded-full shadow-lg hover:bg-yellow-400 hover:shadow-xl transition transform active:scale-95 flex items-center gap-2"
                >
                    <span>{t('bet_history.view_live_odds')}</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>
        ) : (
            filteredBets.map(bet => {
                const cashOutValue = (parseFloat(bet.stake) * 0.95).toFixed(2); // Mock: 95% of stake

                return (
                    <div key={bet.id} className="bg-white dark:bg-surface-dark rounded shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                        <div className="bg-gray-50 dark:bg-black/20 p-2 px-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                {bet.selections.length > 1 ? `${bet.selections.length}${t('bet_history.accumulator')}` : t('bet_history.single_bet')}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">{new Date(bet.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                    bet.status === 'Won' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    bet.status === 'Lost' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                    bet.status === 'Cashed Out' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                    'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                    {bet.status === 'Won' ? t('bet_history.status_won') :
                                     bet.status === 'Lost' ? t('bet_history.status_lost') :
                                     bet.status === 'Cashed Out' ? t('bet_history.status_cashed_out') :
                                     t('bet_history.status_open')}
                                </span>
                            </div>
                        </div>
                        
                        <div className="p-3 space-y-3">
                            {bet.selections.map((sel, idx) => (
                                <div key={idx} className="flex justify-between items-start">
                                    <div>
                                        <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                            {sel.selectionName}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {sel.marketName}
                                        </div>
                                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                            {sel.matchTitle}
                                        </div>
                                    </div>
                                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-bet-yellow font-bold px-1.5 py-0.5 rounded text-xs">
                                        {sel.odds}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gray-50 dark:bg-black/10 p-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">{t('bet_history.stake')}</span>
                                <span className="text-sm font-bold text-gray-800 dark:text-white">{formatCurrency(parseFloat(bet.stake))}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs text-gray-500">{t('bet_history.return')}</span>
                                <span className={`text-sm font-bold ${
                                    bet.status === 'Won' ? 'text-green-600 dark:text-green-400' : 
                                    bet.status === 'Lost' ? 'text-red-500 dark:text-red-400' :
                                    'text-gray-800 dark:text-white'
                                }`}>
                                    {formatCurrency(parseFloat(bet.potentialReturn))}
                                </span>
                            </div>
                        </div>
                        
                        {bet.status === 'Open' && (
                            <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                                <button 
                                    onClick={() => onCashOut?.(bet.id, parseFloat(cashOutValue))}
                                    className="bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-primary dark:text-bet-yellow text-xs font-bold py-2 px-6 rounded-full transition flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-sm">payments</span>
                                    {t('bet_history.cash_out')} {formatCurrency(parseFloat(cashOutValue))}
                                </button>
                            </div>
                        )}
                    </div>
                );
            })
        )}
      </div>
    </div>
  );
};

export default BetHistory;