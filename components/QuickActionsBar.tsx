import React from 'react';

interface QuickActionsBarProps {
  onGoPromos: () => void;
  onGoWallet: () => void;
  onGoAccount: () => void;
}

const QuickActionsBar: React.FC<QuickActionsBarProps> = ({ onGoPromos, onGoWallet, onGoAccount }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        onClick={onGoPromos}
        className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-md p-2 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition"
      >
        <div className="text-xs text-gray-500 dark:text-gray-400">Promotions</div>
        <div className="text-sm font-bold text-gray-800 dark:text-white">Offers</div>
      </button>
      <button
        onClick={onGoWallet}
        className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-md p-2 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition"
      >
        <div className="text-xs text-gray-500 dark:text-gray-400">Cashier</div>
        <div className="text-sm font-bold text-gray-800 dark:text-white">Wallet</div>
      </button>
      <button
        onClick={onGoAccount}
        className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-md p-2 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition"
      >
        <div className="text-xs text-gray-500 dark:text-gray-400">Profile</div>
        <div className="text-sm font-bold text-gray-800 dark:text-white">Account</div>
      </button>
    </div>
  );
};

export default QuickActionsBar;
