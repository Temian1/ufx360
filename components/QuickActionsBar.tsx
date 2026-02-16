import React from 'react';

interface QuickActionsBarProps {
  onGoPromos: () => void;
  onGoWallet: () => void;
  onGoAccount: () => void;
}

const GiftIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
);

const WalletSvg = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const QuickActionsBar: React.FC<QuickActionsBarProps> = ({ onGoPromos, onGoWallet, onGoAccount }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        onClick={onGoPromos}
        className="flex items-center gap-2.5 bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
      >
        <div className="w-9 h-9 rounded-lg bg-bet-yellow/10 flex items-center justify-center text-bet-yellow group-hover:bg-bet-yellow/20 transition-colors shrink-0">
          <GiftIcon />
        </div>
        <div className="text-left min-w-0">
          <div className="text-[10px] text-gray-400 font-medium">Promotions</div>
          <div className="text-xs font-black text-gray-800 dark:text-white">Offers</div>
        </div>
      </button>
      <button
        onClick={onGoWallet}
        className="flex items-center gap-2.5 bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
      >
        <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:bg-green-500/20 transition-colors shrink-0">
          <WalletSvg />
        </div>
        <div className="text-left min-w-0">
          <div className="text-[10px] text-gray-400 font-medium">Cashier</div>
          <div className="text-xs font-black text-gray-800 dark:text-white">Wallet</div>
        </div>
      </button>
      <button
        onClick={onGoAccount}
        className="flex items-center gap-2.5 bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
      >
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary dark:text-bet-yellow group-hover:bg-primary/20 transition-colors shrink-0">
          <UserIcon />
        </div>
        <div className="text-left min-w-0">
          <div className="text-[10px] text-gray-400 font-medium">Profile</div>
          <div className="text-xs font-black text-gray-800 dark:text-white">Account</div>
        </div>
      </button>
    </div>
  );
};

export default QuickActionsBar;
