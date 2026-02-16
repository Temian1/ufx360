import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { PromoOffer } from '../types';

interface PromotionsViewProps {
  promos: PromoOffer[];
  onClaim: (promoId: string) => void;
  onGoWallet?: () => void;
}

// SVG Icons
const GiftIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const WalletIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>
  </svg>
);

const tagColors: Record<string, string> = {
  'New': 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
  'In-Play': 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  'Soccer': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
};

const PromotionsView: React.FC<PromotionsViewProps> = ({ promos, onClaim, onGoWallet }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="bg-white dark:bg-dark-header p-3 sticky top-14 z-40 border-b border-gray-200 dark:border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-bet-yellow"><GiftIcon /></span>
            <span className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-tight">{t('promotions.title')}</span>
            <span className="text-[10px] bg-bet-yellow/20 text-bet-yellow px-2 py-0.5 rounded-full font-bold border border-bet-yellow/30">
              {promos.filter(p => !p.claimed).length} available
            </span>
          </div>
          {onGoWallet && (
            <button
              onClick={onGoWallet}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary dark:text-bet-yellow text-xs font-bold hover:bg-primary/20 transition-colors"
            >
              <WalletIcon />
              <span>My Wallet</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Bonus Balance Card */}
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
          <div className="p-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Bonus Balance</p>
              <p className="text-lg font-black text-bet-yellow tabular-nums">${promos.filter(p => p.claimed).length * 10}.00</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Claimed</p>
              <p className="text-lg font-black text-gray-900 dark:text-white">{promos.filter(p => p.claimed).length}/{promos.length}</p>
            </div>
          </div>
          <div className="h-1 bg-gray-100 dark:bg-white/5">
            <div
              className="h-full bg-bet-yellow rounded-full transition-all duration-500"
              style={{ width: `${(promos.filter(p => p.claimed).length / promos.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Promo Cards */}
        {promos.map((promo) => (
          <div key={promo.id} className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white">{promo.title}</h3>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${tagColors[promo.tag] || 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-white/5 dark:text-gray-400 dark:border-white/10'}`}>
                      {promo.tag}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{promo.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => onClaim(promo.id)}
                  disabled={promo.claimed}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                    promo.claimed
                      ? 'bg-gray-50 dark:bg-white/5 text-gray-400 cursor-not-allowed border border-gray-200 dark:border-white/10'
                      : 'bg-bet-yellow hover:bg-yellow-400 text-gray-900 border border-bet-yellow'
                  }`}
                >
                  {promo.claimed ? (
                    <>
                      <CheckIcon />
                      {t('promotions.claimed')}
                    </>
                  ) : (
                    t('promotions.claim_offer')
                  )}
                </button>
                {promo.claimed && onGoWallet && (
                  <button
                    onClick={onGoWallet}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary dark:text-bet-yellow text-xs font-bold hover:bg-primary/20 transition-colors"
                  >
                    <WalletIcon />
                    View in Wallet
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 rounded-xl p-3 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          Claimed bonuses are credited to your wallet balance. Terms &amp; conditions apply.
        </div>
      </div>
    </div>
  );
};

export default PromotionsView;
