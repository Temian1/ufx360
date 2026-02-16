import React from 'react';

interface CasinoComingSoonProps {
  category: string;
  onBack: () => void;
}

const categoryMeta: Record<string, { icon: string; title: string; description: string }> = {
  casino: { icon: 'casino', title: 'Casino', description: 'Live dealers, roulette, blackjack and more' },
  slot: { icon: 'attractions', title: 'Slots', description: 'Hundreds of exciting slot games' },
  table: { icon: 'table_restaurant', title: 'Table Games', description: 'Poker, baccarat, craps and classics' },
  fishing: { icon: 'phishing', title: 'Fishing Games', description: 'Fun fishing arcade games' },
  lottery: { icon: 'confirmation_number', title: 'Lottery', description: 'Daily draws and instant wins' },
  arcade: { icon: 'stadia_controller', title: 'Arcade', description: 'Casual games and instant play' },
};

const CasinoComingSoon: React.FC<CasinoComingSoonProps> = ({ category, onBack }) => {
  const meta = categoryMeta[category] || categoryMeta.casino;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {/* Animated icon */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute w-32 h-32 rounded-full bg-primary/10 dark:bg-bet-yellow/10 animate-ping-slow" />
          <div className="absolute w-24 h-24 rounded-full bg-primary/20 dark:bg-bet-yellow/20" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-emerald-600 dark:from-bet-yellow dark:to-yellow-500 flex items-center justify-center shadow-xl">
            <span className="material-symbols-outlined text-4xl text-white dark:text-gray-900">{meta.icon}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">
          {meta.title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {meta.description}
        </p>

        {/* Coming Soon badge */}
        <div className="inline-flex items-center gap-2 bg-bet-yellow/20 dark:bg-bet-yellow/10 border border-bet-yellow/50 rounded-full px-5 py-2.5 mb-6">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bet-yellow opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-bet-yellow" />
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-bet-yellow">Coming Soon</span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-8 leading-relaxed max-w-sm mx-auto">
          We're working hard to bring you an amazing {meta.title.toLowerCase()} experience.
          Stay tuned for updates — it's going to be worth the wait!
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: 'security', label: 'Secure' },
            { icon: 'bolt', label: 'Fast' },
            { icon: 'stars', label: 'Premium' },
          ].map((f) => (
            <div key={f.label} className="bg-white dark:bg-surface-dark rounded-xl p-3 border border-gray-200 dark:border-gray-700">
              <span className="material-symbols-outlined text-primary dark:text-bet-yellow text-xl mb-1 block">{f.icon}</span>
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">{f.label}</span>
            </div>
          ))}
        </div>

        {/* Back button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-primary text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-primary/90 transition active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default CasinoComingSoon;
